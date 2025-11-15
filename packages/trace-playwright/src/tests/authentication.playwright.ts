import { test, expect } from "@playwright/test";
import { Homepage } from "../models/homepage";
import { KeycloakLogin } from "../models/keycloak";
import { config } from "dotenv";
import { waitFor } from "../utils";

config({ quiet: true });

test.skip("Is able to login, using an existing IdP token", async ({ context }) => {
  void context;
});

test("Is able to login, using OIDC against an IdP", async ({ context }) => {
  const page = await context.newPage();
  const homepage = new Homepage(page);
  await homepage.goto();
  await homepage.login();

  const keycloak = new KeycloakLogin(page);
  await keycloak.login(process.env.KEYCLOAK_USERNAME!, process.env.KEYCLOAK_PASSWORD!);

  await waitFor(() => !page.url().includes("/oidc-callback"));
  const url = new URL(page.url());
  expect(url.pathname).toBe("/");

  const search = Object.fromEntries(url.searchParams.entries());
  expect(search).not.toMatchObject({
    state: expect.any(String),
    code: expect.any(String),
  });
});

test.skip("Is able to logout", () => {});
