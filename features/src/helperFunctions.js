const config = require("config");
const strings = require("../support/multilingualStrings/multilingualStrings");
module.exports = {

    /**
     * Waits for a keypress event to continue the test execution.
     * Please use only for local execution as it doesn't resolve automatically.
     *
     * @returns {Promise<void>} - A promise that resolves when a keypress event occurs.
     */
    waitForKeypress: async function () {
        process.stdin.setRawMode(true)
        return new Promise(resolve => process.stdin.once('data', () => {
            process.stdin.setRawMode(false)
            resolve()
        }))
    },

    /**
     * Generate random string with custom length
     * @param length
     * @returns {string}
     */
    generateRandomString: function (length) {
        return Math.random().toString(36).substring(2,(length + 2));
    },

    /**
     * Wait until AJAX request is completed
     * @param page
     * @returns {Promise<void>}
     */
    waitForAjax: async function (page) {
        const jsCode = "(typeof jQuery === 'undefined' || (jQuery.active === 0 && jQuery(':animated').length === 0))";
        await page.waitForFunction(jsCode);
    },

    /**
     * Returns the translated variant of the inputted text or the text itself if there isn't a translation.
     * @param text
     * @returns {Promise<string>}
     */
    getMultilingualString: async function (text) {
        const lang = config.has('language') ? config.get('language') : null;
        let result;
        if (lang) {
            let string = strings.multilingualStrings(lang, text);
            result = string ?? text;
        } else {
            result = text
        }
        return result;
    },

    /**
     * Retrieves the class name of an element based on a property in the config json.
     * You can set directly the full class, partial or ID, but mind that it always resolves to
     * the full className of that element.
     *
     * @param {Object} page - The page object representing the web page.
     * @param {string} region - The region of the page to search for the element.
     * @returns {Promise<string>} - A promise that resolves to the class name of the element.
     */
    getRegion: async function (page, region) {
        const regionMap = config.get('regionMap');
        const el = await page.waitForSelector(regionMap[region]);
        return  await (await el.getProperty('className')).jsonValue();
    },

    /**
     * Assert that array is in alphabetical order
     *
     * @param  {Array} arr
     * @param  {string|number} propKey - json property when element items are objects or array key for simple arrays
     * @returns {boolean}
     */
    isArraySorted: function (arr, propKey) {
        let sortedArr = arr;
        sortedArr.sort((a, b) => a[propKey].localeCompare(b[propKey]));

        return (JSON.stringify(arr) === JSON.stringify(sortedArr))
    }

}