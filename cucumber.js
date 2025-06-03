const os = require('os');
let [nodeEnv, nodeConfigDir] = process.argv.slice(2);
if (process.env.npm_lifecycle_event === 'debug') {
    [nodeEnv, nodeConfigDir] = process.argv.slice(4);
}
if (!nodeEnv || !nodeConfigDir) {
    throw new Error('You have not provided a valid config profile or directory!');
}
process.env.NODE_CONFIG_ENV = nodeEnv;
if (os.platform() === 'win32') {
    process.env.NODE_CONFIG_DIR = `./config;./config/${nodeConfigDir}`;
} else {
    process.env.NODE_CONFIG_DIR = `./config:./config/${nodeConfigDir}`;
}
const config = require('config');
const { DEFAULT_THEME } = require('@cucumber/pretty-formatter');

module.exports = {
    default: {
        format: [`html:reports/${nodeEnv}/${nodeEnv}-report.html`],
        formatOptions: {
            theme: {
                ...DEFAULT_THEME,
                'step text': ['green'],
                'step keyword': ['red'],
                'scenario name': ['white'],
                'scenario keyword': ['bold'],
                'feature keyword': ['bold'],
                'feature name': ['white'],
                location: ['italic'],
            },
            colorsEnabled: true,
        },
        tags: config.get('tags'),
    },
};
