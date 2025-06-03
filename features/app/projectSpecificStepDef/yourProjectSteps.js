const { Given, When, Then } = require('@cucumber/cucumber');
const dataStorage = require('../../../src/dataStorage');
const config = require('config');
Given('I lowercase all saved variables if needed', async function () {
    if (config.has('uppercaseChars')) {
        // do not lowercase chars for certain profiles
        return true;
    }
    await dataStorage.lowercaseAllVariables();
});
