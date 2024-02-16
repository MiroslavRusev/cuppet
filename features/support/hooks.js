const {
    BeforeAll,
    AfterAll,
    Before,
    After,
    Status,
    AfterStep
} = require('@cucumber/cucumber')
const puppeteer = require('puppeteer')
const config = require("config");
const args = config.get('args');
const dataStore = require("../src/dataStorage")

let browser = null;
let page = null;
let screenshotPath = config.get('screenshotsPath') ?? 'screenshots/'

// ==== BeforeAll and AfterAll do not have access to test scope 'this'
// ==== Before and After do

// executed once before any test
BeforeAll(async function() {
    await dataStore.createFile();
})

AfterStep(async function(testCase){

    if(testCase.result.status !== Status.PASSED) {
        let stepName = testCase.pickle.uri;
        const name = stepName.replace(/[/.]/g,'_');
        let path = `${screenshotPath}screenshot_${name}.png`;
        let screenshot = await this.page.screenshot({path: path,fullPage: true});
        console.log(`Screenshot taken: ${name}`);
        this.attach(screenshot, 'image/png');
    }
})


// executed once after all tests
AfterAll(async function() {
    // Make sure the browser is closed
    if (browser != null) {
        browser.close()
    }
})

// executed before every test
Before(async function(testCase) {
    browser = await puppeteer.launch({
        headless: false,
        args: args,
        defaultViewport: null,
        slowMo: 50, // Add slowMo: 200 to slow each action by 200ms so you can see what happens.
        w3c: false,
    })
    const pages = await browser.pages();
    if (!pages?.length) {
        await browser.newPage();
    }
        // Use the first existing page
    const page = pages[0];

    // // Set the dimensions of the viewport.
    const isHeadless = args.includes('--headless')
    if (isHeadless) {
        await page.setViewport({
            width: Number(config.get('viewport.width')),
            height: Number(config.get('viewport.height')),
        })
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

    if (browser != null) {
        browser.close()
    }
})