const config = require('config');

module.exports = {
    /**
     * Handles UiSelector case as it requires special prefixing
     * @param {string} selector
     * @returns {string} - Either the original selector or a UiSelector formatted string
     */
    prepareSelector: function (selector) {
        if (selector.startsWith('.')) {
            // If the selector starts with ., treat it as a UiSelector
            // For example .text('Example Text') becomes android='new UiSelector().text("Example Text")'
            return `android=new UiSelector()${selector}`;
        } else {
            return selector; // Otherwise, return the selector as is
        }
    },

    /**
     * @param {import('@wdio/globals').driver} driver - The WebDriverIO appium instance.
     * @param {string} androidPackage - The name of the Android package.
     * @param {string} activity - The name of the Android activity.
     * @returns {Promise<void>} - Resolves when the session is reloaded successfully.
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
     * @param {import('@wdio/globals')} driver - The WebDriverIO appium instance.
     * @param {string} selector - The selector of the element to click.
     * Possible values for selector: https://webdriver.io/docs/selectors/
     * - A UiSelector string, e.g. '.text("Example Text")'
     * - An ID selector (e.g. 'com.example:id/button1')
     * - A class name selector (e.g. 'android.widget.Button')
     * - An accessibility ID selector (e.g. '~button1')
     * @returns {Promise<void>} - Resolves when the element is clicked successfully.
     * @throws Will throw an error if the element is not found or not clickable.
     */
    clickElement: async function (driver, selector) {
        try {
            // $ and $$ are not async functions, as Wdio uses lazy loading.
            // The actual element is not fetched until an action is performed like .click(), .getText(), .isDisplayed(), etc.
            const element = driver.$(selector);
            await element.waitForDisplayed({ timeout: 5000 });
            await element.click();
        } catch (error) {
            throw new Error(`Error clicking element with selector ${selector}: ${error}`);
        }
    },

    /**
     * @param {import('@wdio/globals').driver} driver - The WebDriverIO appium instance.
     * @param {string} selector - The selector of the element.
     * @returns {Promise<void>} - Resolves when the element is scrolled into view successfully.
     * @throws Will throw an error if the element is not found.
     */
    scrollToElement: async function (driver, selector) {
        try {
            await driver.findElement(
                '-android uiautomator',
                `new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().${selector})`
            );
        } catch (error) {
            throw new Error(`Cannot find element with selector ${selector}: ${error}`);
        }
    },
};
