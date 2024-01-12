import supertest from "supertest";
import server from "../../index";
import AssetController from "../../controllers/AssetsController";
import { testAsset } from "../helpers/TestData";

const request = supertest(server);

jest.mock("../../database/config/databaseClient");

jest.mock("../../database/models/asset.model");

describe("Integration Tests for Asset Router Endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Retrieves all assets with 200 Status Code from Get All Assets Endpoint", async () => {
    jest.spyOn(new AssetController(), "findAll").mockImplementation(() => {
      return Promise.resolve([testAsset]);
    });

    const response = await request.post("/assets");

    expect(response.status).toBe(200);
    expect(response.body[0]).toBe(testAsset);
  });
});
