/**
 * Wdio session
 *
 * @type {import('webdriverio')}
 */
const {remote} = require('webdriverio');

/**
 * Appium instance manager for handling Appium sessions and capabilities.
 *
 * @class AppiumManager
 * @typedef {AppiumManager}
 */
class AppiumManager {
    /**
     * Creates an instance of AppiumManager.
     *
     * @constructor
     * @param {*} capabilities 
     */
    constructor(capabilities) {
        this.capabilities = capabilities;
        this.appiumDriver = null;
        this.appiumService = null;
    }
    
    /**
     * Description placeholder
     *
     * @async
     * @returns {Promise<void>}
     * @throws {Error} If the Appium service fails to start. 
     */
    async initialize() {

        const wdOpts = {
            hostname: process.env.APPIUM_HOST || 'localhost',
            port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
            logLevel: 'info',
            capabilities: this.capabilities,
        };
        this.appiumDriver = await remote(wdOpts);
    }

    /**
     * Description placeholder
     *
     * @async
     * @returns {Promise<void>} 
     */
    async stop() {
        if (this.appiumDriver) {
            await this.appiumDriver.deleteSession();
            this.appiumDriver = null;
        }
    }   
}

module.exports = AppiumManager;