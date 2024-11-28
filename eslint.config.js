import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import typescript from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  eslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["dist/**", "build/**", "node_modules/**"],
    languageOptions: {
      parser: typescript,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        process: true,
        localStorage: "readonly",
        fetch: "readonly",
        HTMLElement: "readonly",
        HTMLDivElement: "readonly",
        HTMLInputElement: "readonly",
        AbortController: "readonly",
        AbortSignal: "readonly",
        TextDecoder: "readonly",
        NodeJS: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react-hooks": reactHooks,
      react: react,
    },
    rules: {
      "no-console": "off",
      "no-debugger": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-constant-condition": ["error", { checkLoops: false }],
      indent: ["error", 2, { SwitchCase: 1 }],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "no-undef": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
];
