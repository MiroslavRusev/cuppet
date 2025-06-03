const config = require('config');
const backStop = require('backstopjs');
const backStopConfig = require('../backStopData/backStopConfig.json');

module.exports = {
    /**
     *
     * @returns {Object} - the backstop configuration object
     */
    backstopConfigPrepare: function () {
        let newConfig = backStopConfig;
        newConfig.id = process.env.NODE_CONFIG_ENV;
        newConfig.viewports[0].width = Number(config.get('viewport.width'));
        newConfig.viewports[0].height = Number(config.get('viewport.height'));
        newConfig.engineOptions.args = config.get('args');
        return newConfig;
    },

    /**
     *
     * @param command
     * @param configObject
     * @returns {Promise<void>}
     */
    runBackStop: async function (command, configObject) {
        await backStop(command, { config: configObject })
            .then(() => {
                console.log(`${command} backstop run executed successfully!`);
                // test successful
            })
            .catch((error) => {
                throw new Error(error);
            });
    },

    /**
     *
     * @param scenarioName
     * @param path
     * @param testCommand
     * @returns {Promise<void>}
     */
    runBackStopSingleScenario: async function (scenarioName, path, testCommand) {
        const newConfig = this.backstopConfigPrepare();
        newConfig.scenarios[0].label = scenarioName;
        newConfig.scenarios[0].url = path;
        await this.runBackStop(testCommand, newConfig);
    },
    /**
     *
     * @param pages
     * @param testCommand
     * @returns {Promise<void>}
     */
    runBackstopMultiplePages: async function (pages, testCommand) {
        const newConfig = this.backstopConfigPrepare();
        newConfig.scenarios = [];
        pages.forEach((page) => {
            newConfig.scenarios.push({
                label: page.label,
                url: page.url,
                // Add other scenario properties as needed...
            });
        });
        await this.runBackStop(testCommand, newConfig);
    },
};
