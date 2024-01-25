const {
    Given,
    When,
    Then
} = require('@cucumber/cucumber');
const dataStorage = require("../src/dataStorage");
const utils = require("../src/elementInteraction");
const main = require('../src/mainFunctions');
const config = require("config");
const bluex = require("./BlueXFunctions");
Given("I check the blog's tag checkbox", async function() {
    const tid = await dataStorage.getVariable('tid');
    const checkboxSelector = `[data-drupal-selector="edit-field-tags-${tid}"]`;
    await utils.useCheckbox(this.page, checkboxSelector, 'select');
});
When("I go to static {string}", async function(page) {
    const baseUrl = await config.get('credentials.baseUrl');
    let path = baseUrl.replace("cms1", "static");
    if (page === "/") {
        await main.visitPath(this.page, path);
    } else {
        await main.visitPath(this.page, path + page);
    }
});
Given("I set local storage to bypass junk spam pop-up in APAC", async function() {
    await bluex.setLocalStorageApac(this.page);
});
When("I get reCaptcha bypass cookie", async function() {
    const path = await bluex.prepareReCaptcha();
    await main.visitPath(this.page, path);
});
Given("I fav a job {string}", async function(jobId) {
    await bluex.favJob(this.page, jobId);
});
Given("I go to job apply page with {string} id", async function(jobId) {
    const path = await bluex.goToApplyPage(jobId)
    await main.visitPath(this.page, path);
});
Given("I select {string} specialism with {string} selector", async function(specialism, cssSelector) {
    await bluex.selectBlogSpecialism(this.page, specialism, cssSelector);
});
Given('I click on the element with {string} if job {string} is more than {int}', async function (cssSelector, count, number) {
    const jobCount = await dataStorage.getVariable(count);
        if (jobCount > number) {
            await utils.click(this.page, cssSelector);
        }
 });
 Given('I scroll element with {string} to the top if jobs {string} is more than {int}', async function (cssSelector, count, number) {
    const jobCount = await dataStorage.getVariable(count);
    if (jobCount > number) {
        await utils.scrollElementToTop(this.page, cssSelector);
    }
});
Given('I should see text {string} in element {string} if jobs {string} is more than {int}', async function (text, cssSelector, count, number) {
    const jobCount = await dataStorage.getVariable(count);
    if (jobCount > number) {
        await utils.seeTextByElementHandle(this.page, cssSelector, text);
    }
});
Given('I click on text {string} if job {string} is more than {string}', async function (text, count, number) {
    const jobCount = await dataStorage.getVariable(count);
    if (jobCount > number) {
        await utils.clickByText(this.page, text);
    }
});
Given('I wait for element with {string} selector to appear within {string} seconds if job {string} is more than {string}', async function (cssSelector, time, count, number) {
    const jobCount = await dataStorage.getVariable(count);
    if (jobCount > number) {
        await utils.seeElement(this.page, cssSelector, time * 1000);
    }
});
Given('I should be on {string} page if job {string} is more than {string}', async function (page, count, number) {
    const jobCount = await dataStorage.getVariable(count);
    if (jobCount > number) {
        const configPage = await config.get(page);
        await main.validatePath(this.page, configPage);
    }
});
Given("I lowercase all saved variables if needed", async function() {
    if (config.has('uppercaseChars')) {
        // do not lowercase chars for OpCos using uppercase like AT,DE,CH(de) etc.
        return true;
    }
    await dataStorage.lowercaseAllVariables();
});