import { test, expect } from "@playwright/test";

test.describe("Sign In as regular user", () => {
  test("Signs in with regular user", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Username").type("TEST_USER");
    await page.getByLabel("Password").type("TEST_USER_PASSWORD");
    await page.getByRole("button", { name: "LOGIN" }).click();
    await expect(page.getByText("Welcome to your Dashboard, TEST_USER")).toBeVisible();
  });
});

test.describe("Sign In as admin user", () => {
  test("Signs in with admin user", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Username").type("TEST_ADMIN");
    await page.getByLabel("Password").type("TEST_ADMIN_PASSWORD");
    await page.getByRole("button", { name: "LOGIN" }).click();
    await expect(page.getByText("Welcome to your Dashboard, TEST_ADMIN")).toBeVisible();
  });
});
