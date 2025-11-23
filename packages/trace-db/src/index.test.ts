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
        username: "test",
        uid: expect.stringMatching(uuidRegex),
      });
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
      await expect(db.findUser(idp.issuer, "foo")).resolves.toStrictEqual(createdUser);
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
});
