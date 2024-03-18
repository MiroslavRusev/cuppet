const {
    Given,
    When,
    Then
} = require('@cucumber/cucumber');
const utils = require('../../src/elementInteraction');
const dataStorage = require("../../src/dataStorage");
Then ("I should see {string} from json in element {string}", async function (value, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    const result = await dataStorage.getVariable(value);
    await utils.seeTextByElementHandle(this.page, selector, result);
});
Then ("I should see stored text {string} in {string} region", async function (text, region) {
    const result = await dataStorage.checkForMultipleVariables(text);
    await utils.seeTextInRegion(this.page, result, region);
});
When('I should see variable {string} in {string} region', async function (variable, region) {
    const value = dataStorage.getVariable(variable);
    await utils.seeTextInRegion(this.page, value, region);
});
Then ("I fill in {string} with {string} variable from JSON", async function (cssSelector, variable) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    const value = await dataStorage.getVariable(variable);
    await utils.fillField(this.page, selector, value);
});
Then ("I fill in {string} with {string} variable using JSON stringify", async function (cssSelector, variable) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    const value = await dataStorage.getVariable(variable, true);
    await utils.fillField(this.page, selector, value);
});
Then ("I type in {string} with {string} variable from JSON", async function (cssSelector, variable) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    const value = await dataStorage.getVariable(variable);
    await utils.typeInField(this.page, selector, value);
});
Then ("I check if link {string} has href {string} from JSON", async function (text, href) {
    const savedHref = await dataStorage.getVariable(href);
    await utils.validateHrefByText(this.page, text, savedHref);
});
Then ("I set stored date {string} in flatpickr with selector {string}", async function (date, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    const result = await dataStorage.checkForVariable(date);
    await utils.setDateFlatpickr(this.page, selector, result);
});
Then ("I select {string} from json in {string} dropdown", async function (variable, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    let data = await dataStorage.getVariable(variable);
    await utils.selectOptionByValue(this.page, selector, data);
});