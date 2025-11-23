import { randomUUIDv7, type SQL } from "bun";

type CreateUser = { username: string };
type User = { uid: string; username: string };

type CreateIdp = { issuer: URL; label: string; audience: string; subject?: RegExp };
type Idp = Required<CreateIdp> & { uid: string };
type IdpModel = Omit<Idp, "issuer" | "subject"> & { issuer: string; subject: string };

class Database {
  private readonly driver: SQL;

  constructor(driver: SQL) {
    this.driver = driver;
  }

  async baseline(): Promise<void> {
    await this.driver`
		CREATE TABLE users (
			uid BINARY(16) PRIMARY KEY NOT NULL,
			username STRING NOT NULL
		)
	`;
    await this.driver`
		CREATE TABLE idps (
			uid BINARY(16) PRIMARY KEY NOT NULL,
			issuer URL NOT NULL,
			label STRING NOT NULL,
			audience STRING NOT NULL,
			subject STRING NOT NULL
		)
	`;
    await this.driver`
		CREATE TABLE user_idps (
			idp BINARY(16) NOT NULL,
			sub STRING NOT NULL,
			user BINARY(16) NOT NULL,
			PRIMARY KEY (idp, sub)
			FOREIGN KEY (idp) REFERENCES idps(uid),
			FOREIGN KEY (user) REFERENCES users(uid)
		)
	`;
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

  async findUser(idpIssuer: URL, idpSub: string): Promise<User | null> {
    const response = await this.driver`
		SELECT users.* FROM users, user_idps, idps
		WHERE user_idps.sub = ${idpSub}
		AND user_idps.idp = idps.uid
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
    const [response] = await this.driver`
		INSERT INTO idps (uid, issuer, label, audience, subject)
		VALUES (${uid}, ${idp.issuer.toString()}, ${idp.label}, ${idp.audience}, ${idp.subject?.source ?? "/^.*$/"})
		RETURNING *
	`;
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
    await this.driver`
		INSERT INTO user_idps (idp, sub, user)
		VALUES (${idpId}, ${idpSub}, ${userId})
	`;
  }
}

export { Database };
