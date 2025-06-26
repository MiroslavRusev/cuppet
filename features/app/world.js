const { setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');
const config = require('config');
const commonFields = require('./commonComponents/commonFields');
const strings = require('./multilingualStrings/multilingualStrings');
const { World: CoreWorld } = require('@cuppet/core/features/app/world'); // Adjust path if needed

setDefaultTimeout(120 * 1000);

/**
 * Custom world class that extends the core world class
 * This is used to add custom functionality to the world in the scope of this project.
 */
class CustomWorld extends CoreWorld {
    constructor(options) {
        super(options); // This will set up this.page, this.browser, etc.
        this.commonFields = commonFields;
        this.enableMlSupport();
    }

    enableMlSupport() {
        const lang = config.has('language') ? config.get('language') : null;
        if (lang) {
            this.mlStrings = strings.multilingualStrings(lang) ?? {};
        } else {
            this.mlStrings = {};
        }
    }
}

setWorldConstructor(CustomWorld);
