import { test } from "@playwright/test";
import { Homepage } from "../models/homepage";

test("Is able to login, using an existing IdP token", async ({ context }) => {
  const page = await context.newPage();
  const homepage = new Homepage(page);
  await homepage.goto();
  await homepage.login();
});

test("Is able to login, using OIDC against an IdP", () => {});

test("Is able to logout", () => {});
