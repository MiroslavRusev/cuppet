const {
    Given,
    When,
    Then
} = require('@cucumber/cucumber');
const appiumTesting = require('../../src/appiumTesting');

Given("I go to {string} app package and activity {string}", async function (androidPackage, activity) {
    this.appiumDriver = await appiumTesting.setCapabilities(this.appiumDriver, androidPackage, activity);
})

Then("I click on the element {string} on mobile", async function (selector) {
    await appiumTesting.clickElement(this.appiumDriver, selector);
})