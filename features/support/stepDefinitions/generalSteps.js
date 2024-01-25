const {
    Given,
    When,
    Then
} = require('@cucumber/cucumber');
const utils = require('../../src/elementInteraction');
const main = require('../../src/mainFunctions');
const drupalFields = require('../../support/components/drupalFields');
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
    await main.visitPath(this.page, configPage + path);
})
Given("I visit the saved path {string}", async function (path) {
    const savedPath = dataStorage.getVariable(path);
    await main.visitPath(this.page, savedPath);
})
Given("I visit saved path page", async function () {
    const path = await dataStorage.getVariable('path')
    await main.visitPath(this.page, path);
})
Given("I log in", async function() {
    const userName = config.get('credentials.username');
    const password = config.get('credentials.password');
    await utils.fillField(this.page, drupalFields['Name'], userName);
    await utils.fillField(this.page,  drupalFields['Pass'], password);
    await utils.click(this.page, drupalFields['Submit']);
    await new Promise(function(resolve) {
        setTimeout(resolve, 500)
    });

})
Given("I log in as {string} {string}", async function(username, password) {
    await utils.fillField(this.page, drupalFields['Name'], username);
    await utils.fillField(this.page,  drupalFields['Pass'], password);
    await utils.click(this.page, drupalFields['Submit']);
    await new Promise(function(resolve) {
        setTimeout(resolve, 500)
    });
})
Given("I follow {string}", async function (text) {
    await utils.followLink(this.page, text);
})
Given("I reload the page", async function () {
    await main.reloadPage(this.page);
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
Given("I switch back to original window", async function () {
    this.page = await main.openOriginalTab(this.browser);
})
When("I should be on {string} page", async function(page) {
    const configPage = await config.get(page);
    await main.validatePath(this.page, configPage);
})
When("I should be on the {string} path of {string} page", async function(path, page) {
    const configPage = await config.get(page);
    await main.validatePath(this.page, configPage + path);
})

