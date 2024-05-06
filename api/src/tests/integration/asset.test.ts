import { signIn } from "../helpers/accounts";
import { testCreationAsset } from "../helpers/testData";
const { API_PORT } = process.env;

const API_URL = `http://localhost:${API_PORT}`;

const headers = {
  authorization: '',
  'Content-Type': 'application/json',
};

describe("POST /assets", () => {
  it('It creates an Asset', async () => {
    // Given
    const { accessToken } = await signIn("TEST_USER_CREATE", "TEST_USER_CREATE_PASSWORD");
    headers.authorization = `Bearer ${accessToken}`;

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
    const { accessToken } = await signIn("TEST_USER_NONE", "TEST_USER_NONE_PASSWORD");
    headers.authorization = `Bearer ${accessToken}`;

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
