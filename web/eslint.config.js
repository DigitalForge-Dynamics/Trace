// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
//import reactRefresh from "eslint-plugin-react-refresh";

reactHooks.configs.recommended.plugins = { "react-hooks": reactHooks };

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  reactHooks.configs.recommended,
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
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
    }
  },
  {
    ignores: [
      "dist/**/*.js",
      "tsconfig.json",
      "eslint.config.js",
      "vite.config.ts",
      "playwright.config.ts",
      "playwright/report/**/*",
      "playwright/tests/**/*.test.ts",
	  ".storybook/**/*",
    ],
  },
);
