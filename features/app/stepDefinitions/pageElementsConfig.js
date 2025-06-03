const { When, Then } = require('@cucumber/cucumber');
const utils = require('../../../src/elementInteraction');
const dataStorage = require('../../../src/dataStorage');
const config = require('config');
When('I click on the text {string} from config', async function (text) {
    const textFromConfig = await config.get(text);
    await utils.clickByText(this.page, textFromConfig);
});
Then('I should see {string} from config in element {string}', async function (value, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    const result = await config.get(value);
    await utils.seeTextByElementHandle(this.page, selector, result);
});
Then('I fill in {string} with {string} variable from config', async function (cssSelector, variable) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    const value = await config.get(variable);
    await utils.fillField(this.page, selector, value);
});
Then('I type {string} in {string} using variable from config', async function (variable, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    const value = await config.get(variable);
    await utils.typeInField(this.page, selector, value);
});
Then(
    'I select the first autocomplete option for {string} from config on the {string} field',
    async function (value, cssSelector) {
        const selector = await dataStorage.prepareCssSelector(cssSelector);
        const result = await config.get(value);
        await utils.selectOptionFirstAutocomplete(this.page, result, selector);
    }
);
Then('I select {string} from config in {string} dropdown', async function (value, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    let data = config.get(value);
    await utils.selectOptionByValue(this.page, selector, data);
});
Then(
    'I check if element with selector {string} has attribute {string} with {string} value from config',
    async function (selector, attribute, value) {
        const attrValue = config.get(value);
        await utils.validateElementWithSelectorHasAttributeWithValue(this.page, selector, attribute, attrValue);
    }
);
