/**
 * @module accessibilityTesting
 * @typedef {import('puppeteer').Page} Page
 * @typedef {import('puppeteer').Browser} Browser
 */
const config = require('config');
const storage = require('./dataStorage');
const helper = require('./helperFunctions');
const pa11y = require('pa11y');
const htmlReporter = require('pa11y-reporter-html');

module.exports = {
    /**
     * Method to validate if certain path meets the criteria from the config.
     * Please use the config json files to set options.
     * You can find more info at - https://github.com/pa11y/pa11y#configuration
     * @param {Browser} browser - puppeteer browser object
     * @param {Page} page - puppeteer page object
     * @param scenarioName - the current scenario name
     * @param path - the path of the page which accessibility will be tested
     * @throws Error
     * @returns {Promise<void>}
     */
    validatePageAccessibility: async function (browser, page, scenarioName, path) {
        const pa11yConfig = config.get('pa11yConfig');
        const configOptions = {
            ...pa11yConfig,
            browser: browser,
            page: page,
        };
        if (!path.startsWith('http')) {
            throw new Error('Only absolute paths are allowed!');
        }

        const results = await pa11y(path, configOptions);
        const fileName = await helper.prepareFileNameFromUrl(path);
        // make the URL ready for filepath usage
        if (results.issues) {
            const html = await htmlReporter.results(results);
            await storage.createHtmlReport('Pa11y-' + scenarioName.slice(0, -1) + fileName, html);
            throw new Error(`${path} page has accessibility issues. HTML report has been generated!`);
        }
    },
};
