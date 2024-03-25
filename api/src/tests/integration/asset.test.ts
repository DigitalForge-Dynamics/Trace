import { AssetAttributes } from "../../utils/types/attributeTypes";
import { testAsset } from "../helpers/testData";
const { API_PORT } = process.env;

const API_URL = `http://localhost:${API_PORT}`;

const headers = {
  authorization: 'Bearer',
  'Content-Type': 'application/json',
};

describe("POST /assets", () => {
  let asset: AssetAttributes;

  beforeEach(() => {
    asset = JSON.parse(JSON.stringify(testAsset));
    asset.id = Math.floor(Math.random() * 10000);
  });

  afterEach(async () => {
    await fetch(`${API_URL}/assets/${testAsset.id}`, {
      method: 'DELETE',
      headers,
    });
  });

  it('It creates an Asset', async () => {
    // Given

    // When
    const response = await fetch(`${API_URL}/assets`, {
      method: 'POST',
      body: JSON.stringify(asset),
      headers,
    });

    // Then
    const text = await response.text();
    expect(response.status).toBe(204);
    expect(text).toBe("");
  });

  it.skip('Sets a 401 status when the user is unauthenticated', async () => {
    const response = await fetch(`${API_URL}/assets`, {
      method: 'POST',
      body: JSON.stringify(asset),
      headers,
    });
    const text = await response.text();
    expect(text).toBe("");
    expect(response.status).toBe(401);
  });

  it.skip('Sets a 403 status when the user is unauthorised', () => {
    throw new Error('Unimplemented');
  });
});
