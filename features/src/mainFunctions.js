const config = require("config");
module.exports = {

    /**
     * Prepare the URL using the config to get the domain and then
     * based on the path variable to either generate a full path or replace it
     * when path is absolute URL.
     * @param path
     * @returns {Promise<string>}
     */
    prepareUrl: async function(path) {
        let baseUrl = config.get('credentials.baseUrl').toString();
        if (baseUrl.endsWith('/')) {
           baseUrl = baseUrl.slice(0,-1);
        }
        if (path === '/' || path === 'homepage' || path === 'home') {
            path = baseUrl;
        }
        if (path.startsWith('http')) {
             return path;
        }
        return baseUrl + path;
    },

    /**
     * Visit a certain URL. Can be relative or absolute.
     * The step also supports auto select of a cookie consent if configured.
     * @param page
     * @param path
     * @returns {Promise<void>}
     */
    visitPath: async function(page, path) {
       const url = await this.prepareUrl(path);
       try {
        await page.goto(url);
       } catch (error) {
           throw new Error(`The requested page cannot be opened!: ${error}`);
       }
       if (config.has('blockingCookie')) {
           const selector = config.get('blockingCookie');
           await new Promise(function(resolve) {
               setTimeout(resolve, 1000)
           });
           const cookie = await page.$(selector)
           if (cookie) {
               await cookie.click();
           }
       }
    },

    /**
     * Visit current page concatenated with another path.
     * Example localhost.com/listing -> localhost.com/listing/page-1
     * @param page
     * @param plus
     * @returns {Promise<void>}
     */
    visitCurrentPathPlus: async function(page, plus) {
        let path = await page.evaluate(() => {
            return window.location.href;
        });
        if (path.endsWith('/')) {
            path = path.slice(0,-1);
        }
        await page.goto(path + plus);
    },

    /**
     * Reload the current page
     * @param page
     * @returns {Promise<void>}
     */
    reloadPage: async function(page) {
        await page.reload({ waitUntil: 'domcontentloaded' });
    },

    /**
     * Validate whether the current page is the one you should be on
     * @param page
     * @param path
     * @returns {Promise<void>}
     */
    validatePath: async function(page, path) {
        const url = new URL(page.url());
        const href = url.href;
        const origin = url.origin;
        const pathAlias = href.replace(origin,"")
        if (pathAlias !== path) {
            throw new Error(`The current path ${pathAlias} does not match the expected: ${path}!`);
        }
    },

    /**
     * Validate http response code
     * @param page
     * @param code
     * @param path
     * @returns {Promise<void>}
     */
    validateStatusCode: async function(page, code, path) {
        let baseUrl = config.get('credentials.baseUrl');
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0,-1);
        }
        const response = await page.goto(baseUrl + path);
        const statusCode = response.status();
        if (statusCode !== Number(code)) {
            throw new Error(`The status code of the response: ${statusCode} does not match the expected!`);
        }
    },

    /**
     * Open new tab and switch to it (follow tab)
     * @param browser
     * @param url
     * @returns {Promise<Object>}
     */
    openNewTab: async function(browser, url) {
        const page = await browser.newPage();
        await this.visitPath(page, url);
        // Get all pages
        const pages = await browser.pages();
        // Switch to the new tab
        return pages[pages.length - 1];
    },

    /**
     * Go back to original page (first tab)
     * To be used when you have more than one tabs open, and you want to go back to the first.
     * @param browser
     * @returns {Promise<Object>}
     */
    openOriginalTab: async function(browser) {
        const pages = await browser.pages();
        // Switch to the original tab - [1] is used because 0 is always empty tab
        return pages[1];
    },

}