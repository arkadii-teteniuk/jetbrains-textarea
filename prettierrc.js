// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/** @type {import("prettier").Options} */
const config = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "standard-with-typescript",
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        semi: false,
        bracketSpacing: true,
        trailingComma: "all",
        bracketSameLine: true,
      },
    ],
    "react/prop-types": "off",
    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "always-multiline",
        enums: "always-multiline",
      },
    ],
    "space-before-function-paren": "off",
    "@typescript-eslint/space-before-function-paren": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/indent": "off",
    "multiline-ternary": "off",
  },
  parserOptions: {
    project: "./tsconfig.json",
  },
};

export default config;
