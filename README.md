# Prerequisites (nvm, node, and yarn)

    sudo apt install curl
    curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
    source ~/.bashrc
    nvm install --lts
    npm install --global yarn

# Installation

## Use this repository as a template (fork or use it as template)

    yarn install

The following directories will be created automatically after installation:

- `jsonFiles` - folder for test data storage
- `reports` - folder for test post-run reports
- `screenshots` - folder for screenshots taken on test failure

## Minimum node and yarn versions needed

    Node - v20 LTS
    Yarn - v1.22

# Project structure

    config - configuration profiles, separated in folders by environment
    features
        app
            commonComponents - shared selectors and paths
            multilingualStrings - string translations
            stepDefinitions - your custom step definitions (optional)
            world.js - extends the core World for project-specific logic
        tests - Gherkin feature suites
    files - Files used for form uploads
    jsonFiles - Storage of test data
    reports - HTML based status report
    screenshots - screenshots taken on test failure

# How Cuppet works now

- Most step definitions and hooks are provided by the `@cuppet/core` package.
- You can add your own step definitions in `features/app/stepDefinitions/`.
- The World is extended in `features/app/world.js` if you need to add project-specific logic or data.
- Hooks are loaded from `@cuppet/core` by default. If you need custom hooks, add your own `features/app/hooks.js` (not present by default).

# Customization points

- **Step Definitions:**
    - Add your own step definitions in `features/app/stepDefinitions/`. These will be loaded in addition to the core ones.
- **World:**

    - Extend the core World in `features/app/world.js` to add custom properties or methods. Example:

        class CustomWorld extends CoreWorld {
        constructor(options) {
        super(options);
        // Add your custom properties here
        }
        }
        setWorldConstructor(CustomWorld);

- **Hooks:**
    - By default, hooks are loaded from `@cuppet/core`. To override, create `features/app/hooks.js`.

# Configuration

- `/config` - your configuration folder, you can create as many profiles for as many envs as needed
- `multilingualStrings.js` - string translations
- `commonComponents` - most common fields and paths

## Important properties in the config files

    baseUrl - the domain of the tested website
    authUser - basic auth user name (if needed)
    authPass - basic auth user pass (if needed)
    jsonFilePath - custom file name for data storage (if needed)
    tags - test tagging using the expression way:
        @fast   Scenarios tagged with @fast
        @wip and not @slow   Scenarios tagged with @wip that aren't also tagged with @slow
        @smoke and @fast   Scenarios tagged with both @smoke and @fast
        @gui or @database   Scenarios tagged with either @gui or @database

# Appium integration

## Local setup

1. Setup Android Studio, Emulator and JAVA from this guide - https://appium.io/docs/en/latest/quickstart/uiauto2-driver/
2. Do not install appium or drivers from the guide, because they are locally handled in the project
    - All commands from the guide which start with appium should be prefixed with `npx` and executed from the project root ex. `npx appium driver doctor uiautomator2`. Because appium is locally installed and not added to the %PATH
    - When running tests you need to start appium in a separate terminal with `npx appium` executed from project root folder.

# Test execution

## Test exec parameters

- {profile} is the name of the json in the config dir
- {env} is the folder name in the config dir

    yarn test {profile} {env} features/tests # all features (based on tagging if implemented)
    yarn test {profile} {env} features/tests/<test> # specific feature

### Example - will run all tests using the exampleProfile from the dev folder

    yarn test exampleAll dev features/tests
