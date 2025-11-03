import { beforeAll, describe, expect, it } from "bun:test";
import { startServer } from "trace-api";
import { APIClient, NetClient } from "./client.ts";

describe("Integration: APIClient", () => {
  let apiClient: APIClient;

  beforeAll(() => {
    const port = 3000 + Math.floor(1000 * Math.random());
    const apiServer = startServer(port);
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
});
