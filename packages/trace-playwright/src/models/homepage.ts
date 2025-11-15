import type { Page, Locator } from "@playwright/test";

class Homepage {
  private readonly page: Page;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole("button", { name: "Login" });
  }

  async goto() {
    await this.page.goto("/");
  }

  async login() {
    await this.loginButton.click();
  }
}

export { Homepage };
