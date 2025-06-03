/**
 * @module mainFunctions
 * @typedef {import('puppeteer').Page} Page
 * @typedef {import('puppeteer').Browser} Browser
 */
const config = require('config');

module.exports = {
    /**
     * Prepare the URL using the config to get the domain and then
     * based on the path variable to either generate a full path or replace it
     * when path is absolute URL.
     * @param path
     * @returns {Promise<string>}
     */
    prepareUrl: async function (path) {
        if (path.startsWith('http')) {
            return path;
        }
        let baseUrl = config.get('credentials.baseUrl').toString();
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }
        if (path === '/' || path === 'homepage' || path === 'home') {
            return baseUrl;
        }
        return baseUrl + path;
    },

    /**
     * Return current page URL - absolute or relative
     * @param {Page} page
     * @param {boolean} absolute - set to true if you want to extract the full path (with domain)
     * @returns {string}
     */
    extractPath: function (page, absolute = false) {
        const url = new URL(page.url());
        const href = url.href;
        const origin = url.origin;
        if (absolute) {
            return href;
        }
        return href.replace(origin, '');
    },

    /**
     * Visit a certain URL. Can be relative or absolute.
     * The step also supports auto select of a cookie consent if configured.
     * @param {Page} page
     * @param path
     * @returns {Promise<void>}
     */
    visitPath: async function (page, path) {
        const url = await this.prepareUrl(path);
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
        } catch (error) {
            throw new Error(`The requested page cannot be opened!: ${error}`);
        }
        if (config.has('blockingCookie')) {
            const selector = config.get('blockingCookie');
            await new Promise(function (resolve) {
                setTimeout(resolve, 1000);
            });
            const cookie = await page.$(selector);
            if (cookie) {
                await cookie.click();
            }
        }
    },

    /**
     * Visit current page concatenated with another path.
     * Example localhost.com/listing -> localhost.com/listing/page-1
     * @param {Page} page
     * @param plus
     * @returns {Promise<void>}
     */
    visitCurrentPathPlus: async function (page, plus) {
        if (!plus.startsWith('/')) {
            throw new Error('The path alias must start with a slash!');
        }
        let path = page.url();
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        await page.goto(path + plus, { waitUntil: 'domcontentloaded' });
    },

    /**
     * Reload the current page
     * @param {Page} page
     * @returns {Promise<void>}
     */
    reloadPage: async function (page) {
        await page.reload({ waitUntil: 'domcontentloaded' });
    },

    /**
     * Reload the current page and add get params
     * @param {Page} page
     * @param params
     * @returns {Promise<void>}
     */
    reloadPageWithParams: async function (page, params) {
        const currentUrl = this.extractPath(page);
        if (!params.startsWith('?')) {
            throw new Error("Invalid get param provided. Use '?' as first character.");
        }
        const newPath = currentUrl + params;
        await this.visitPath(page, newPath);
    },

    /**
     * Validate whether the current page is the one you should be on
     * @param {Page} page
     * @param path
     * @returns {void}
     */
    validatePath: function (page, path) {
        const pathAlias = this.extractPath(page);
        if (pathAlias !== path) {
            throw new Error(`The current path ${pathAlias} does not match the expected: ${path}!`);
        }
    },

    /**
     * Validate the last path in an alias
     * @param {Page} page
     * @param path
     * @returns {void}
     */
    validatePathEnding: function (page, path) {
        let pathAlias = this.extractPath(page);
        if (pathAlias.endsWith('/')) {
            pathAlias = pathAlias.slice(0, -1);
        }
        const splitAlias = pathAlias.split('/');
        let lastElement;
        if (Array.isArray(splitAlias)) {
            lastElement = splitAlias[splitAlias.length - 1];
        }
        if (lastElement !== path) {
            throw new Error(`The last path alias of ${pathAlias} does not match the expected: ${path}!`);
        }
    },

    /**
     * Validate http response code
     * @param {Page} page
     * @param code
     * @param path
     * @returns {Promise<void>}
     */
    validateStatusCode: async function (page, code, path) {
        let baseUrl = config.get('credentials.baseUrl');
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }
        const response = await page.goto(baseUrl + path);
        const statusCode = response.status();
        if (statusCode !== Number(code)) {
            throw new Error(`The status code of the response: ${statusCode} does not match the expected!`);
        }
    },

    /**
     * Open new tab and switch to it (manually open tab and load a page)
     * @param {Browser} browser
     * @param url
     * @returns {Promise<Object>}
     */
    openNewTab: async function (browser, url) {
        const page = await browser.newPage();
        await this.visitPath(page, url);
        // Get all pages
        const pages = await browser.pages();
        // Switch to the new tab
        return pages[pages.length - 1];
    },

    /**
     * Validate current page response headers.
     * @param {Page} page
     * @param header
     * @param value
     * @returns {Promise<void>}
     */
    validatePageResponseHeaders: async function (page, header, value) {
        const refreshPage = await page.reload({ waitUntil: 'domcontentloaded' });
        const responseHeaders = refreshPage.headers();
        if (responseHeaders[header.toLowerCase()] !== value) {
            throw new Error('Response headers do not match the requirement!');
        }
    },

    /**
     * Verify cookie existence by name
     * @param {object} page
     * @param {string} cookieName
     * @param {boolean} presence
     * @returns {Promise<void>}
     */
    verifyCookiePresence: async function (page, cookieName, presence) {
        let result;
        const jsCode = `(function (name) {
                var dc = document.cookie;
                var prefix = name + '=';
                var begin = dc.indexOf('; ' + prefix);
                if (begin == -1) {
                    begin = dc.indexOf(prefix);
                    if (begin != 0) return null;
                }
                else
                    {
                        begin += 2;
                        var end = document.cookie.indexOf(';', begin);
                        if (end == -1) {
                            end = dc.length;
                        }
                }
                return decodeURI(dc.substring(begin + prefix.length, end));
            })('${cookieName}');`;
        try {
            result = await page.evaluate(jsCode);
        } catch (error) {
            throw new Error(`There was an error when evaluating the code. ${error}`);
        }

        if (result) {
            if (!presence) {
                throw new Error(`The cookie ${cookieName} is present, but it shouldn't!`);
            }
        } else if (!result) {
            if (presence) {
                throw new Error(`The cookie ${cookieName} is not present, but it should!`);
            }
        }
    },
    /**
     * Sets the viewport of the given page to match the specified device's dimensions.
     *
     * @param {Object} page - The page object where the viewport should be set.
     * @param {string} device - The name of the device whose viewport dimensions should be applied.
     * @throws {Error} Throws an error if the specified device is not defined in the configuration.
     */
    setViewport: async function (page, device) {
        const viewport = config.get('viewport');

        if (!viewport[device]) {
            throw new Error(
                `Viewport for device "${device}" is not defined in config.\nAvailable devices are: ${Object.keys(viewport).join(', ')}`
            );
        }
        await page.setViewport({
            width: viewport[device]['width'],
            height: viewport[device]['height'],
        });
    },
};
