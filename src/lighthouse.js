/**
 * @module lighthouse
 * @typedef {import('puppeteer').Page} Page
 */
const dataStorage = require('./dataStorage');
const helper = require('./helperFunctions');

module.exports = {
    /**
     *
     * @param {Page} page
     * @param path
     * @param scenarioName
     * @returns {Promise<void>}
     */
    validatePageSpeed: async function (page, path, scenarioName) {
        const { default: lighthouse, generateReport: report } = await import('lighthouse');
        const { lhr } = await lighthouse(path, undefined, undefined, page);
        const reportHtml = report(lhr, 'html');
        const fileName = await helper.prepareFileNameFromUrl(path);
        await dataStorage.createHtmlReport('LightHouse-' + scenarioName.slice(0, -1) + fileName, reportHtml);
    },
};
