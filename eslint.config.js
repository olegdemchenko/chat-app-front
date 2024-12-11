const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = [
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
  ),
  eslintPluginPrettierRecommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn"
    }
  },
  {
    ignores: [".yarn/*", "eslint.config.js", 'src/setupProxy.js'],
  },
];
