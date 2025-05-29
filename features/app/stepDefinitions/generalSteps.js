const {
    Given,
    When,
    Then
} = require('@cucumber/cucumber');
const utils = require('../../src/elementInteraction');
const main = require('../../src/mainFunctions');
const commonFields = require('../components/commonFields');
const dataStorage = require("../../src/dataStorage");
const config = require("config");

Given("I go to {string}", async function (path) {
    const pathToVisit = await dataStorage.checkForMultipleVariables(path);
    await main.visitPath(this.page, pathToVisit);
})
Given("I go to {string} page", async function (path) {
    const pathFromConfig = config.get(path);
    await main.visitPath(this.page, pathFromConfig);
})
Given("I go to current page plus {string}", async function (path) {
    await main.visitCurrentPathPlus(this.page, path);
})
Given("I go to {string} path of {string} page", async function (path, page) {
    const configPage = await config.get(page);
    const checkedPath = await dataStorage.checkForVariable(path);
    await main.visitPath(this.page, configPage + checkedPath);
})
Given("I visit the saved path {string}", async function (path) {
    const savedPath = dataStorage.getVariable(path);
    await main.visitPath(this.page, savedPath);
})
Given("I visit saved path page", async function () {
    const path = await dataStorage.getVariable('path');
    await main.visitPath(this.page, path);
})
Given("I log in", async function() {
    const userName = config.get('credentials.username');
    const password = config.get('credentials.password');
    await utils.fillField(this.page, commonFields['Name'], userName);
    await utils.fillField(this.page,  commonFields['Pass'], password);
    const navigationPromise = this.page.waitForNavigation();
    await utils.click(this.page, commonFields['Submit']);
    await navigationPromise;
})
Given("I log in as {string} {string}", async function(username, password) {
    await utils.fillField(this.page, commonFields['Name'], username);
    await utils.fillField(this.page,  commonFields['Pass'], password);
    const navigationPromise = this.page.waitForNavigation();
    await utils.click(this.page, commonFields['Submit']);
    await navigationPromise;
})
Given("I follow {string}", async function (text) {
    await utils.followLink(this.page, text);
})
Given("I reload the page", async function () {
    await main.reloadPage(this.page);
})
Given("I reload the current page with GET parameters {string}", async function (params) {
    await main.reloadPageWithParams(this.page, params);
})
Given(
    "I receive the following status code {string} when requesting the {string} path of the {string} page",
    async function (code, path, page) {
        const configPage = await config.get(page);
        await main.validateStatusCode(this.page, code, configPage + path);
})
Given("I open new tab with {string} url", async function (url) {
    this.page = await main.openNewTab(this.browser, url);
})
When("I should be on {string} page", async function(page) {
    const configPage = await config.get(page);
    main.validatePath(this.page, configPage);
})
When("I should be on the {string} path of {string} page", async function(path, page) {
    const configPage = await config.get(page);
    main.validatePath(this.page, configPage + path);
})
When("I should be on a page with alias ending in {string}", async function(path) {
    main.validatePathEnding(this.page, path);
})
Then("I should see the header {string} with value {string}", async function(header, value) {
    await main.validatePageResponseHeaders(this.page, header, value);
})
Then("I verify that {string} cookie {string} present", async function(cookieName, presence) {
    const stringToBool = {
        "is": true,
        "is not": false
    };
    await main.verifyCookiePresence(this.page, cookieName, stringToBool[presence]);
})
Given('I set viewport size to {string}', async function (resolution) {
    await main.setViewport(this.page, resolution)
});