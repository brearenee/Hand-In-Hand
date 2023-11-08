module.exports = {
    // Define the environments
    env: {
        browser: true, // Enable browser global variables
        es2023: true, // Enable ES2023 globals and syntax
        node: true, // Enable Node.js global variables and Node.js scoping
        mocha: true, // Enable Mocha test global variables
    },
    // Add global settings
    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx"],
            },
        },
    },
    // Define the parser options
    parserOptions: {
        ecmaVersion: 14, // equivalent to ES2021
        sourceType: "module", // Allows for the use of imports
    },
    // Specify the ESLint plugins
    plugins: [
        "html", // Enable ESLint to lint HTML files
        "mocha", // Enable ESLint to lint Mocha tests
    ],
    // Extend recommended configs
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
    ],
    globals: {
        request: "writeable", 
        response: "writeable"
    },
    // Custom rules
    rules: {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": "warn",
        "no-useless-catch": "off", 
        "no-prototype-builtins": "warn"
        
    },
    // Override rules for specific file patterns
    overrides: [
        {
            // Backend specific configuration
            files: ["**/*.js", "!public/**/*"],
            rules: {
                // Node.js (CommonJS) specific rules can go here
                "import/no-unresolved": [2, { commonjs: true }],
                "import/no-commonjs": "off",
            },
        },
        {
            // Frontend specific configuration
            files: ["public/**/*.js"], // assuming your front-end files are in a 'src' folder
            rules: {
                // ES6 (modules) specific rules can go here
                "import/no-commonjs": "error",
                "no-var": "error", // to ensure you use let/const instead of var
                "import/no-unresolved": "warn"
            },
        },
        {
            // Test specific configuration
            files: ["tests/**/*.js", "tests_selenium/**/*.js", "**/*-tests.js"], // All files within test folders and have -test.js 
            env: {
                mocha: true, // This enables Mocha globals
            },
            plugins: [
                "mocha", // Ensure the Mocha plugin is enabled for test files
            ],
            extends: [
                "plugin:mocha/recommended",
            ],
            rules: {
                // Your specific rules for testing files
                "mocha/no-exclusive-tests": "error", // Prevents committing .only tests
                "mocha/max-top-level-suites": "off"
            },
        },
    ],
};
