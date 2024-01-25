const storage = require("../src/dataStorage");
const utils = require("../src/elementInteraction");
const config = require("config");
module.exports = {

    /**
     * Click on fav job icon in BlueX
     * @param page
     * @param jobId
     * @returns {Promise<void>}
     */
    favJob: async function (page, jobId) {
        const favJob = storage.getVariable(jobId);
        let jobSelector = `#fav-${favJob}`;
        await utils.click(page, jobSelector)
    },

    setLocalStorageApac: async function (page) {
        const script = `localStorage.setItem('li_ignored', '[{"id":3083138,"time":1648039138519}]');`;
        await page.evaluate(script);
    },

    prepareReCaptcha: async function () {
        const reCaptchaSecret = await config.get("reCaptchaSecret");
        const countryCode = await config.get("countryCode");
        let app = 'search';
        if (config.has("useFormsAppEndpoint")) {
            app = 'form'
        }
        return `/api/${app}/generate-behat-recaptcha-cookie?OpCo=${countryCode}&secret=${reCaptchaSecret}`;
    },

    goToApplyPage: async function (jobId) {
        const savedId = storage.getVariable(jobId);
        const countryCode = config.get("countryCode");
        let url = ''
        if (countryCode.toString() === 'de' ) {
            url = `/jobs/${savedId}/bewerben/`;
        } else if (countryCode.toString() === 'at') {
            url = `/jobs/bewerben/${savedId}`;
        } else {
            url = `/jobs/apply/${savedId}`;
        }
        return url;
    },

    selectBlogSpecialism: async function (page, specialism, cssSelector) {
        if (config.has("hasSpecialism")) {
            const hasSpecialism = config.get("hasSpecialism");
            if (hasSpecialism) {
                await utils.selectOptionFromChosen(page, specialism, cssSelector);
            } 
         } else {
            throw new Error("The 'hasSpecialism' param not set in the config file for this opco.");
        }
    },
}