const {
    Given,
    When,
    Then
} = require('@cucumber/cucumber');
const apiSteps = require('../../src/apiFunctions');
const storage = require("../../src/dataStorage");

Given("that I send a {string} request to {string}", async function (method, path) {
    await apiSteps.sendRequest(method,path);
})
When("I send a {string} request to {string} with http header {string} and value {string}",
    async function (method, path, headerName, headerValue) {
        const name = await storage.checkForSavedVariable(headerName);
        const value = await storage.checkForSavedVariable(headerValue);
        const headers = {};
        headers[name] = value;
        await apiSteps.sendRequest(method,path, headers);
})
Given("the response code should be {string}", async function (code) {
    await apiSteps.validateResponseCode(code);
})
Then("the response should be an {string}", async function (type) {
    await apiSteps.validateResponseType(type);
})
Then("the property {string} should be an {string}", async function (property, type) {
    await apiSteps.propertyIs(property, type);
})
Then('the response should have property {string} with value {string}', async function (property, value) {
    await apiSteps.propertyHasValue(property, value);
})
When("I store {string} to {string} variable", async function (property, variable) {
    await apiSteps.iRememberVariable(property, variable);
})
Given("that I have request body", async function (docString) {
    const body = JSON.stringify(docString);
    await apiSteps.prepareRequestBody(body)
})