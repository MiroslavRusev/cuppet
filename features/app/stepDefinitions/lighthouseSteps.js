/**
 * @type {string}
 * @name scenarioName - name of the scenario from the Before hook
 */
const { Given, When, Then } = require('@cucumber/cucumber');
const lighthouseMethods = require('../../../src/lighthouse');
const dataStorage = require('../../../src/dataStorage');
const main = require('../../../src/mainFunctions');

Given('I generate lighthouse report for the saved page', async function () {
    const path = await dataStorage.getVariable('path');
    await lighthouseMethods.validatePageSpeed(this.page, path, this.scenarioName);
});
When('I generate lighthouse report for {string} page', async function (path) {
    const preparedPath = main.prepareUrl(path);
    await lighthouseMethods.validatePageSpeed(this.page, preparedPath, this.scenarioName);
});
