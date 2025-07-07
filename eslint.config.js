import jsdoc from 'eslint-plugin-jsdoc';
import promise from 'eslint-plugin-promise';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module"
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    plugins: {
      jsdoc,

      promise,
      security,
      sonarjs,
      import: importPlugin
    },
    rules: {
      // Règles de base
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off",
      // Plugins
      ...jsdoc.configs.recommended.rules,

      ...promise.configs.recommended.rules,
      ...security.configs.recommended.rules,
      ...sonarjs.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules
    }
  }
];
