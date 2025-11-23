import { randomUUIDv7, type SQL } from "bun";

type CreateUser = { username: string };
type User = { uid: string; username: string };

type CreateIdp = { issuer: URL };
type Idp = { uid: string; issuer: URL };

class Database {
  private readonly driver: SQL;

  constructor(driver: SQL) {
    this.driver = driver;
  }

  async baseline(): Promise<void> {
    await this.driver`
		CREATE TABLE users (
			uid BINARY(16) PRIMARY KEY,
			username STRING
		)
	`;
    await this.driver`
		CREATE TABLE idps (
			uid BINARY(16) PRIMARY KEY,
			issuer URL
		)
	`;
    await this.driver`
		CREATE TABLE user_idps (
			idp BINARY(16),
			sub STRING,
			user BINARY(16),
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
		INSERT INTO idps (uid, issuer)
		VALUES (${uid}, ${idp.issuer.toString()})
		RETURNING *
	`;
    return {
      ...response,
      issuer: new URL(response.issuer),
    };
  }

  async findIdp(issuer: URL): Promise<Idp | null> {
    const response = await this.driver`
		SELECT * from idps
		WHERE idps.issuer = ${issuer.toString()}
	`;
    return response;
  }

  async linkUser(userId: string, idpId: string, idpSub: string): Promise<void> {
    await this.driver`
		INSERT INTO user_idps (idp, sub, user)
		VALUES (${idpId}, ${idpSub}, ${userId})
	`;
  }
}

export { Database };
