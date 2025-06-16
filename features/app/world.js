const { setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');
const commonFields = require('./commonComponents/commonFields');

setDefaultTimeout(120 * 1000);

//attach: function used for adding attachments to hooks/steps
class World {
    constructor({ attach }) {
        this.attach = attach;
        this.commonFields = commonFields;
    }

    fixSonar() {
        console.log('Sample function to fix empty class.');
    }
}
setWorldConstructor(World);
