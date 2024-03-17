/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/tests/**/*.test.ts(x)?"],
  moduleNameMapper: {
    "^sequelize$": "<rootDir>/src/tests/TestHelpers.ts",
  },
};
