import type { Locator, Page } from "@playwright/test";

class KeycloakLogin {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signinButton: Locator;

  constructor(page: Page) {
    this.usernameInput = page.getByRole("textbox", { name: "username" });
    this.passwordInput = page.getByRole("textbox", { name: "password" });
    this.signinButton = page.getByRole("button", { name: "Sign In" });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signinButton.click();
  }
}

export { KeycloakLogin };
