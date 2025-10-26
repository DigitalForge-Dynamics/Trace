import { beforeAll, describe, expect, it } from "bun:test";
import { APIClient, NetClient } from "./client.ts";
import { server } from "trace-api";

describe("APIClient", () => {
  let port: number;
  let netClient: NetClient;
  let apiClient: APIClient;
  beforeAll(() => {
    port = 3000 + Math.floor(1000 * Math.random());
    const apiServer = server(port);
    netClient = new NetClient(apiServer.url);
    apiClient = new APIClient(netClient);
  });

  describe("Integration: Tests getHealth() Method", () => {
    it("Returns a successful contents", async () => {
      const response = await apiClient.getHealth();
      expect(response).toStrictEqual({
        health: "OK",
      });
    });
  });
});
