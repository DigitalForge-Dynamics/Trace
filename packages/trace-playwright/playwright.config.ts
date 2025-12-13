import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "src/tests/",
  testMatch: "*.playwright.ts",
  fullyParallel: true,
  forbidOnly: process.env.CI !== undefined,
  retries: 0,
  use: {
    baseURL: "https://localhost:5173",
  },
  webServer: [
    {
      name: "API",
      command: "bun dev",
      cwd: "../trace-api",
      url: "http://localhost:3000/health-check",
      reuseExistingServer: true,
      stderr: "pipe",
      stdout: "pipe",
    },
    {
      name: "Web",
      command: "bun dev",
      cwd: "../trace-web",
      url: "https://localhost:5173/",
      reuseExistingServer: true,
      stderr: "pipe",
      stdout: "pipe",
      ignoreHTTPSErrors: true,
    },
  ],
  projects: [
    {
      name: "Chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ["--ignore-certificate-errors"],
        },
      },
    },
    /*{
      name: "Firefox",
      use: devices["Desktop Firefox"],
    },*/
  ],
});
