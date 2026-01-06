import { Buffer } from "node:buffer";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { randomUUIDv7, type SQL } from "bun";

// Conventions:
// - createXXX - Created a new DB entry, returning the newly created entry.
// - linkXXX - Create a new DB entry, in a table that links other tables. Does not create a new ID, rather using compound keys.
// - getXXX - Retrieve an entry or null, by ID. Returns entry or null.
// - listXXX - Retrieve an array of all entries in a table.
// - findXXX - Retrieves an enttry or null, by linked ID's. Used where a unique constraint exists.
// - searchXXX - Retrieves an array of entries in a table, based on search criteria.

type CreateUser = { username: string };
type User = { uid: string; username: string };

type CreateIdp = { issuer: URL; label: string; audience: string; subject?: RegExp };
type Idp = Required<CreateIdp> & { uid: string };
type IdpModel = Omit<Idp, "issuer" | "subject"> & { issuer: string; subject: string };

type CreateLocation = { name: string };
type Location = CreateLocation & { uid: string };

type CreateAsset = { locationId: string };
type Asset = Omit<CreateAsset, "locationId"> & { uid: string; location: string; user: string | null };

type AssetMove = { locationId: string; time: Date };
type AssetMoveModel = Omit<AssetMove, "time" | "locationId"> & { timestamp: number; location: string };

type AssetAssignment = { userId: string; time: Date };
type AssetAssignmentModel = Omit<AssetAssignment, "userId" | "time"> & { user: string; timestamp: number };

type MigrationModel = { name: string; md5sum: Uint8Array };

class Database {
  private readonly driver: SQL;

  constructor(driver: SQL) {
    this.driver = driver;
  }

  async migrate(): Promise<void> {
    await this.driver`
      CREATE TABLE IF NOT EXISTS _trace_migrations (
        name STRING PRIMARY KEY NOT NULL,
        md5sum BYTES(32) NOT NULL
      );
    `;

    const dir = path.join(import.meta.dirname, "..", "migrations");
    const migrations = await readdir(dir);
    migrations.sort();

    for (const migrationName of migrations) {
      const file = Bun.file(path.join(dir, migrationName));
      await this.driver.transaction(async (tx) => {
        const applied: [] | [MigrationModel] = await tx`SELECT * FROM _trace_migrations WHERE name = ${migrationName};`;
        const md5sum = Bun.MD5.hash(await file.arrayBuffer(), "hex");
        if (applied.length !== 0) {
          const previous = new Buffer(applied[0].md5sum).toHex();
          if (previous !== md5sum) {
            throw new Error(`Migration file modified. Previously applied: ${previous}. Found: ${md5sum}.`);
          }
          console.log(`Already applied: ${migrationName}`);
          return;
        }
        await tx.file(path.join(dir, migrationName));
        await tx`
          INSERT INTO _trace_migrations (name, md5sum)
          VALUES (${migrationName}, ${Bun.MD5.hash(await file.arrayBuffer())})
        `;
      });
    }
  }

  async createUser(user: CreateUser): Promise<User> {
    const uid = randomUUIDv7();
    const [createdUser] = await this.driver`
        INSERT INTO users (uid, username)
        VALUES (${uid}, ${user.username})
        RETURNING *
    `;
    return createdUser;
  }

  async getUser(userId: string): Promise<User | null> {
    const response = await this.driver`
        SELECT * FROM users
        WHERE uid = ${userId}
    `;
    if (response.length === 0) {
      return null;
    }
    if (response.length > 1) {
      throw new Error("Duplicate User IDs");
    }
    return response[0];
  }

  async findUser(idpIssuer: URL, idpSub: string): Promise<User | null> {
    const response = await this.driver`
        SELECT users.* FROM users, user_idps, idps
        WHERE user_idps.sub = ${idpSub}
        AND user_idps.idp = idps.uid
        AND users.uid = user_idps.user
        AND idps.issuer = ${idpIssuer.toString()}
    `;
    if (response.length === 0) {
      return null;
    }
    if (response.length > 1) {
      throw new Error("Duplicate idp user");
    }
    return response[0];
  }

  async createIdp(idp: CreateIdp): Promise<Idp> {
    const uid = randomUUIDv7();
    const [response] = await this.driver.transaction(async (tx) => {
      const db = new Database(tx);
      const idpCheck = await db.findIdp(idp.issuer);
      if (idpCheck !== null) {
        throw new Error("IDP Issuer already exists");
      }
      return await this.driver`
            INSERT INTO idps (uid, issuer, label, audience, subject)
            VALUES (${uid}, ${idp.issuer.toString()}, ${idp.label}, ${idp.audience}, ${idp.subject?.source ?? "/^.*$/"})
            RETURNING *
      `;
    });
    return {
      ...response,
      issuer: new URL(response.issuer),
      subject: new RegExp(response.subject),
    };
  }

  async findIdp(issuer: URL): Promise<Idp | null> {
    const response = await this.driver`
        SELECT * FROM idps
        WHERE idps.issuer = ${issuer.toString()}
    `;
    if (response.length === 0) {
      return null;
    }
    if (response.length > 1) {
      throw new Error("Duplicate IdPs.");
    }
    const [idp] = response;
    return {
      ...idp,
      issuer: new URL(idp.issuer),
      subject: new RegExp(idp.subject),
    };
  }

  async getIdp(idpId: string): Promise<Idp | null> {
    const response = await this.driver`
        SELECT * from idps
        WHERE uid = ${idpId}
    `;
    if (response.length === 0) {
      return null;
    }
    if (response.length > 1) {
      throw new Error("Duplicate IDP IDs");
    }
    return response[0];
  }

  async listIdps(): Promise<Idp[]> {
    const response = await this.driver`
        SELECT * FROM idps
    `;
    return response.map((idp: IdpModel) => ({
      ...idp,
      issuer: new URL(idp.issuer),
      subject: new RegExp(idp.subject),
    }));
  }

  async linkUser(userId: string, idpId: string, idpSub: string): Promise<void> {
    await this.driver.transaction(async (tx) => {
      const db = new Database(tx);
      const idpCheck = await db.getIdp(idpId);
      if (idpCheck === null) {
        throw new Error("Invalid IDP ID");
      }
      const userCheck = await db.getUser(userId);
      if (userCheck === null) {
        throw new Error("Invalid User ID");
      }
      const linkCheck = await db.findUser(idpCheck.issuer, idpSub);

      if (linkCheck !== null && linkCheck.uid !== userId) {
        throw new Error("IDP User already linked to another user");
      }
      if (linkCheck !== null && linkCheck.uid === userId) {
        // IDP, Sub already linked to current user
        return;
      }

      await tx`
          INSERT INTO user_idps (idp, sub, user)
          VALUES (${idpId}, ${idpSub}, ${userId})
      `;
    });
  }

  async createLocation(location: CreateLocation): Promise<Location> {
    const uid = randomUUIDv7();
    const [response] = await this.driver`
        INSERT INTO locations (uid, name)
        VALUES (${uid}, ${location.name})
        RETURNING *
    `;
    return response;
  }

  async getLocation(locationId: string): Promise<Location | null> {
    const response = await this.driver`
        SELECT * FROM locations
        WHERE locations.uid = ${locationId}
    `;
    if (response.length === 0) {
      return null;
    }
    if (response.length > 1) {
      throw new Error("Duplication Location ID");
    }
    return response[0];
  }

  async listLocations(): Promise<Location[]> {
    const response = await this.driver`
        SELECT * FROM locations
    `;
    return response;
  }

  async createAsset(asset: CreateAsset): Promise<Asset> {
    const uid = randomUUIDv7();
    const [response] = await this.driver.transaction(async (tx) => {
      const db = new Database(tx);
      const locationCheck = await db.getLocation(asset.locationId);
      if (locationCheck === null) {
        throw new Error("Invalid Location ID");
      }

      return await tx`
          INSERT INTO assets (uid, location)
          VALUES (${uid}, ${asset.locationId})
          RETURNING *
      `;
    });
    return response;
  }

  async getAsset(assetId: string): Promise<Asset | null> {
    const response = await this.driver`
        SELECT * FROM assets
        WHERE assets.uid = ${assetId}
    `;
    if (response.length === 0) {
      return null;
    }
    if (response.length > 1) {
      throw new Error("Duplicate Asset IDs");
    }
    return response[0];
  }

  async listAssets(): Promise<Asset[]> {
    const response = await this.driver`
        SELECT * FROM assets
    `;
    return response;
  }

  async moveAsset(assetId: string, locationId: string): Promise<void> {
    const now = Date.now();
    await this.driver.transaction(async (tx) => {
      const db = new Database(tx);

      const assetCheck = await db.getAsset(assetId);
      if (assetCheck === null) {
        throw new Error("Invalid Asset ID");
      }
      const locationCheck = await db.getLocation(locationId);
      if (locationCheck === null) {
        throw new Error("Invalid Location ID");
      }

      if (assetCheck.location === locationId) {
        // Already located in `locationId`.
        return;
      }

      await tx`
          UPDATE assets SET location = ${locationId} WHERE uid = ${assetId}
      `;
      await tx`
          INSERT INTO asset_movements (asset, location, timestamp)
          VALUES (${assetId},  ${locationId}, ${now})
      `;
    });
  }

  async assignAsset(assetId: string, userId: string): Promise<void> {
    const now = Date.now();
    await this.driver.transaction(async (tx) => {
      const db = new Database(tx);

      const assetCheck = await db.getAsset(assetId);
      if (assetCheck === null) {
        throw new Error("Invalid Asset ID");
      }
      const userCheck = await db.getUser(userId);
      if (userCheck === null) {
        throw new Error("Invalid User ID");
      }
      if (assetCheck.user === userId) {
        // Already assigned to `userId`.
        return;
      }

      await tx`
        UPDATE assets
        SET user = ${userId}
        WHERE uid = ${assetId}
      `;

      await tx`
          INSERT INTO asset_assignments (asset, user, timestamp)
          VALUES (${assetId}, ${userId}, ${now})
      `;
    });
  }

  async auditAssetMoves(assetId: string): Promise<AssetMove[]> {
    const moves = await this.driver`
        SELECT * FROM asset_movements
        WHERE asset = ${assetId}
    `;
    return moves.map((move: AssetMoveModel) => ({
      locationId: move.location,
      time: new Date(move.timestamp),
    }));
  }

  async auditAssetAssignments(assetId: string): Promise<AssetAssignment[]> {
    const assignments = await this.driver.transaction(async (tx) => {
      const db = new Database(tx);
      const assetCheck = await db.getAsset(assetId);
      if (assetCheck === null) {
        throw new Error("Invalid Asset ID");
      }

      return await tx`
          SELECT * FROM asset_assignments
          WHERE asset = ${assetId}
      `;
    });
    return assignments.map((assignment: AssetAssignmentModel) => ({
      userId: assignment.user,
      time: new Date(assignment.timestamp),
    }));
  }
}

export { Database };
