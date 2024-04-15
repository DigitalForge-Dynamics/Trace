import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright/tests",
  outputDir: "./playwright/results",
  fullyParallel: true,
  forbidOnly: true,
  reporter: [
    ["html", { outputFolder: "./playwright/report" }]
  ],
  projects: [
    {
      name: "Chromium",
      use: devices["Desktop Chrome"],
    }
  ],
  use: {
    baseURL: "http://localhost:5173"
  },
});
