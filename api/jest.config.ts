import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/tests/**/*.test.ts"],
  transform: {
    "\.test\.ts$": ["ts-jest", {
      isolatedModules: true,
    },
  ]}
};

export default config;
