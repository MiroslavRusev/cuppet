/**
 * @type {string}
 * @name scenarioName - name of the scenario from the Before hook
 */
const {
    Given,
    When,
    Then
} = require('@cucumber/cucumber');
const accessibilitySteps  = require('../../src/accessibilityTesting');
const dataStorage = require("../../src/dataStorage");
const main = require('../../src/mainFunctions');

Given("I validate the saved page accessibility", async function () {
    const path = await dataStorage.getVariable('path')
    await accessibilitySteps.validatePageAccessibility(this.browser, this.page, this.scenarioName, path);
})
When("I validate the accessibility of the {string} page", async function (path) {
    const preparedPath = main.prepareUrl(path);
    await accessibilitySteps.validatePageAccessibility(this.browser, this.page, this.scenarioName, preparedPath);
})