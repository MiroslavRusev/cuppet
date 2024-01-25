const {
    Given,
    When,
    Then
} = require('@cucumber/cucumber');
const utils = require("../../src/elementInteraction");
const dataStorage = require("../../src/dataStorage");
Then ("I wait for the text {string} to appear within {string} seconds in iframe {string}", async function (text, time, frameSelector) {
    let frame = await utils.getFrameBySelector(this.page, frameSelector);
    await utils.seeTextByXpath(frame, text, time * 1000);
});
When ("I click on element {string} in iframe with selector {string}", async function (elementSelector, frameSelector) {
    let frame = await utils.getFrameBySelector(this.page, frameSelector);
    await utils.click(frame, elementSelector);
});
When('I click on the text {string} in iframe with selector {string}', async function (text, frameSelector) {
    let frame = await utils.getFrameBySelector(this.page, frameSelector);
    await utils.clickByText(frame, text);
});
When('I click on the text {string} in iframe with selector {string} and follow the new tab', async function (text, frameSelector) {
    let frame = await utils.getFrameBySelector(this.page, frameSelector);
    this.page = await utils.clickLinkOpenNewTab(this.browser, frame, text);
});
When('I store the string matching the {string} pattern from the {string} text in iframe {string}', async function (pattern, text, frameSelector) {
    let frame = await utils.getFrameBySelector(this.page, frameSelector);
    await dataStorage.storeTextFromPattern(frame, pattern, text);
});