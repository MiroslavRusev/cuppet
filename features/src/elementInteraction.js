const config = require("config");
const mime = require('mime');
const fs = require("fs");
const helper = require("./helperFunctions");

module.exports = {

    /**
     * Special handling in cases where you want a positive result if an element is missing.
     * To be used in cases where element randomly shows/hides or the step is shared between profiles which have mixed
     * support for that field.
     * @param page
     * @param selector
     * @param skipFlag
     * @returns {Promise<boolean>}
     */
    customWaitForSkippableElement: async function (page, selector, skipFlag) {
        try {
            await page.waitForSelector(selector)
        } catch (error) {
            if (skipFlag) {
                // Exit from the function as the step was marked for skipping
                return true;
            } else {
                throw new Error(`Element with selector ${selector} not found!`);
            }
        }
    },

    /**
     * Click on an element
     * @param page
     * @param selector
     * @returns {Promise<void>}
     */
    click: async function (page, selector) {
        const objectToCLick = await page.waitForSelector(selector);
        try {
            await objectToCLick.click(selector, { delay: 150 });
        } catch (error) {
            throw new Error(`Could not click on element: ${selector}. Error: ${error}`);
        }
    },

    /**
     * Click on multiple elements 1 by 1
     * @param page
     * @param selector
     * @returns {Promise<void>}
     */
    clickAllElements: async function (page, selector) {
        await page.waitForSelector(selector);
        const elements = await page.$$(selector);
        for (let element of elements) {
            await element.click({ delay: 300 });
        }
    },

    /**
     * Press a single key
     * @param page
     * @param key
     * @returns {Promise<void>}
     */
    pressKey: async function (page, key) {
        try {
            await page.keyboard.press(key, { delay: 100 });
        } catch (error) {
            throw new Error(`Couldn't press key ${key} on the keyboard`);
        }
    },

    /**
     * Validate text in the page scripts
     * @param page
     * @param text
     * @returns {Promise<void>}
     */
    validateTextInScript: async function (page, text) {
        try {
            await page.waitForSelector(
                'xpath/' + `//script[contains(text(),'${text}')]`
            );
        } catch (error) {
            throw new Error(`Could not find: ${text} in page scripts.`);
        }
    },

    /**
     * Validate that specific text can be found in the page structured data
     * @param page
     * @param text
     * @returns {Promise<void>}
     */
    validateTextInSchemaOrg: async function (page, text) {
        try {
            await page.waitForSelector('script[type="application/ld+json"]');
            await page.waitForSelector(
                'xpath/' + `//script[contains(text(),'${text}')]`
            );
        } catch (error) {
            throw new Error(`Could not find: ${text} in schema org.`);
        }
    },

    /**
     * Validate that specific text is missing in the structured data
     * @param page
     * @param text
     * @returns {Promise<void>}
     */
    validateTextNotInSchemaOrg: async function (page, text) {
        await page.waitForSelector('script[type="application/ld+json"]');
        const isTextInSchema = await page.$(
           'xpath/' + `//script[@type="application/ld+json"][contains(text(),'${text}')]`
        );
        if (isTextInSchema) {
           throw new Error(`${text} can be found in the schema org.`)
       }
    },

    /**
     * Click on element by its text value
     * @param page
     * @param text
     * @returns {Promise<void>}
     */
    clickByText: async function (page, text) {
        const objectToClick = await page.waitForSelector(
                'xpath/' + `//body//*[text()[contains(.,'${text}')]]`
        );
        try {
            await objectToClick.click();
        } catch (error) {
            throw new Error(`Could not click on element with text ${text}`)
        }

    },

    /**
     * Follow link by its name(text value). To be used on target="_self"
     * @param page
     * @param text
     * @returns {Promise<void>}
     */
    followLink: async function (page, text) {
        const objectToClick = await page.waitForSelector(
            'xpath/' + `//a[contains(text(), '${text}')]`
        );
        try {
            await objectToClick.click();
            await page.waitForNavigation();
        } catch (error) {
            throw new Error(`Could not click on the element with text: ${text}`);
        }
    },

    /**
     * Click on the text of a link and expect it to open in a new tab. target="_blank"
     * @param browser
     * @param page
     * @param text
     * @returns {Promise<Object>}
     */
    clickLinkOpenNewTab: async function (browser, page, text) {
        const objectToClick = await page.waitForSelector(
            'xpath/' + `//body//*[text()[contains(.,'${text}')]]`
        );
        try {
            await objectToClick.click();
        } catch (error) {
            throw new Error(`Could not click on element with text ${text}`)
        }
        const pages = await browser.pages();
        // Switch to the new tab
        page =  pages[pages.length - 1];
        return page;
    },

    /**
     * Click on element by css selector and follow the popup window
     * @param page
     * @param selector
     * @returns {Promise<Object>}
     */
    clickElementOpenPopup: async function (page, selector) {
        const objectToClick = await page.waitForSelector(selector);
        try {
            await objectToClick.click();
        } catch (error) {
            throw new Error(`Could not click on element with selector ${selector}`)
        }
        // Set up a listener for the 'popup' event
        const newPagePromise = new Promise(resolve => {
            page.once('popup', async popup => {
                // Return the popup as a new page object
                resolve(popup);
            });
        });
        return await newPagePromise;
    },
    
    /**
     * Find link by text and validate it's href value
     * @param page
     * @param text
     * @param href
     * @returns {Promise<void>}
     */
    validateHrefByText: async function (page, text, href) {
        const objectToSelect = await page.waitForSelector(
            'xpath/' + `//a[contains(text(), '${text}')]`
        );
       const hrefElement =  await (await objectToSelect.getProperty('href')).jsonValue();
       if (hrefElement !== href) {
           throw new Error(`The href of the link is ${hrefElement} and it is different from the expected ${href}!`)
       }
    },
    
    /**
     * Validate that element is rendered and visible by its css selector.
     * Mind that hidden elements will not show (DOM existence is not enough for that step)
     * @param page
     * @param selector
     * @param {boolean} isVisible - set to false for validating dom existence only
     * @param  {int} time
     * @returns {Promise<void>}
     */
    seeElement: async function (page, selector, isVisible = true, time = 3000) {
        const options = {
            visible: isVisible, // Wait for the element to be visible
            timeout: time, // Maximum time to wait in milliseconds
        };
        try {
            await page.waitForSelector(selector, options);
        } catch (error) {
            throw new Error(`There is no element with selector: ${selector}!`);
        }
    },

    /**
     * Validate specific link attribute value. Find the link using its href value.
     * @param page - current puppeteer tab
     * @param href - link href value
     * @param attribute - attribute you search for
     * @param value - the expected value of that attribute
     * @param skip - check method customWaitForSkippableElement() for more info
     * @returns {Promise<boolean>}
     */
    validateValueOfLinkAttributeByHref: async function (page, href, attribute, value, skip = false) {
        const attrValue = await page.$eval(
            `a[href="${href}"]`, (el, attribute) => el.getAttribute(attribute), attribute
        );
        if (!attrValue && skip === true) {
            // Exit successfully if there is no value and the step is marked to be skipped
            return true;
        }
        if (value !== attrValue) {
            throw new Error(
                `The provided link "${href}" does not have an attribute with value: ${value}.`
            );
        }
    },

    /**
     * Validate the value of certain attribute for a generic element by using its css selector to locate it.
     * @param page
     * @param selector
     * @param attribute
     * @param value
     * @param skip
     * @returns {Promise<boolean>}
     */
    validateElementWithSelectorHasAttributeWithValue: async function (
        page,
        selector,
        attribute,
        value,
        skip = false
    ) {
        const skipped = await this.customWaitForSkippableElement(page, selector, skip);
        if (skipped) {
            return true;
        }
        const attrValue = await page.$eval(
            selector, (el, attribute) => el.getAttribute(attribute), attribute
        );
        if (value !== attrValue) {
            throw new Error(`The provided element with selector "${selector}" does not have an attribute with value: ${value}.`);
        }
    },

    /**
     * Same as the method above validateElementWithSelectorHasAttributeWithValue(), but using
     * the text of the element to locate it.
     * @param page
     * @param text
     * @param attribute
     * @param value
     * @returns {Promise<void>}
     */
    validateValueOfElementAttributeByText: async function (page, text, attribute, value) {
        const result = await helper.getMultilingualString(text);
        const attrValue = await page.$eval(
            'xpath/' + `//body//*[text()[contains(.,'${result}')]]`, (el, attribute) =>
                el.getAttribute(attribute), attribute
        );
        if (value !== attrValue) {
            throw new Error(`The provided text "${result}" doesn't match element which attribute has value: ${value}.`);
        }
    },

    /**
     * Element should not exist in the page DOM.
     * @param page
     * @param selector
     * @param time
     * @returns {Promise<void>}
     */
    notSeeElement: async function (page, selector, time = 5000) {
        const options = {
            hidden: true,
            timeout: time, // Maximum time to wait in milliseconds (default: 30000)
        };
        let isElementInPage = false;
        try {
             isElementInPage = await page.waitForSelector(selector, options);
        } catch (error) {
            console.log(`Element disappeared.`);
        }
        if (isElementInPage) {
            throw new Error(`${selector} can be found in the page source.`)
        }
    },

    /**
     * Return the iframe to be used as a page object.
     * @param page
     * @param selector
     * @returns {Promise<Frame>}
     */
    getFrameBySelector: async function(page, selector) {
        try {
            await page.waitForSelector(selector);
            const frameHandle = await page.$(selector);
            return await frameHandle.contentFrame();

        } catch (error) {
            throw new Error(`iFrame with css selector: ${selector} cannot be found!`)
        }
    },

    /**
     * Validate visibility of text by using xpath to locate it.
     * @param page
     * @param text
     * @param time
     * @returns {Promise<void>}
     */
    seeTextByXpath: async function (page, text, time = 4000) {
        let result = await helper.getMultilingualString(text);
        const options = {
            visible: true, // Wait for the element to be visible (default: false)
            timeout: time, // Maximum time to wait in milliseconds (default: 30000)
        };
        if (time > 4000 && !page["_name"]) {
            await new Promise(function(resolve) {
                setTimeout(resolve, 500)
            });
        }
        try {
            await page.waitForSelector('xpath/' + `//body//*[text()[contains(.,"${result}")]]`, options);
        } catch (error) {
            throw new Error(`Could not find text : ${result}. The error thrown is: ${error}`);
        }
    },

    /**
     * Validate text existence in DOM using element textContent value.
     * (can't validate whether you can see it with your eyes or not)
     * @param page
     * @param selector
     * @param text
     * @returns {Promise<void>}
     */
    seeTextByElementHandle: async function (page, selector, text) {
        const result = await helper.getMultilingualString(text);
        await page.waitForSelector(selector);
        let textContent = await page.$eval(selector, (element) => element.textContent.trim());
        if (!textContent) {
            textContent = await page.$eval(selector, (element) => element.value.trim());
        }
        if (textContent !== result) {
            throw new Error(`Expected ${result} text, but found ${textContent} instead.`)
        }
    },

    /**
     * Validate that text is visible in specific region (another element).
     * To be used when multiple renders of the same text are shown on the page.
     * @param page
     * @param text
     * @param region
     * @returns {Promise<void>}
     */
    seeTextInRegion: async function (page, text, region) {
        const regionClass = await helper.getRegion(page, region);
        const result = await helper.getMultilingualString(text);
        try {
            await page.waitForSelector(
               'xpath/' + `//*[contains(@class,'${regionClass}') and .//text()[contains(.,"${result}")]]`

           );
       } catch (error) {
            throw new Error(`Cannot find ${result} in ${regionClass}!`)
       }
    },

    /**
     * Validate that the text is not rendered on the page.
     * @param page
     * @param text
     * @returns {Promise<void>}
     */
    notSeeText: async function (page, text) {
        let result = await helper.getMultilingualString(text);
        const isTextInDom = await page.$(
            'xpath/' + `//*[text()[contains(.,'${result}')]]`
        );
        // isVisible() is used for the cases where the text is in the DOM, but not visible
        // If you need to NOT have it in the DOM - use notSeeElement() or extend this step with flag
        const visibility = await isTextInDom?.isVisible();
        if (visibility) {
            throw new Error(`${text} can be found in the page source.`)
        }
    },

    /**
     * Validate text value of certain element (input, p, span etc.)
     * @param page
     * @param text
     * @param selector
     * @returns {Promise<void>}
     */
    validateTextInField: async function (page, text, selector) {
        let result = await helper.getMultilingualString(text);
        let value = '';
        await page.waitForSelector(selector);
        try {
          const el = await page.$(selector);
          const elementType = await page.evaluate(el => el.tagName, el);
          if (elementType.toLowerCase() === "input") {
              value = await (await page.evaluateHandle(el => el.value, el)).jsonValue();
          } else {
              value = await (await page.evaluateHandle(el => el.innerText, el)).jsonValue();
          }
        } catch (error) {
            throw new Error(error);
        }
        if (value !== result) {
            throw new Error(`Value of element ${value} does not match the text ${result}`)
        }
    },

    /**
     * Validate that text is actually shown/hidden on closing/opening of an accordion
     * @param page
     * @param cssSelector
     * @param text
     * @param isVisible
     * @returns {Promise<void>}
     */
    textVisibilityInAccordion: async function (page, cssSelector, text, isVisible) {
        let result = await helper.getMultilingualString(text);
        const el = await page.$(cssSelector);
        if (el) {
            const isShown = await (await page.evaluateHandle(el => el.clientHeight, el)).jsonValue();
            if (Boolean(isShown) !== isVisible) {
                throw new Error('Element visibility does not match the requirement!')
            }
            if (isShown) {
                const textValue = await (await page.evaluateHandle(el =>
                    el.textContent.trim(), el)).jsonValue();
                if (isVisible && textValue !== result) {
                    throw new Error(`Element text: ${textValue} does not match the expected: ${result}!`);
                } else if (!isVisible && textValue === result) {
                    throw new Error(`Element text: ${textValue} is visible but it should not be!`);
                }
            }
        } else if (isVisible) {
                throw new Error(`The element with ${cssSelector} is missing from the DOM tree.`);
        }
    },

    /**
     * Validate that text disappears in certain time from the page.
     * Can be used for toasts, notifications etc.
     * @param page
     * @param text
     * @param time
     * @returns {Promise<void>}
     */
    disappearText: async function (page, text, time) {
        let result = await helper.getMultilingualString(text);
        const options = {
            visible: true, // Wait for the element to be visible (default: false)
            timeout: 250, // 250ms and for that reason time is multiplied by 4 to add up to a full second.
        };
        for (let i = 0; i < time*4; i++) {
            try {
                await page.waitForSelector('xpath/' + `//*[text()[contains(.,'${result}')]]`, options);
            } catch (error) {
                console.log(`Element disappeared in ${time*4}.`);
                break;
            }
        }

    },

    /**
     * Click on an element by its text in a certain region.
     * To be used when there are multiple occurrences of that text.
     * @param page
     * @param text
     * @param region
     * @returns {Promise<void>}
     */
    clickTextInRegion: async function (page, text, region) {
        const regionClass = await helper.getRegion(page, region);
        const result = await helper.getMultilingualString(text);
        await page.waitForSelector('xpath/' + `//*[@class='${regionClass}']`);
        const elements = await page.$$('xpath/' + `//*[@class='${regionClass}']//*[text()='${result}']`)
            || await page.$$('xpath/' + `//*[@class='${regionClass}']//*[contains(text(),'${result}')]`);

        if (!elements?.[0]) {
            throw new Error("Element not found!")
        }

        await elements[0].click();
    },

    /**
     * Standard file upload into normal HTML file upload field
     * @param page
     * @param fileName
     * @param selector
     * @returns {Promise<void>}
     */
    uploadFile: async function (page, fileName, selector) {
        await page.waitForSelector(selector);
        const element = await page.$(selector);
        const filePath = config.has('filePath') ? config.get('filePath') : 'files/';
        await element.uploadFile(filePath + fileName);
    },

    /**
     * Drupal and dropzone specific file upload method.
     * @param page
     * @param fileName
     * @param selector
     * @returns {Promise<void>}
     */
    uploadToDropzone: async function (page, fileName, selector) {
        await page.waitForSelector(selector);
            try {
                const element = await page.$(selector);
                const realSelector = await (await element.getProperty("id")).jsonValue();
                const filePath = config.has('filePath') ? config.get('filePath') : 'files/';
                const fullPath = filePath + fileName;
                const mimeType = mime.getType(fullPath);
                const contents = fs.readFileSync(fullPath, {encoding: 'base64'});
                const jsCode =`
                    var url = "data:${mimeType};base64,${contents}"
                    var file;
                    fetch(url)
                    .then(response => response.blob())
                    .then(file => {
                    file.name = "${fileName}";
                    drupalSettings.dropzonejs.instances['${realSelector}'].instance.addFile(file)});`;
                await page.evaluate(jsCode);
            } catch (error) {
                throw new Error(error);
            }
    },

    /**
     * Put value in a field. It directly places the text like Ctrl+V(Paste) will do it.
     * @param page
     * @param selector
     * @param data
     * @param skip
     * @returns {Promise<boolean>}
     */
    fillField: async function (page, selector, data, skip = false) {
        let result = await helper.getMultilingualString(data);
        const skipped = await this.customWaitForSkippableElement(page, selector, skip);
        if (skipped) {
            return true;
        }
        try {
            await page.$eval(selector, (el, name) => el.value = name, result);
            await new Promise(function(resolve) {
                setTimeout(resolve, 500)
            });
        } catch (error) {
            throw new Error(error)
        }
    },

    /**
     * Simulates typing char by char in a field. Useful for fields which have some auto suggest/autocomplete logic behind it.
     * @param page
     * @param selector
     * @param text
     * @param skip
     * @returns {Promise<boolean>}
     */
    typeInField: async function (page, selector, text, skip = false ) {
        let result = await helper.getMultilingualString(text);
        const skipped = await this.customWaitForSkippableElement(page, selector, skip);
        if (skipped) {
            return true;
        }
        try {
            await page.$eval(selector, (input) => (input.value = ''));
            await page.type(selector, result, { delay: 50 });
        } catch (error) {
            throw new Error(`Cannot type into field due to ${error}`);
        }
    },

    /**
     * Check or uncheck a checkbox. Do nothing if the direction matches the current state.
     * @param page
     * @param selector
     * @param action
     * @param skip
     * @returns {Promise<boolean>}
     */
    useCheckbox: async function (page, selector, action, skip = false) {
        const skipped = await this.customWaitForSkippableElement(page, selector, skip);
        if (skipped) {
            return true;
        }
        const element = await page.$(selector);
        const checked = await (await element.getProperty("checked")).jsonValue();
        if (!checked && action === "select" || checked && action === "deselect" ) {
            element.click();
        } else if (checked && action === "select" || !checked && action === "deselect") {
            // Exit successfully when the requested action matches the current state
            return true;
        } else {
            throw new Error(`Action: ${action} does not fit the current state of the checkbox!`);
        }
    },

    /**
     * Write into CkEditor5 using its API.
     * @param page
     * @param selector
     * @param text
     * @returns {Promise<*>}
     */
    writeInCkEditor5: async function (page, selector, text) {
        const textValue = text === "noText" ? "" : text;
        const options = {hidden:true};
        await page.waitForSelector(selector, options);
        try {
            const elementId = await page.$eval(selector, el => el.getAttribute('data-ckeditor5-id'));
            let jsCode = `
            (function () {
                let textEditor = Drupal.CKEditor5Instances.get('${elementId}');
                textEditor.setData('');
                const docFrag = textEditor.model.change(writer => {
                        const p1 = writer.createElement('paragraph');
                        const docFrag = writer.createDocumentFragment();
                        writer.append(p1, docFrag);
                        writer.insertText('${textValue}', p1);
                        return docFrag;
                    }
                );
                textEditor.model.insertContent(docFrag);
            })();
            `;
            return await page.evaluate(jsCode);
        }
        catch (error) {
            throw new Error(`Cannot write into CkEditor5 field due to: ${error}!`);
        }
    },

    /**
     * Selects option by its html value.
     * The method supports the skip property.
     * @param page
     * @param selector
     * @param value
     * @param skip
     * @returns {Promise<boolean|void>}
     */
    selectOptionByValue: async function (page, selector, value, skip = false) {
        const skipped = await this.customWaitForSkippableElement(page, selector, skip);
        if (skipped) {
            return true;
        }
        const selectedValue = await page.select(selector, value);
        if (selectedValue.length === 0) {
            throw new Error(`The option ${value} is either missing or not selected!`)
        }
    },

    /**
     * Selects option by its text value
     * @param page
     * @param selector
     * @param text
     * @returns {Promise<void>}
     */
    selectOptionByText: async function (page, selector, text) {
        let result = await helper.getMultilingualString(text);
        await page.waitForSelector(selector);
        const objectToSelect = await page.$(
            'xpath/' + `//body//*[contains(text(), '${result}')]`
        );
        if (objectToSelect) {
            const value = await (await objectToSelect.getProperty('value')).jsonValue();
            await page.select(selector, value);
        } else {
            throw new Error(`Could not find option with text: ${result}`);
        }
    },

    /**
     * Selects the first autocomplete option using the keyboard keys
     * from a dropdown with auto-suggest.
     * @param page
     * @param text
     * @param selector
     * @returns {Promise<void>}
     */
    selectOptionFirstAutocomplete: async function (page, text, selector) {
        await page.waitForSelector(selector);
        await page.type(selector, text, { delay: 50 });
        await new Promise(function(resolve) {
            setTimeout(resolve, 1000)
        });
        const el = await page.$(selector);
        await el.focus();
        await page.keyboard.press('ArrowDown',{ delay:100 });
        await helper.waitForAjax(page);
        await new Promise(function(resolve) {
            setTimeout(resolve, 1000)
        });
        await page.keyboard.press('Enter', { delay:100 });
    },

    /**
     * Selects option from a dropdown using chosen JS field.
     * @param page
     * @param string
     * @param selector
     * @returns {Promise<void>}
     */
    selectOptionFromChosen: async function (page, string, selector) {
        await page.waitForSelector(selector);
        const options = await page.$eval(selector, select => {
            return Array.from(select.options).map(option => ({
                value: option.value,
                text: option.text
            }));
        });
        const result = options.find(({ text }) => text === string);
        const jsCode = `
            jQuery('${selector}').val("${result.value}");
            jQuery('${selector}').trigger("chosen:updated");
            jQuery('${selector}').trigger("change");
        `;
        await page.evaluate(jsCode);

    },

    /**
     * Method to verify if a dropdown text values are in alphabetical order
     *
     * @param {Object} page
     * @param {string} selector
     * @param {boolean} flag
     * @returns {Promise<void>}
     */
    iCheckIfDropdownOptionsAreInAlphabeticalOrder: async function (page, selector, flag) {
        await page.waitForSelector(selector);
        const options = await page.$eval(selector, select => {
            return Array.from(select.options).map(option => ({
                value: option.value,
                text: option.text
            }));
        });

        // Remove fist element if it's none (can be extended for other placeholders)
        if (options[0].value === "_none") {
            options.shift();
        }

        const isArraySorted = helper.isArraySorted(options, 'text');

        if ( Boolean(isArraySorted) !== flag ) {
            throw new Error(`Dropdown options are not sorted as expected`);
        }
    },

    /**
     * Method to verify if the checkbox text values are in alphabetical order
     *
     * @param {Object} page
     * @param {string} selector
     * @param {boolean} flag
     * @returns {Promise<void>}
     */
    iCheckIfCheckboxOptionsAreInAlphabeticalOrder: async function (page, selector, flag){
        await page.waitForSelector(selector);
        const elements = await page.$$(selector);

        const texts = await Promise.all(elements.map(async element => {
            const propertyHandle = await element.getProperty('textContent');
            return await propertyHandle.jsonValue();
        }));

        const isArraySorted = helper.isArraySorted(texts, 0);

        if ( Boolean(isArraySorted) !== flag ) {
            throw new Error(`The checkboxes are not sorted as expected`);
        }
    },

    /**
     * Sets date in a https://flatpickr.js.org/ based field.
     * @param page
     * @param selector
     * @param value
     * @returns {Promise<void>}
     */
    setDateFlatpickr: async function (page, selector, value) {
        await page.waitForSelector(selector);
        try {
            await page.$eval(selector, (el, date) => el._flatpickr.setDate(`${date}`, true), value);
        } catch (error) {
            throw new Error(`Cannot set date due to ${error}!`)
        }
    },

    /**
     * Scrolls element to the top of the page using cssSelector
     * @param page
     * @param cssSelector
     * @returns {Promise<void>}
     */
    scrollElementToTop: async function (page, cssSelector) {
        await page.waitForSelector(cssSelector)
        try {
            const el = await page.$(cssSelector);
            await page.evaluate(el => el.scrollIntoView(true), el);
        }
        catch (error) {
            throw new Error(error);
        }
    },

    /**
     * Sets value into codemirror field
     * @param page
     * @param cssSelector
     * @param value
     * @returns {Promise<void>}
     */
    setValueInCodeMirrorField: async function (page, cssSelector, value) {
        let result = await helper.getMultilingualString(value);
        await page.waitForSelector(cssSelector)
        try {
            const jsCode = `
            (function () {
                const textArea = document.querySelector('${cssSelector}');
                let editor = CodeMirror.fromTextArea(textArea);
                editor.getDoc().setValue("${result}");
            })();
            `;
            await page.evaluate(jsCode);
        }
        catch (error) {
            throw new Error(error);
        }
    },
}