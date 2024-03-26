const {
    BeforeAll,
    AfterAll,
    Before,
    After,
    AfterStep
} = require('@cucumber/cucumber');
const { Status } = require('@cucumber/cucumber');
const fs = require("fs");
const puppeteer = require('puppeteer');
const config = require("config");
const args = config.get('args');
const dataStore = require("../src/dataStorage");
const profile = process.env.NODE_CONFIG_ENV;

let browser = null;
let page = null;
let screenshotPath = config.get('screenshotsPath').toString() ?? 'screenshots/'

// ==== BeforeAll and AfterAll do not have access to test scope 'this'
// ==== Before and After do

// executed once before any test
BeforeAll(async function() {
    await dataStore.createFile();
    console.log(`Tests started at: ${new Date()}`);
})

AfterStep(async function(testCase){

    if(testCase.result.status !== Status.PASSED) {
        let stepName = testCase.pickle.uri;
        const name = stepName.replace(/[/\\.]/g, '_');
        const baseScreenshotPath = `${screenshotPath}${profile}`;
        if (!fs.existsSync(baseScreenshotPath)) {
            fs.mkdirSync(baseScreenshotPath, { recursive: true });
        }
        let path = `${baseScreenshotPath}/screenshot_${name}.png`;
        let screenshot = await this.page.screenshot({path: path,fullPage: true});
        console.log(`Screenshot taken: ${name}`);
        this.attach(screenshot, 'image/png');
    }
})


// executed once after all tests
AfterAll(async function() {
    const date = new Date();
    console.log(`Tests completed at: ${date.toString()}`);
})

// executed before every test
Before(async function(testCase) {
    browser = await puppeteer.launch({
        headless: false,
        args: args,
        defaultViewport: null,
        // slowMo: 50, // When you test locally in headed mode use 50-150 to see what happens
        w3c: false,
    })
    const pages = await browser.pages();
    if (pages.length > 0) {
        // Use the first existing page
        page = pages[0];
    } else {
        // If no pages exist, create a new one
        page = await browser.newPage();
    }

    // // Set the dimensions of the viewport.
    if (Array.isArray(args)) {
        const isHeadless = args.includes('--headless')
        if (isHeadless) {
            await page.setViewport({
                width: Number(config.get('viewport.width')),
                height: Number(config.get('viewport.height')),
            })
        }
    }
    // Set basic auth if configured
    if (config.has('basicAuth')) {
        const credentials = {
        username: config.get('basicAuth.authUser').toString(),
        password: config.get('basicAuth.authPass').toString()
    }
        await page.authenticate(credentials);
    }
    // assign created browser, page and scenario name to global variables
    this.browser = browser;
    this.page = page;
    this.scenarioName = testCase.pickle.name;
})

// executed after every test
After(async function(testCase) {

    if(testCase.result.status === Status.FAILED){
        console.log(`Scenario: '${testCase.pickle.name}' - has failed...\r\n`)
    }
    if (browser) {
        await browser.close()
    }
})