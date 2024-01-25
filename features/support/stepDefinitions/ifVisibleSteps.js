const {
    Given,
    When,
    Then
} = require('@cucumber/cucumber');
const utils = require("../../src/elementInteraction");
const config = require("config");
const dataStorage = require("../../src/dataStorage");
Then ("I should see {string} if visible", async function (text) {
    if (config.has("skipSteps") && config.get("skipSteps") === text) {
        return true
    }
    await utils.seeTextByXpath(this.page, text);
});
Then ("I type in {string} with {string} if visible", async function (cssSelector, text) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.typeInField(this.page, selector, text, true);
});
Then ("I select {string} from {string} if visible", async function (value, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.selectOptionByValue(this.page, selector, value, true);
});
Then ("I fill in {string} with {string} if visible", async function (cssSelector, text) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.fillField(this.page, selector, text, true);
});
Then ("I check if element with selector {string} has attribute {string} with {string} value from config if visible", async function (selector, attribute, variable) {
    const attrValue = await config.get(variable);
    await utils.validateElementWithSelectorHasAttributeWithValue(this.page, selector, attribute, attrValue, true);
});
Then ("I check if element with selector {string} has attribute {string} with {string} value from json if visible", async function (selector, attribute, variable) {
    const attrValue = dataStorage.getVariable(variable);
    await utils.validateElementWithSelectorHasAttributeWithValue(this.page, selector, attribute, attrValue, true);
});
Then ("I check if link with href {string} has attribute {string} with {string} value from config if visible", async function (href, attribute, value) {
    const attrValue = await config.get(value);
    await utils.validateValueOfLinkAttributeByHref(this.page, href, attribute, attrValue, true);
});
Then ("I check if link with href {string} has attribute {string} with {string} value from json if visible", async function (href, attribute, value) {
    const attrValue = dataStorage.getVariable(value);
    await utils.validateValueOfLinkAttributeByHref(this.page, href, attribute, attrValue, true);
});
Then ("I {string} the checkbox {string} if visible", async function (action, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.useCheckbox(this.page, selector, action, true);
});