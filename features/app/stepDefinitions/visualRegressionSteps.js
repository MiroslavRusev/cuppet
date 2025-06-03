/**
 * @type {string}
 * @name scenarioName - name of the scenario from the Before hook
 */
const { Given, When, Then } = require('@cucumber/cucumber');
const imageCompare = require('../../../src/visualRegression');
const main = require('../../../src/mainFunctions');
const dataStorage = require('../../../src/dataStorage');
Given('I generate reference screenshot for {string}', async function (path) {
    const storedUrl = await dataStorage.checkForVariable(path);
    const url = await main.prepareUrl(storedUrl);
    await imageCompare.runBackStopSingleScenario(this.scenarioName, url, 'reference');
});
Then('I compare {string} to reference screenshot', async function (path) {
    const storedUrl = await dataStorage.checkForVariable(path);
    const url = await main.prepareUrl(storedUrl);
    await imageCompare.runBackStopSingleScenario(this.scenarioName, url, 'test');
});
Given('I generate reference screenshot for multiple pages', async function (docString) {
    const pages = JSON.parse(docString);
    await imageCompare.runBackstopMultiplePages(pages, 'reference');
});
Then('I compare multiple pages to their references', async function (docString) {
    const pages = JSON.parse(docString);
    await imageCompare.runBackstopMultiplePages(pages, 'test');
});
