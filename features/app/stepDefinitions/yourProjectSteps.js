const { Given, When, Then } = require('@cucumber/cucumber');
const { dataStorage, mainFunctions, elementInteraction } = require('@cuppet/core');
const config = require('config');

Given('I lowercase all saved variables if needed', async function () {
    if (config.has('uppercaseChars')) {
        // do not lowercase chars for certain profiles
        return true;
    }
    await dataStorage.lowercaseAllVariables();
});
When('I go to my custom page {string}', async function (path) {
    await mainFunctions.visitPath(this.page, path);
});

Then('I should see the login button', async function () {
    await elementInteraction.seeElement(this.page, this.commonFields.LoginButton);
});
