const {
    Given,
    When,
    Then
} = require('@cucumber/cucumber');
const utils = require('../../src/elementInteraction');
const dataStorage = require("../../src/dataStorage");

/**
 * This is a multipurpose step for text visibility. It uses direct input or variable,
 * but it's too general to be moved to pageElementsJson.js file.
 */
Then ("I should see {string}", async function (text) {
    const result = await dataStorage.checkForVariable(text);
    await utils.seeTextByXpath(this.page, result);
});
When('I click on the element {string}', async function (cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.click(this.page, selector);
});
When('I click on the element with xpath {string}', async function (xPath) {
    const selector = 'xpath/' + `${xPath}`;
    await utils.click(this.page, selector);
});
When('I click on the text {string}', async function (text) {
    await utils.clickByText(this.page, text);
});
When('I click on the text {string} in the {string} region', async function (text, region) {
    await utils.clickTextInRegion(this.page, text, region);
});

Then ("I should see {string} in {string}", async function (value, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.validateTextInField(this.page, value, selector);
});

Then ("I should see {string} in {string} region", async function (text, region) {
    await utils.seeTextInRegion(this.page, text, region);
});

Then ("I should see the element with selector {string}", async function (cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.seeElement(this.page, selector);
});
Then ("I should not see the element with selector {string}", async function (cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.notSeeElement(this.page, selector);
});
Then (
    "I wait for element with {string} selector to appear within {string} seconds",
    async function (cssSelector, time) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.seeElement(this.page, selector, time * 1000);
});
Then ("I should not see {string}", async function (text) {
    await utils.notSeeText(this.page, text);
});
Then ("I wait for the text {string} to appear within {string} seconds", async function (text, time) {
    await utils.seeTextByXpath(this.page, text, time * 1000);
});
Then ("I wait for the text {string} to disappear with max time {string} seconds", async function (text, time) {
    await utils.disappearText(this.page, text, time * 1000);
});
Then ("I upload the {string} in {string} field", async function (fileName, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.uploadFile(this.page, fileName, selector);
});
Then ("I fill in {string} with {string}", async function (cssSelector, text) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.fillField(this.page, selector, text);
});
Then ("I type in {string} with {string}", async function (cssSelector, text) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.typeInField(this.page, selector, text);
});
Then ("I {string} the checkbox {string}", async function (action, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.useCheckbox(this.page, selector, action);
});
Then ("I write {string} into {string} ckeditor5 wysiwyg", async function (text, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.writeInCkEditor5(this.page, selector, text);
});
Then ("I select {string} from {string}", async function (value, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.selectOptionByValue(this.page, selector, value);
});
Then ("I select text {string} from {string}", async function (value, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.selectOptionByText(this.page, selector, value);
});

Then ("I check if link {string} has href {string}", async function (text, href) {
    await utils.validateHrefByText(this.page, text, href);
});
Then ("I check if link with href {string} has attribute {string} with {string} value", async function (href, attribute, value) {
    await utils.validateValueOfLinkAttributeByHref(this.page, href, attribute, value);
});
Then ("I check if element with selector {string} has attribute {string} with {string} value", async function (selector, attribute, attrValue) {
    await utils.validateElementWithSelectorHasAttributeWithValue(this.page, selector, attribute, attrValue);
});
Then ("I check if element with text {string} has attribute {string} with {string} value", async function (text, attribute, value) {
    await utils.validateValueOfElementAttributeByText(this.page, text, attribute, value);
});
Then ("I upload {string} file to dropzone {string} field", async function (file, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.uploadToDropzone(this.page, file, selector);
});
Then ("I should see {string} in the schema markup of the page", async function (text) {
    await utils.validateTextInSchemaOrg(this.page, text);
});
Then ("I should not see {string} in the schema markup of the page", async function (text) {
    await utils.validateTextNotInSchemaOrg(this.page, text);
});
Then ("I should see {string} in page scripts", async function (text) {
    await utils.validateTextInScript(this.page, text);
});
Then ("I should {string} see {string} in the {string} accordion", async function (isVisible, text, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    if (isVisible === 'not') {
        isVisible = false;
    }
   await utils.textVisibilityInAccordion(this.page, selector, text, Boolean(isVisible));

});
Then ("I select the first autocomplete option for {string} on the {string} field", async function (text, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.selectOptionFirstAutocomplete(this.page, text, selector);
});
Then ("I select {string} from chosen {string}", async function (text, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.selectOptionFromChosen(this.page, text, selector);
});

Then ("I set date {string} in flatpickr with selector {string}", async function (date, cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.setDateFlatpickr(this.page, selector, date);
});
Then ("I get the href of element with selector {string} and store it to {string}", async function (cssSelector, variable) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await dataStorage.storeHrefOfElement(this.page, selector, variable);
});
Given("I scroll element with {string} to the top", async function(cssSelector) {
    const selector = await dataStorage.prepareCssSelector(cssSelector);
    await utils.scrollElementToTop(this.page, selector);
})
Given("I scroll element with xpath {string} to the top", async function(xpath) {
    const selector = 'xpath/' + `${xpath}`;
    await utils.scrollElementToTop(this.page, selector);
})