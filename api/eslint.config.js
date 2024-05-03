// @ts-check

const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");

const config = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "no-unexpected-multiline": "off",
      "no-useless-escape": "off",
    },
  },
  {
    ignores: ["dist", "coverage", "jest.config.js", "eslint.config.js", "src/**/*.d.ts"],
  }
);

module.exports = config;
