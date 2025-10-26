import { beforeAll, describe, expect, it } from "bun:test";
import { startServer } from "trace-api";
import { APIClient, NetClient } from "./client.ts";

describe("APIClient", () => {
  let port: number;
  let netClient: NetClient;
  let apiClient: APIClient;
  beforeAll(() => {
    port = 3000 + Math.floor(1000 * Math.random());
    const apiServer = startServer(port);
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
