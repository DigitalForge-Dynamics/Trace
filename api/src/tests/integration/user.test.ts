const { API_PORT } = process.env;

const API_URL = `http://localhost:${API_PORT}`;

const headers = {
  'Content-Type': 'application/json',
};

describe("POST /auth", () => {
  it.each<[string, string]>([
    ["TEST_ADMIN", "TEST_ADMIN_PASSWORD"],
    ["TEST_USER", "TEST_USER_PASSWORD"],
  ])
  ("Signs in with username %p", async (username, password) => {
  // Given
  const body = JSON.stringify({
    username,
    password,
  });

  // When
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers,
    body,
  });

  // Then
  expect(response.status).toBe(200);
  const tokens = await response.json();
  expect(tokens.accessToken).toBeDefined();
  expect(tokens.idToken).toBeDefined();
  expect(tokens.refreshToken).toBeDefined();
  });

  it("Refreshes an access token", async () => {
    // Given
    const body_1 = JSON.stringify({
      username: "TEST_USER",
      password: "TEST_USER_PASSWORD",
    });
    const response_1 = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers,
      body: body_1,
    });
    expect(response_1.status).toBe(200);
    const { refreshToken } = await response_1.json();

    // When
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        ...headers,
        authorization: `Bearer ${refreshToken}`,
      },
    });

    // Then
    const text = await response.text();
    expect(text).toBe("");
    expect(response.status).toBe(200);
    const idToken = await response.text();
    expect(idToken).toMatch(/^eyJ/);
  });
});

