const {
    Given,
    When,
    Then
} = require('@cucumber/cucumber');
const appiumTesting = require('../../src/appiumTesting');

Given("I go to {string} app package and {string} activity", async function (androidPackage, activity) {
    await appiumTesting.reloadSession(this.appiumDriver, androidPackage, activity);
})

Then("I click on the element {string} on mobile", async function (selector) {
    await appiumTesting.clickElement(this.appiumDriver, selector);
})

When("I scroll to the element {string} on mobile", async function (selector) {
    await appiumTesting.scrollToElement(this.appiumDriver, selector);
})