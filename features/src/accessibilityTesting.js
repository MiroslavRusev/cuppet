const config = require("config");
const storage = require("./dataStorage");
const pa11y = require("pa11y");
const htmlReporter = require('pa11y-reporter-html');
const { pa11yConfig } = config.get('pa11yConfig');


module.exports = {
    /**
     * Replace the incompatible chars from a URL with _ so that the string can be used in a filename.
     * @param path
     * @returns {Promise<string>}
     */
    prepareFileNameFromUrl: async function (path) {
        const newUrl = new URL(path);
        let pathName = newUrl.pathname;
        return pathName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    },

    /**
     * Method to validate if certain path meets the criteria from the config.
     * Please use the config json files to set options.
     * You can find more info at - https://github.com/pa11y/pa11y#configuration
     * @param browser - puppeteer browser object
     * @param page - puppeteer page object
     * @param scenarioName - the current scenario name
     * @param path - the path of the page which accessibility will be tested
     * @throws Error
     * @returns {Promise<void>}
     */
    validatePageAccessibility: async function (browser, page, scenarioName, path) {
        const additionalConfig = {
            browser: browser,
            page: page,
        }
        const config = {
            ...additionalConfig,
            ...pa11yConfig,
        }
        if (!path.startsWith("http")) {
            throw new Error("Only absolute paths are allowed!")
        }

        const results = await pa11y(path, {config});
        const fileName = await this.prepareFileNameFromUrl(path)
        // make the URL ready for filepath usage
        if (results.issues) {
            const html = await htmlReporter.results(results);
            await storage.createPa11yReport(scenarioName.slice(0,-1) + fileName , html);
            throw new Error (`${path} page has accessibility issues. HTML report has been generated!`)
        }
    }
}
