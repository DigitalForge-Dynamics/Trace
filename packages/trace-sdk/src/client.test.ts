import { startServer } from "@DigitalForge-Dynamics/trace-api";
import type { CreateUserRequest, LinkUserIdpRequest } from "@DigitalForge-Dynamics/trace-schemas";
import { beforeAll, describe, expect, it } from "bun:test";
import { randomUUIDv7 } from "bun";
import { APIClient, NetClient } from "./client.ts";

const apiServer: ReturnType<typeof Bun.serve> = await startServer(0);

describe("Integration > APIClient > Unauthenticated", () => {
  let apiClient: APIClient;

  beforeAll(() => {
    const netClient = new NetClient(apiServer.url);
    apiClient = new APIClient(netClient);
  });

  describe("Tests getHealth() Method", () => {
    it("Returns successful contents", async () => {
      const response = await apiClient.getHealth();
      expect(response).toStrictEqual({
        health: "OK",
      });
    });
  });

  describe("Tests getOidcConfig() Method", () => {
    it("Returns successful contents", async () => {
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

  describe("Tests authenticateOidc(string) Method", () => {
    it.if(Bun.env.IDP_TOKEN !== undefined)("Returns the validated token claims.", async () => {
      const idpToken = Bun.env.IDP_TOKEN as Exclude<typeof Bun.env.IDP_TOKEN, undefined>;
      // Assumes IDP_TOKEN is already linked to a user.
      // This is most likely done through the TRACE_ADMIN bootstrap setup.

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
        token: expect.any(String),
      });
    });
  });

  describe("Tests getJWKS() Method", () => {
    it("Returns successful contents", async () => {
      const response = await apiClient.getJwks();
      expect(response.keys).toHaveLength(1);
    });
  });
});

describe.if(Bun.env.IDP_TOKEN !== undefined)("Integration > APIClient > Authenticated", () => {
  let apiClient: APIClient;

  beforeAll(async () => {
    const netClient = new NetClient(apiServer.url);
    apiClient = new APIClient(netClient);

    const idpToken = Bun.env.IDP_TOKEN as Exclude<typeof Bun.env.IDP_TOKEN, undefined>;
    const { token } = await apiClient.authenticateOidc(idpToken);
    netClient.setAuthorisation(token);
  });

  describe("Tests createUser() Method", () => {
    const createInfo: CreateUserRequest = { username: "Foo" };
    it("Returns successful contents", async () => {
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
    it("Returns successful response", async () => {
      const user = await apiClient.createUser({ username: "Foo" });
      const response = await apiClient.linkUserIdp({
        ...linkInfo,
        userId: user.uid,
      });
      expect(response).toBeUndefined();
    });
  });

  describe("Tests createLocation() Method", () => {
    it("Returns successful response", async () => {
      const response = await apiClient.createLocation({ name: "Foo" });
      expect(response).toStrictEqual({
        id: expect.any(String),
      });
    });
  });

  describe("Tests createAsset() Method", () => {
    it("Returns successful response", async () => {
      const location = await apiClient.createLocation({ name: "Foo" });
      const response = await apiClient.createAsset({ location: location.id });
      expect(response).toStrictEqual({
        id: expect.any(String),
      });
    });
  });

  describe("Tests getAsset() Method", () => {
    it("Returns successful response when an asset exists", async () => {
      const location = await apiClient.createLocation({ name: "Foo" });
      const asset = await apiClient.createAsset({ location: location.id });
      const response = await apiClient.getAsset({ id: asset.id });
      expect(response).toStrictEqual({
        id: asset.id,
        location: location.id,
        user: null,
      });
    });

    it("Returns null when an asset does not exist", async () => {
      const location = await apiClient.createLocation({ name: "Foo" });
      const asset = await apiClient.createAsset({ location: location.id });
      const response = await apiClient.getAsset({ id: asset.id });
      expect(response).toBeNull();
    });
  });
});
