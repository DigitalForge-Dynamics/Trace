import AuthService from "../../services/AuthenticationService";
import { AssetAttributes, Scope } from "../../utils/types/attributeTypes";
import { testAsset } from "../helpers/testData";
const { API_PORT } = process.env;

const API_URL = `http://localhost:${API_PORT}`;

const headers = {
  authorization: '',
  'Content-Type': 'application/json',
};

describe("POST /assets", () => {
  let asset: AssetAttributes;
  let authService: AuthService;

  beforeEach(() => {
    asset = JSON.parse(JSON.stringify(testAsset));
    asset.id = Math.floor(Math.random() * 10000);
    authService = new AuthService();
  });

  afterEach(async () => {
    headers.authorization = `Bearer ${authService.generateAccessToken(["TRACE_ASSET_DELETE" as Scope], "TEST_USER")}`;
    await fetch(`${API_URL}/assets/${testAsset.id}`, {
      method: 'DELETE',
      headers,
    });
  });

  it('It creates an Asset', async () => {
    // Given
    headers.authorization = `Bearer ${authService.generateAccessToken(["TRACE_READ" as Scope, "TRACE_ASSET_CREATE" as Scope], "TEST_USER")}`;

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

  it('Sets a 401 status when the user is unauthenticated', async () => {
    // Given
    delete (headers as any).authorization;

    // When
    const response = await fetch(`${API_URL}/assets`, {
      method: 'POST',
      body: JSON.stringify(asset),
      headers,
    });

    // Then
    const text = await response.text();
    expect(response.status).toBe(401);
    expect(text).toBe("");
  });

  it('Sets a 403 status when the user is unauthorised', async () => {
    // Given
    headers.authorization = `Bearer ${authService.generateAccessToken([], "TEST_USER")}`;

    // When
    const response = await fetch(`${API_URL}/assets`, {
      method: 'POST',
      body: JSON.stringify(asset),
      headers,
    });

    // Then
    const text = await response.text();
    expect(response.status).toBe(403);
    expect(text).toBe("");
  });
});
