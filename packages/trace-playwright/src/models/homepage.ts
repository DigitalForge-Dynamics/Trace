import type { Page } from "@playwright/test";

class Homepage {
  private readonly page: Page;

  public constructor(page: Page) {
    this.page = page;
  }

  public async goto() {
    await this.page.goto("/");
  }
}

export { Homepage };
