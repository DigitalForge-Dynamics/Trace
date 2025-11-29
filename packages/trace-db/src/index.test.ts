import { beforeEach, describe, expect, it } from "bun:test";
import { SQL } from "bun";
import { Database } from "./index.ts";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe("Database", () => {
  let db: Database;

  beforeEach(async () => {
    const sql = new SQL("sqlite://:memory:");
    db = new Database(sql);
    await db.baseline();
  });

  it("Is able to baseline an SQLITE database", async () => {
    const sqlite = new SQL("sqlite://:memory:");
    const sqliteDb = new Database(sqlite);
    await sqliteDb.baseline();
  });

  describe("Users", () => {
    it("Is able to create a user", async () => {
      const user = await db.createUser({ username: "test" });
      expect(user).toStrictEqual({
        uid: expect.stringMatching(uuidRegex),
        username: "test",
      });
    });

    it("getUser returns the created user if it exists", async () => {
      const createdUser = await db.createUser({ username: "Foo" });
      const gotUser = await db.getUser(createdUser.uid);
      expect(gotUser).toStrictEqual(createdUser);
    });

    it("getUser returns null if the user does not exist", async () => {
      const gotUser = await db.getUser("");
      expect(gotUser).toBeNull();
    });

    it("findUser returns null if the user does not exist", async () => {
      const idp = await db.createIdp({ issuer: new URL("https://localhost:0"), label: "Foo", audience: "Bar" });
      const foundUser = await db.findUser(idp.issuer, "");
      expect(foundUser).toBeNull();
    });

    it("Is able to retrieve a created user", async () => {
      const createdUser = await db.createUser({ username: "test" });
      const idp = await db.createIdp({ issuer: new URL("https://localhost:0"), label: "Foo", audience: "Bar" });
      await db.linkUser(createdUser.uid, idp.uid, "foo");

      const foundUser = await db.findUser(idp.issuer, "foo");
      await expect(foundUser).toStrictEqual(createdUser);
    });
  });

  describe("Idps", () => {
    it("Is able to create an IdP", async () => {
      const idp = await db.createIdp({ issuer: new URL("https://localhost:0"), label: "Foo", audience: "Bar" });
      expect(idp).toStrictEqual({
        issuer: new URL("https://localhost:0"),
        uid: expect.stringMatching(uuidRegex),
        label: "Foo",
        audience: "Bar",
        subject: expect.any(RegExp),
      });
    });

    it("Does not create a new IDP for the same issuer", async () => {
      await db.createIdp({ issuer: new URL("https://localhost:0"), label: "Foo", audience: "Bar" });
      await expect(
        db.createIdp({ issuer: new URL("https://localhost:0"), label: "Foo", audience: "Bar" }),
      ).rejects.toStrictEqual(new Error("IDP Issuer already exists"));
    });

    it("Is able to find an IdP", async () => {
      const createdIdp = await db.createIdp({ issuer: new URL("https://localhost:0"), label: "Foo", audience: "Bar" });
      const foundIdP = await db.findIdp(new URL("https://localhost:0"));
      expect(foundIdP).toStrictEqual(createdIdp);
    });

    it("findIdp returns null if the IdP does not exist", async () => {
      await expect(db.findIdp(new URL("https://localhost:0"))).resolves.toBeNull();
    });

    it("listIdps returns an empty list if there are no IdPs", async () => {
      await expect(db.listIdps()).resolves.toBeArrayOfSize(0);
    });

    it("listIdps maps non-string fields", async () => {
      const createdIdp = await db.createIdp({ issuer: new URL("https://localhost:0"), label: "Foo", audience: "Bar" });
      await expect(db.listIdps()).resolves.toStrictEqual([createdIdp]);
    });
  });

  describe("User IDPs", () => {
    let userId: string;
    let idpId: string;

    beforeEach(async () => {
      const user = await db.createUser({ username: "Foo" });
      const idp = await db.createIdp({ issuer: new URL("https://localhost:0"), label: "Baz", audience: "Bar" });
      userId = user.uid;
      idpId = idp.uid;
    });

    it("Is able to link a user with an IDP", async () => {
      await db.linkUser(userId, idpId, "Foo");
    });

    it("Requires the user to exist", async () => {
      await expect(db.linkUser("", idpId, "Foo")).rejects.toStrictEqual(new Error("Invalid User ID"));
    });

    it("Requires the IDP to exist", async () => {
      await expect(db.linkUser(userId, "", "Foo")).rejects.toStrictEqual(new Error("Invalid IDP ID"));
    });

    it("Is able to link a user to multiple IDP Subs", async () => {
      await db.linkUser(userId, idpId, "Foo");
      await db.linkUser(userId, idpId, "Bar");
    });
    it("Is able to link a user to multiple IDPs", async () => {
      const idpTwo = await db.createIdp({ issuer: new URL("https://localhost:1"), label: "Baz", audience: "Bar" });
      await db.linkUser(userId, idpId, "Foo");
      await db.linkUser(userId, idpTwo.uid, "Foo");
    });

    it("Does not override an existing link", async () => {
      const userTwo = await db.createUser({ username: "Bar" });
      await db.linkUser(userId, idpId, "Foo");
      await expect(db.linkUser(userTwo.uid, idpId, "Foo")).rejects.toStrictEqual(
        new Error("IDP User already linked to another user"),
      );
    });

    it("Does not create an already existing link", async () => {
      await db.linkUser(userId, idpId, "Foo");
      await db.linkUser(userId, idpId, "Foo");
    });
  });

  describe("Locations", () => {
    it("Is able to create a location", async () => {
      const location = await db.createLocation({ name: "Foo" });
      expect(location.name).toBe("Foo");
      expect(location.uid).toMatch(uuidRegex);
    });

    it("Is able to get a location", async () => {
      const createdLocation = await db.createLocation({ name: "Foo" });
      const foundLocation = await db.getLocation(createdLocation.uid);
      expect(foundLocation).toStrictEqual(createdLocation);
    });

    it("Is able to list locations", async () => {
      const createdLocation = await db.createLocation({ name: "Foo" });
      const locations = await db.listLocations();
      expect(locations).toStrictEqual([createdLocation]);
    });

    it("getLocation returns null if not found", async () => {
      const notFoundLocation = await db.getLocation("");
      expect(notFoundLocation).toBeNull();
    });
  });

  describe("Assets", () => {
    let locationId: string;
    beforeEach(async () => {
      const location = await db.createLocation({ name: "Foo" });
      locationId = location.uid;
    });

    it("Is able to create an asset", async () => {
      const asset = await db.createAsset({ locationId });
      expect(asset.uid).toMatch(uuidRegex);
    });

    it("Requires the location to exist", async () => {
      await expect(db.createAsset({ locationId: "" })).rejects.toStrictEqual(new Error("Invalid Location ID"));
    });

    it("Is able to get an asset", async () => {
      const createdAsset = await db.createAsset({ locationId });
      const gotAsset = await db.getAsset(createdAsset.uid);
      expect(gotAsset).toStrictEqual(createdAsset);
    });

    it("getAsset returns null if the asset does not exist", async () => {
      const gotAsset = await db.getAsset("");
      expect(gotAsset).toBeNull();
    });

    it("Is able to list assets", async () => {
      const createdAsset = await db.createAsset({ locationId });
      const assets = await db.listAssets();
      expect(assets).toStrictEqual([createdAsset]);
    });
  });

  describe("Asset Assignments", () => {
    let assetId: string;
    let userId: string;

    beforeEach(async () => {
      const location = await db.createLocation({ name: "Foo" });
      const asset = await db.createAsset({ locationId: location.uid });
      const user = await db.createUser({ username: "Bar" });
      assetId = asset.uid;
      userId = user.uid;
    });

    it("Is able to assign an asset", async () => {
      await db.assignAsset(assetId, userId);
    });

    it("Requires the asset to exist", async () => {
      await expect(db.assignAsset("", userId)).rejects.toStrictEqual(new Error("Invalid Asset ID"));
    });

    it("Requires the user to exist", async () => {
      await expect(db.assignAsset(assetId, "")).rejects.toStrictEqual(new Error("Invalid User ID"));
    });

    it("Creates an audit log of assignments", async () => {
      await db.assignAsset(assetId, userId);
      const assignments = await db.auditAssetAssignments(assetId);
      expect(assignments).toStrictEqual([
        {
          userId,
          time: expect.any(Date),
        },
      ]);
    });

    it("Does not create an audit log if assigning to current user", async () => {
      await db.assignAsset(assetId, userId);
      await expect(db.auditAssetAssignments(assetId)).resolves.toBeArrayOfSize(1);

      await db.assignAsset(assetId, userId);
      await expect(db.auditAssetAssignments(assetId)).resolves.toBeArrayOfSize(1);
    });

    it("Is able to re-assign an asset", async () => {
      const userTwo = await db.createUser({ username: "Bar" });
      await db.assignAsset(assetId, userId);
      await db.assignAsset(assetId, userTwo.uid);
    });
  });

  describe("Asset Movements", () => {
    let assetId: string;
    let locationOldId: string;
    let locationNewId: string;

    beforeEach(async () => {
      const locationOld = await db.createLocation({ name: "Old" });
      const locationNew = await db.createLocation({ name: "New" });
      const asset = await db.createAsset({ locationId: locationOld.uid });
      assetId = asset.uid;
      locationOldId = locationOld.uid;
      locationNewId = locationNew.uid;
    });

    it("Is able to move an asset", async () => {
      await db.moveAsset(assetId, locationNewId);
    });

    it("Requires the asset to exist", async () => {
      await expect(db.moveAsset("", locationNewId)).rejects.toStrictEqual(new Error("Invalid Asset ID"));
    });

    it("Requires the location to exist", async () => {
      await expect(db.moveAsset(assetId, "")).rejects.toStrictEqual(new Error("Invalid Location ID"));
    });

    it("Creates an audit log of moves", async () => {
      await db.moveAsset(assetId, locationNewId);
      const moves = await db.auditAssetMoves(assetId);
      await expect(moves).toStrictEqual([
        {
          locationId: locationNewId,
          time: expect.any(Date),
        },
      ]);
    });

    it("Is able to re-move an asset", async () => {
      await db.moveAsset(assetId, locationNewId);
      await db.moveAsset(assetId, locationOldId);
      await expect(db.auditAssetMoves(assetId)).resolves.toBeArrayOfSize(2);
    });

    it("Does not create an audit log if moving to current location", async () => {
      await db.moveAsset(assetId, locationOldId);
      const moves = await db.auditAssetMoves(assetId);
      expect(moves).toBeEmpty();
    });
  });
});
