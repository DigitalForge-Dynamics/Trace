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
      "@typescript-eslint/unbound-method": "off",
      "no-unexpected-multiline": "off",
    },
  },
  {
    ignores: ["dist", "coverage", "jest.config.ts", "eslint.config.js", "src/**/*.d.ts"],
  }
);

module.exports = config;
