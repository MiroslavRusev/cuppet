const puppeteer = require('puppeteer');

class BrowserManager {
    constructor(config, args, credentials) {
        this.config = config;
        this.args = args;
        this.credentials = credentials;
        this.browser = null;
        this.page = null;
    }

    async initialize() {
        // Launch the browser with the provided arguments and configuration
        this.browser = await puppeteer.launch({
            headless: false,
            args: this.args,
            defaultViewport: null,
            w3c: false,
        });
        // Check if the browser was launched successfully and a page is available
        const pages = await this.browser.pages();
        if (pages.length > 0) {
            this.page = pages[0];
        } else {
            this.page = await this.browser.newPage();
        }

        // Set the viewport for headless mode
        if (Array.isArray(this.args)) {
            const isHeadless = this.args.includes('--headless=new');
            if (isHeadless) {
                await this.page.setViewport({
                    width: Number(this.config.width),
                    height: Number(this.config.height),
                });
            }
        }

        // Pass basic authentication credentials if provided
        if (this.credentials) {
            await this.page.authenticate(this.credentials);
        }
    }

    async stop() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }
}

module.exports = BrowserManager;
