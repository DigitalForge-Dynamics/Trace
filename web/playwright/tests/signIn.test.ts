import { test, expect } from "@playwright/test";

test.describe("Sign In as regular user", () => {
  test("Signs in with regular user", async ({ page }) => {
    await page.goto("/");
    await Promise.all([
      page.getByLabel("Username").type("TEST_USER"),
      page.getByLabel("Password").type("TEST_USER_PASSWORD"),
    ]);
    await page.getByText("Login").click();
    await page.getByText("Welcome to your Dashboard, TEST_USER!");
  });
});
