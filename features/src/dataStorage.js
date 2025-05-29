const config = require('config');
const fs = require("fs");
const helper = require("./helperFunctions");
const commonFields = require("../app/components/commonFields");
const moment = require("moment")
const jsonFilePath = config.get('jsonFilePath').toString();

module.exports = {

    /**
     * Create the JSON file in which test data will be stored
     * @returns {Promise<void>}
     */
    createFile: async function () {
        if (jsonFilePath && !fs.existsSync(jsonFilePath)) {
            fs.writeFile(jsonFilePath, '', {flag: 'w+'}, (err) => {
                if (err) {
                    console.error('File is not created, please check if the folder exists!')
                } else {
                    console.log('File Created');
                }
            })
        }
    },

    /**
     * Clear the JSON file
     * @returns {void}
     */
    clearJsonFile: function () {
        if (jsonFilePath) {
            fs.truncate(jsonFilePath, 0, () => {console.log('JSON File Cleared successfully!')});
        }
    },

    /**
     * Generate pa11y,lighthouse etc. html reports
     * @param fileName - string with the name of the file
     * @param data - HtmlReporter formatted result
     * @returns {Promise<void>}
     */
    createHtmlReport: async function (fileName, data) {
        const profile = process.env.NODE_CONFIG_ENV;
        fs.writeFile(`reports/${profile}/${fileName}.html`, data, (err) => {
            if (err) throw err;
            console.log(`Html report: ${fileName}.html is generated!`);
        });
    },

    /**
     * Load the JSON file
     * @param file
     * @returns {any|{}}
     */
    getJsonFile: function (file = '') {
        file = file || jsonFilePath;
        const result = fs.readFileSync(file, "utf-8");
        return result ? JSON.parse(result) : {};
    },

    /**
     * Save variable to JSON file. Example: {
     *     "varName":"Value"
     * }
     * @param data - the value of the variable
     * @param variable - the variable name
     * @returns {Promise<void>}
     */
    iStoreVariableWithValueToTheJsonFile: async function (data, variable)
    {
        const tempJson = this.getJsonFile();
        tempJson[variable] = data;
        fs.writeFileSync(jsonFilePath, JSON.stringify(tempJson),{ flag:'w+'});
    },

    /**
     * Get specific variable and throw error if missing
     * @param variable
     * @param {boolean} stringify - flag to be used when getting values which are object themselves
     * @returns {*}
     */
    getVariable: function (variable, stringify = false) {
        const tempJson = this.getJsonFile();
        if (!tempJson[variable]) {
            throw new Error (`Variable with name ${variable} not found in the json file!`)
        }
        if (stringify) {
            return JSON.stringify(tempJson[variable])
        }
        return tempJson[variable];
    },

    /**
     * Check for variable existence or return the inputted value.
     * To be used in steps which can work both with JSON vars and direct user input
     * @param variable
     * @returns {*}
     */
    checkForVariable: function (variable) {
        const tempJson = this.getJsonFile();
        return tempJson[variable] ?? variable;
    },

    /**
     * Replace single occurrence of %% pattern in a string with a stored variable.
     * Example - I go to "/node/%myStoredPage%" -> "/node/test-page-alias"
     * @param data
     * @returns {Promise<*>}
     */
    checkForSavedVariable: async function (data) {
        return data.replace(/%([a-zA-Z_-]+)%/g, (match, p1) => {
            return this.checkForVariable(p1);
        });
    },

    /**
     * Similar to checkForSavedVariable but it extracts multiple variable names from the following pattern:
     * Example - "Here are %var1% and %var2%" and replace
     * them with their values - "Here are valueOfVar1 and valueOfVar2"
     * @param text
     * @returns {Promise<*>}
     */
    checkForMultipleVariables: async function (text) {
        const regex = /%([^%]+)%/g;
        const allVariables = this.getJsonFile();
        // The convention dictates if function argument is not used, it can be replaced by "_".
        const result = text.replace(regex, (_, group) => {
            return allVariables[group];
        });
        return result || text;
    },

    /**
     * Re-save the JSON file with all it's values in lowercase.
     * @returns {Promise<void>}
     */
    lowercaseAllVariables: async function () {
        const allVariables = this.getJsonFile();
        const lowercaseJson = Object.fromEntries(
            Object.entries(allVariables).map(
                ([key, value]) =>
                    [key, typeof value === 'string' ? value.toLowerCase() : value]
            ));
        fs.writeFileSync(jsonFilePath, JSON.stringify(lowercaseJson),{ flag:'w+'});

    },

    /**
     * Cut the value of a variable on special char occurrence. The regex can be changed via the config json.
     * Example - valueOf@Variable -> valueOf.
     * @param variable
     * @returns {Promise<void>}
     */
    trimVariableOnFirstSpecialChar: async function (variable) {
        let regex = /[?&@$#:,;]/;
        if (config.has('trimRegex')) {
            const configRegex = config.get('trimRegex');
            regex = new RegExp(configRegex.toString());
        }
        const value = this.getVariable(variable);
        let splitArr = value.split(regex);
        const result = splitArr[0].trim();
        await this.iStoreVariableWithValueToTheJsonFile(result, variable)
    },

    /**
     * Check for stored css selectors with the inputted name
     * @param cssSelector
     * @returns {Promise<*>}
     */
    prepareCssSelector: async function (cssSelector) {
        const drupalSelector = commonFields[cssSelector] ?? cssSelector;
        return this.checkForSavedVariable(drupalSelector);
    },

    /**
     * Save current page url in both relative and absolute url variants. Predefined json
     * property names are used for easier usage.
     * @param page - current tab in puppeteer
     * @returns {Promise<void>}
     */
    saveCurrentPath: async function (page) {
        // Get the current URL
        const url = new URL(page.url());
        const absolutePath = url.href;
        // Get the relative path
        const relativePath = url.pathname;
        // Store paths
        await this.iStoreVariableWithValueToTheJsonFile(absolutePath, 'path')
        await this.iStoreVariableWithValueToTheJsonFile(relativePath, 'relativePath')
    },

    /**
     * Store ID (in case of Drupal) or the sequence of numbers in url path alias.
     * Example /node/123/edit -> 123 will be extracted and saved
     * @param page
     * @param variable
     * @returns {Promise<void>}
     */
    iStoreEntityId: async function (page, variable) {
        const currentUrl = new URL(page.url());
        const alias = currentUrl.pathname;
        const matches = /[1-9]\d*/.exec(alias);
        if (!matches) {
            throw new Error(`The url path doesn't contain an ID:${alias}`);
        }
        await this.iStoreVariableWithValueToTheJsonFile(matches[0], variable)
    },

    /**
     * Saves the href from a link <a>.
     * TO DO: Can be done with more generic method to save specific attribute of element, instead of the hardcoded href.
     * @param page
     * @param selector
     * @param variable
     * @returns {Promise<void>}
     */
    storeHrefOfElement: async function (page, selector, variable) {
         await page.waitForSelector(selector);
         let href = await page.$eval(selector, el => el.getAttribute('href'));
         href = encodeURI(href);
         await this.iStoreVariableWithValueToTheJsonFile(href, variable);
    },

    /**
     * Save the text from a page element matching specific pattern.
     * Example: "This is your code for password reset: 123456"
     * You can create a regex to find the 123456 number and extract it from that text.
     * @param page - current puppeteer tab
     * @param pattern - regex
     * @param text - text in which this pattern needs to be searched for
     * @returns {Promise<void>}
     */
    storeTextFromPattern: async function (page, pattern, text) {
        const element = await page.$('xpath/' + `//body//*[text()[contains(.,'${text}')]]`);
        let textValue = await (await page.evaluateHandle(el => el.textContent, element)).jsonValue();
        const regex = new RegExp(pattern);
        const matches = regex.exec(textValue);
        if (!matches) {
            throw new Error(`There isn't a string matching the pattern:${regex}`);
        }
        await this.iStoreVariableWithValueToTheJsonFile(matches[0], 'storedString');
    },

    /**
     * Store the value of the element (input, button, option, li etc.)
     * @param page
     * @param cssSelector
     * @param variable
     * @returns {Promise<void>}
     */
    storeValueOfElement: async function (page, cssSelector, variable) {
        const selector = await this.prepareCssSelector(cssSelector);
        await page.waitForSelector(selector);
        const value = await page.$eval(selector, el => el.value);
        if (!value) {
            throw new Error(`Element with selector ${selector} doesn't have value!`);
        }
        await this.iStoreVariableWithValueToTheJsonFile(value, variable);
    },

    /**
     * Generate mail extension with specific length.
     * Example test@example.com -> test+zy62a@example.com
     * @param number
     * @param emailVariable
     * @param varName
     * @returns {Promise<void>}
     */
    generateExtensionAndStoreVar: async function (number, emailVariable, varName) {
        let email = emailVariable;
        if (config.has(emailVariable)) {
            email = config.get(emailVariable);
        }
        let splitVar = email.split('@');
        if (splitVar.length === 0) {
            throw new Error(`The provided string: ${email} is not an email!`)
        }
        let randomStr = helper.generateRandomString(number);
        const value = splitVar[0] + '+' + randomStr + '@' + splitVar[1];
        await this.iStoreVariableWithValueToTheJsonFile(value, varName)
    },

    /**
     *
     * @param format
     * @param variable
     * @param days
     * @returns {Promise<void>}
     */
    generateAndSaveDateWithCustomFormat: async function (format, variable, days = 0) {
        let date = moment()
            .add(days >= 0 ? days : -days, "days")
            .format(format);

        await this.iStoreVariableWithValueToTheJsonFile(date, variable);

    },
}