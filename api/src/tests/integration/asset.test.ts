import AuthService from "../../services/AuthenticationService";
import { Scope } from "../../utils/types/attributeTypes";
import { testCreationAsset } from "../helpers/testData";
const { API_PORT } = process.env;

const API_URL = `http://localhost:${API_PORT}`;

const headers = {
  authorization: '',
  'Content-Type': 'application/json',
};

describe("POST /assets", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it('It creates an Asset', async () => {
    // Given
    headers.authorization = `Bearer ${authService.generateAccessToken(["TRACE_READ" as Scope, "TRACE_ASSET_CREATE" as Scope], "TEST_USER")}`;

    // When
    const response = await fetch(`${API_URL}/assets`, {
      method: 'POST',
      body: JSON.stringify(testCreationAsset),
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
      body: JSON.stringify(testCreationAsset),
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
      body: JSON.stringify(testCreationAsset),
      headers,
    });

    // Then
    const text = await response.text();
    expect(response.status).toBe(403);
    expect(text).toBe("");
  });
});
