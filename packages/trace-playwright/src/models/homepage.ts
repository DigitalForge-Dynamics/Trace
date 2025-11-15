import type { Locator, Page } from "@playwright/test";

class Homepage {
  private readonly page: Page;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole("button", { name: "Login" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async login(): Promise<void> {
    await this.loginButton.click();
  }
}

export { Homepage };
