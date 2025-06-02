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
    const elSelector = appiumTesting.prepareSelector(selector);
    console.log(`Clicking on element with selector: ${elSelector}`);
    await appiumTesting.clickElement(this.appiumDriver, elSelector);
})

When("I scroll to the element {string} on mobile", async function (selector) {
    await appiumTesting.scrollToElement(this.appiumDriver, selector);
})