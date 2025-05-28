const config = require('config');
const AppiumManager = require('../app/appiumManager');
module.exports = {

   /** * Waits for an element to be displayed and then clicks it.
   * @param {import('webdriverio').remote} driver - The WebDriverIO appium instance.
   * @param {string} androidPackage - The name of the Android package.
   * @param {string} activity - The name of the Android activity.
   * @throws Will throw an error if the element is not found or not clickable.
   */
  setCapabilities: async function (driver, androidPackage, activity) {
    const capabilities = config.get('appiumCapabilities');
    const newCapabilities = {
      ...capabilities,
      'appium:appPackage': androidPackage,
      'appium:appActivity': activity,
    };
    console.log (driver)
    await driver.deleteSession();
    // Create a new AppiumManager instance with the updated capabilities
    const appiumManager = new AppiumManager(newCapabilities);
    await appiumManager.initialize();
    // Return the new Appium driver instance
    return appiumManager.appiumDriver;
  },

  /** * Waits for an element to be displayed and then clicks it.
   * @param {import('webdriverio').remote} driver - The WebDriverIO appium instance.
   * @param {string} xpath - The XPath of the element to click.
   * @throws Will throw an error if the element is not found or not clickable.
   */
  clickElement: async function (driver, xpath) {
    try {
      const element = await driver.$(xpath);
      await element.waitForDisplayed({ timeout: 5000 });
      await element.click();
    } catch (error) {
      throw new Error(`Error clicking element with xpath ${xpath}: ${error}`);
    }
  },
}
