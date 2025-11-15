import { test, expect } from "@playwright/test";
import { Homepage } from "../models/homepage";
import { KeycloakLogin } from "../models/keycloak";
import { config } from "dotenv";

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

  const url = new URL(page.url());
  expect(url.pathname).toBe("/oidc-callback");
  console.log(page.url());
});

test.skip("Is able to logout", () => {});
