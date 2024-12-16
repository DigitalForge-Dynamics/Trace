/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect } from "vitest";

import type { Tokens } from "../../utils/types/authenticationTypes";

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
    const tokens = await response.json() as Tokens;
    expect(tokens).toEqual({
      accessToken: expect.any(String),
      idToken: expect.any(String),
      refreshToken: expect.any(String),
    });
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
    const { refreshToken } = await response_1.json() as Tokens;

    // When
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        ...headers,
        authorization: `Bearer ${refreshToken}`,
      },
    });

    // Then
    expect(response.status).toBe(200);
    const idToken = await response.text();
    expect(idToken).toMatch(/^eyJ/);
  });
});

