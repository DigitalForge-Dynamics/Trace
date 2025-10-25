import { describe, expect, it } from "bun:test";
import { APIClient, NetClient } from "./client.ts";

describe("APIClient", () => {
  const netClient = new NetClient(new URL("http://localhost:3000"));
  const apiClient = new APIClient(netClient);

  describe("getHealth", () => {
    it("Returns a successful contents", async () => {
      const response = await apiClient.getHealth();
      console.log(response);
      expect(response).toStrictEqual({
        health: "OK",
      });
    });
  });
});
