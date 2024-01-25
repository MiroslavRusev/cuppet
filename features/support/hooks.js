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
        slowMo: 50, // Add slowMo: 200 to slow each action by 200ms so you can see what happens.
        w3c: false,
    })
    // GitLab prefers there to be only one page, so use the automatically created first tab in the browser...
    page = await browser.targets()[0].page()
    // ...unless it's not there for some reason.
    if (page == null) {
        page = await browser.newPage()
    }
    // Set the dimensions of the viewport.
    await page.setViewport({
        width: config.get('viewport.width'),
        height: config.get('viewport.height'),
    });
    // Set basic auth if configured
    if (config.has('basicAuth')) {
        const credentials = {
        username: config.get('basicAuth.authUser'),
        password: config.get('basicAuth.authPass')
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