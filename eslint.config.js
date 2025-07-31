import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      "indent": ["warn", 2],
      "no-multi-spaces": "warn",
      "no-trailing-spaces": "warn",
      "arrow-spacing": "warn",
      "space-infix-ops": "warn",
      "no-unused-vars": "warn",
      "no-undef": "off",
      "no-console": "warn",
      "no-debugger": "warn",
      "no-unused-expressions": "warn",
      "no-constant-condition": "warn",
      "no-empty": "warn",
      "no-extra-semi": "warn",
      "no-fallthrough": "warn",
      "no-irregular-whitespace": "warn",
      "no-mixed-spaces-and-tabs": "warn",
      "no-redeclare": "warn",
      "no-duplicate-imports": "warn",
      "no-var": "off",
      "comma-dangle": ["warn", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "ignore",
      }],
      "array-bracket-spacing": ["warn", "never", {
        "singleValue": false,
        "objectsInArrays": false,
        "arraysInArrays": false,
      }],
      "space-in-parens": ["warn", "never"],
      "object-curly-spacing": ["warn", "always", {
        "arraysInObjects": false,
        "objectsInObjects": false,
      }],
    },
  },
]);


