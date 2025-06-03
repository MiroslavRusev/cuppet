import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
    globalIgnores(["**yarn.lock", "**/node_modules/", ".git/"]),
    {
        files: ["**/*.js"],
        plugins: {
            js,
        },
        extends: ["js/recommended"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.commonjs,
            },

            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
        },
    }
]);