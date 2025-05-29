# Prerequisites (nvm,node and yarn)
    sudo apt install curl
    curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
    source ~/.bashrc
    nvm install --lts
    npm install --global yarn

# Simple installation
## Use this repository as a template (copy the structure to a new repo)
    yarn install
    mkdir -p jsonFiles - create folder for test data storage
    mkdir -p reports - create folder for test post-run reports
    mkdir -p screenshots - create folder for screenshots taken on test failure

## Folders and files which you need to configure and localize
    /config - your configuration folder, you can create as many profiles for as many envs as needed
    /projectSpecific - folder for both definitions and methods which are project unique
    /tests - your main wrapper for feature folders and files
    multilingualStrings.js - string translations


## Minimum node and yarn versions needed
    Node - v18 (Recommended v20)
    Yarn - v1.22

# Project structure
    config - configuration profiles, separated on folders by environment
    features - Has 3 folders
        src - Main function definitions
        app - Step defitions, hooks and components
        tests - Gherkin feature suits 
    files - Files used for form uploads
    jsonFiles - Storage of test data
    reports - HTML based status report
    screenshots - screenshots taken on test failure

## Important properties in the config files
    baseUrl - the domain of the tested website
    authUser - basic auth user name (if needed)
    authPass - basic auth user pass (if needed)
    jsonFilePath - custom file name for data storage (if needed)
    tags - test tagging using the expression way:
        @fast	Scenarios tagged with @fast
        @wip and not @slow	Scenarios tagged with @wip that aren’t also tagged with @slow
        @smoke and @fast	Scenarios tagged with both @smoke and @fast
        @gui or @database	Scenarios tagged with either @gui or @database

# Appium integration
## Local setup
1. Setup Android Studio, Emulator and JAVA from this guide - https://appium.io/docs/en/latest/quickstart/uiauto2-driver/
2. Do not install appium or drivers from the guide, because they are locally handled in the project
3. All commands from the guide which start with appium should be prefixed with `npx` and executed from the project root ex. `npx appium driver doctor uiautomator2`
4. When running tests you need to start appium in a separate terminal with `npx appium`. Execute the command from project root to use the one from package.json.       

# Test execution
## Test exec parameters
+ {profile} is the name of the json in the config dir
+ {env} is the folder name in the config dir
### When you test locally and in headed mode open hooks.js and uncomment the slowMo
    yarn test {profile} {env} - all tests
    yarn test {profile} {env} features/tests/<test> - specific test
    
### Example - will run all tests using the exampleProfile from the dev folder
    yarn test exampleProfile dev
