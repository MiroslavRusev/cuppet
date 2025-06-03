const {
    BeforeAll,
    AfterAll,
    Before,
    After,
    AfterStep,
    Status
} = require('@cucumber/cucumber');
const BrowserManager = require('./browserManager');
const AppiumManager = require('./appiumManager');
const fs = require("fs");
const config = require("config");
const dataStore = require("../../src/dataStorage");
const profile = process.env.NODE_CONFIG_ENV;

let screenshotPath = config.get('screenshotsPath').toString() ?? 'screenshots/'

// ==== BeforeAll and AfterAll do not have access to test scope 'this'
// ==== Before and After do

// executed once before any test
BeforeAll(async function() {
    await dataStore.createFile();
    console.log(`Tests started at: ${new Date()}`);
})

AfterStep(async function(testCase){
    /**
     * If the test is not passed or the test is not tagged with @api, take a screenshot
     */
    const arrayTags = testCase.pickle.tags;
    const found = arrayTags.find(item => item.name === '@api');
    if((testCase.result.status !== Status.PASSED) && found === undefined) {
        let stepName = testCase.pickle.uri;
        const name = stepName.replace(/[/\\.]/g, '_');
        const baseScreenshotPath = `${screenshotPath}${profile}`;
        if (!fs.existsSync(baseScreenshotPath)) {
            fs.mkdirSync(baseScreenshotPath, { recursive: true });
        }
        let path = `${baseScreenshotPath}/screenshot_${name}.png`;
        let screenshot = await this.page.screenshot({path: path, fullPage: true,});
        console.log(`Screenshot taken: ${name}`);
        // Convert Uint8Array to Buffer because Cucumber cannot work directly with Uint8Arrays
        const buffer = Buffer.from(
            screenshot.buffer,
            screenshot.byteOffset,
            screenshot.byteLength
        );
        this.attach(buffer, 'image/png');
    }
})


// executed once after all tests
AfterAll(async function() {
    const date = new Date();
    console.log(`Tests completed at: ${date.toString()}`);
})

// executed before every test
Before(async function(testCase) {
    // Get Browser config arguments array
    const browserArgs = config.get('browserOptions.args');
    // Get default browser viewport
    const browserViewport = config.get('browserOptions.viewport.default');
    // Check for basic auth credentials in config
    let credentials;
    if (config.has('basicAuth')) {
        credentials = {
            username: config.get('basicAuth.authUser').toString(),
            password: config.get('basicAuth.authPass').toString(),
        };
    }
    // Get Appium capabilities from config
    const appiumCapabilities = config.get('appiumCapabilities');

    // Check if the test is tagged with @appium to either use Appium or Chromium
    const arrayTags = testCase.pickle.tags;
    const found = arrayTags.find(item => item.name === '@appium');
    if (!found) {
        const browserManager = new BrowserManager(browserViewport, browserArgs, credentials);
        await browserManager.initialize();
    
        // Assign created browser, page, and scenario name to global variables
        this.browserManager = browserManager;
        this.browser = browserManager.browser;
        this.page = browserManager.page;
        this.scenarioName = testCase.pickle.name;
    } else {
        const appiumManager = new AppiumManager(appiumCapabilities);
        await appiumManager.initialize();
        this.appiumManager = appiumManager;
        this.appiumDriver = appiumManager.appiumDriver;
    }
    
});

// executed after every test
After(async function(testCase) {

    if(testCase.result.status === Status.FAILED){
        console.log(`Scenario: '${testCase.pickle.name}' - has failed...\r\n`)
    }
    if (this.browser) {
        await this.browserManager.stop()
    } else if (this.appiumDriver) {
        await this.appiumManager.stop();
    }
})