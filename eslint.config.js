import js from "@eslint/js";
import globals from "globals";
import svelte from "eslint-plugin-svelte";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,ts,svelte}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      svelte: svelte,
      "@typescript-eslint": typescript,
    },
    rules: {
      ...svelte.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelte.parser,
      parserOptions: {
        parser: typescriptParser,
      },
    },
  },
];
