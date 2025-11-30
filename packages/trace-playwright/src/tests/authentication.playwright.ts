import { expect, test } from "@playwright/test";
import { config } from "dotenv";
import { KeycloakLogin } from "../models/keycloak.ts";
import { Loginpage } from "../models/loginpage.ts";
import { waitForPredicate } from "../utils.ts";

config({ quiet: true });
const welcomeRegex = /^\nWelcome TRACE_ADMIN\n\n\n\t$/;


test("Is able to login, using OIDC against Keycloak", async ({ context }) => {
  const page = await context.newPage();
  {
    const loginpage = new Loginpage(page);
    await loginpage.goto();
    await loginpage.selectIdp("Keycloak");
    await loginpage.login();
  }

  {
    const keycloak = new KeycloakLogin(page);
    if (!(process.env.KEYCLOAK_USERNAME && process.env.KEYCLOAK_PASSWORD)) {
      throw new Error("Missing KeyCloak Credentials");
    }
    await keycloak.login(process.env.KEYCLOAK_USERNAME, process.env.KEYCLOAK_PASSWORD);
  }

  await waitForPredicate(() => !page.url().includes("/oidc-callback"), { limit: 50, interval: 100 });
  const url = new URL(page.url());
  expect(url.pathname).toBe("/");

  const search = Object.fromEntries(url.searchParams.entries());
  expect(search).not.toMatchObject({
    state: expect.any(String),
    code: expect.any(String),
  });

  expect(page.getByText(welcomeRegex)).toBeVisible({ timeout: 10_000 });
});
