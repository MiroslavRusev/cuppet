const config = require('config');
const AppiumManager = require('../app/appiumManager');

module.exports = {
  /** 
  * @param {import('@wdio/globals').browser} driver - The WebDriverIO appium instance.
  * @param {string} androidPackage - The name of the Android package.
  * @param {string} activity - The name of the Android activity.
  * @throws Will throw an error if the element is not found or not clickable.
  */
  reloadSession: async function (driver, androidPackage, activity) {
    const appiumCapabilities = config.get('appiumCapabilities');
    const capabilities = {
      ...appiumCapabilities,
      'appium:appPackage': androidPackage,
      'appium:appActivity': activity,
    };
    // Reload the session with the updated capabilities
    await driver.reloadSession(capabilities);
  },

  /** 
  * @param {import('@wdio/globals').browser} driver - The WebDriverIO appium instance.
  * @param {string} selector - The selector of the element to click.
  * @throws Will throw an error if the element is not found or not clickable.
  */
  clickElement: async function (driver, selector) {
    try {
      const element = driver.$(selector);
      await element.waitForDisplayed({ timeout: 5000 });
      await element.click();
    } catch (error) {
      throw new Error(`Error clicking element with selector ${selector}: ${error}`);
    }
  },

  /** 
  * @param {import('@wdio/globals').browser} driver - The WebDriverIO appium instance.
  * @param {string} selector - The selector of the element.
  * @throws Will throw an error if the element is not found.
  */
  scrollToElement: async function (driver, selector) {
    try {
      // TO DO: Implement a proper scroll mechanism for Appium
    } catch (error) {
      throw new Error(`Cannot find element with selector ${selector}: ${error}`);
    }
  }
}
