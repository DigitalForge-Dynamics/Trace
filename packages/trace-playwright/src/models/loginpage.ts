import type { Locator, Page } from "@playwright/test";

class Loginpage {
  private readonly page: Page;
  private readonly loginButton: Locator;
  private readonly idpMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.idpMenu = page.getByRole("combobox");
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async selectIdp(value: string): Promise<void> {
    await this.idpMenu.selectOption(value);
  }

  async login(): Promise<void> {
    await this.loginButton.click();
  }
}

export { Loginpage };
