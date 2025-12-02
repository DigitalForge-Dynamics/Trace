import { beforeAll, describe, expect, it } from "bun:test";
import { randomUUIDv7 } from "bun";
import { startServer } from "trace-api";
import type { CreateUserRequest, LinkUserIdpRequest } from "trace-schemas";
import { APIClient, NetClient } from "./client.ts";

describe("Integration: APIClient", () => {
  let apiClient: APIClient;

  beforeAll(async () => {
    const apiServer = await startServer(0);
    const netClient = new NetClient(apiServer.url);
    apiClient = new APIClient(netClient);
  });

  describe("Tests getHealth() Method", () => {
    it("Returns a successful contents", async () => {
      const response = await apiClient.getHealth();
      expect(response).toStrictEqual({
        health: "OK",
      });
    });
  });

  describe("Tests authenticateOidc(string) Method", () => {
    it.if(Bun.env.IDP_TOKEN !== undefined)("Returns the validated token claims.", async () => {
      const idpToken = Bun.env.IDP_TOKEN as Exclude<typeof Bun.env.IDP_TOKEN, undefined>;
      const idpTokenPayload = JSON.parse(atob(idpToken.split(".")[1] ?? ""));
      const user = await apiClient.createUser({ username: "IDP_TOKEN" });
      await apiClient.linkUserIdp({
        userId: user.uid,
        sub: idpTokenPayload.sub,
        idp: new URL(idpTokenPayload.iss),
      });

      const response = await apiClient.authenticateOidc(idpToken);
      expect(response).toMatchObject({
        message: "Authenticated",
        data: {
          sub: expect.any(String),
          iss: expect.any(URL),
          aud: expect.any(String),
          iat: expect.any(Date),
          exp: expect.any(Date),
        },
      });
    });
  });

  describe("Tests getOidcConfig() Method", () => {
    it("Returns a successful contents", async () => {
      const response = await apiClient.getOidcConfig();
      expect(response.config).toBeArray();
      for (const idp of response.config) {
        expect(idp).toStrictEqual({
          issuer: expect.any(URL),
          audience: expect.any(String),
          label: expect.any(String),
          uid: expect.any(String),
        });
        expect(idp.audience).not.toBeEmpty();
        expect(idp.label).not.toBeEmpty();
      }
    });
  });

  describe("Tests createUser() Method", () => {
    const createInfo: CreateUserRequest = { username: "Foo" };
    it("Returns a successful contents", async () => {
      const response = await apiClient.createUser(createInfo);
      expect(response).toStrictEqual({
        ...createInfo,
        uid: expect.any(String),
      });
    });
  });

  describe("Tests linkUserIdp() Method", () => {
    const linkInfo: Omit<LinkUserIdpRequest, "userId"> = {
      idp: new URL("https://token.actions.githubusercontent.com"),
      sub: randomUUIDv7(),
    };
    it("Returns a successful response", async () => {
      const user = await apiClient.createUser({ username: "Foo" });
      const response = await apiClient.linkUserIdp({
        ...linkInfo,
        userId: user.uid,
      });
      expect(response).toBeUndefined();
    });
  });
});
