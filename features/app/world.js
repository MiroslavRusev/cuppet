const { setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(120 * 1000);

//attach: function used for adding attachments to hooks/steps
class World {
    constructor({ attach }) {
        this.attach = attach;
    }

    fixSonar() {
        console.log('Sample function to fix empty class.');
    }
}
setWorldConstructor(World);