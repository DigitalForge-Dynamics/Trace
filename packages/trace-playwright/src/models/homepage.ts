import type { Page, Locator } from "@playwright/test";

class Homepage {
  private readonly page: Page;
  private readonly loginButton: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.loginButton = page.locator("[text=Login]");
  }

  public async goto() {
    await this.page.goto("/");
  }

  public async login() {
    await this.loginButton.click();
  }
}

export { Homepage };
