const {
    Given,
    When,
    Then
} = require('@cucumber/cucumber');
const helper = require("../../src/helperFunctions");
const dataStorage = require("../../src/dataStorage");
const config = require('config');

When("I wait for {string} seconds", async function (seconds) {
    seconds = seconds * 1000;
    await new Promise(function(resolve) {
        setTimeout(resolve, seconds)
    });
})
When("I wait for AJAX loading to finish", async function () {
    await helper.waitForAjax(this.page);
})
When("I put a breakpoint", {timeout: -1}, async function () {
    console.log('Debug mode on! Press any key to continue!');
    await helper.waitForKeypress();
})
Given("I clear the json file", async function() {
    await dataStorage.clearJsonFile();
})
Given("I store {string} in {string} variable", async function(data, variable) {
    await dataStorage.iStoreVariableWithValueToTheJsonFile(data, variable);
})
Given("I save path for current page", async function() {
    await dataStorage.saveCurrentPath(this.page);
})
Given("I store {string} from config to {string} in JSON", async function(param, variable) {
    const value = await config.get(param)
    await dataStorage.iStoreVariableWithValueToTheJsonFile(value, variable);
})
Given("I store the entity id with variable name {string} to the json file", async function(variable) {
    await dataStorage.iStoreEntityId(this.page, variable);
})
Given("I store the value from the element with {string} selector in {string}", async function (cssSelector, variable) {
    await dataStorage.storeValueOfElement(this.page, cssSelector, variable);
})
Then("I generate extension with {int} chars for the email {string} variable from config and store it in {string}",
    async function(number, configVariable, varName) {
    await dataStorage.generateExtensionAndStoreVar(number, configVariable, varName)
})
Then("I generate extension with {int} chars for the email {string} and store it in {string}",
    async function(number, email, varName) {
        await dataStorage.generateExtensionAndStoreVar(number, email, varName)
    })
Given("I lowercase all saved variables", async function() {
    await dataStorage.lowercaseAllVariables();
})
When("I trim {string} variable on first special char occurrence", async function(variable) {
    await dataStorage.trimVariableOnFirstSpecialChar(variable);
})