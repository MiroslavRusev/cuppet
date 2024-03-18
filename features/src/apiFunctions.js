const axios = require("axios");
const config = require("config");
const storage = require("./dataStorage");
const xml2js = require('xml2js');
const assert = require("chai").assert;
const expect = require('chai').expect;

module.exports = {

    /** @type {object} */
    response: null,
    /** @type {object} */
    request:null,

    /**
     * Prepare path for API test usage
     * @param url - It can be absolute/relative path or even placeholder for saved variable
     * @returns {Promise<*>} - Returns a working path
     */
    prepareUrl: async function (url) {
        const path = await storage.checkForMultipleVariables(url);
        if (!path.startsWith('http') && config.has("api.baseApiUrl")) {
            return config.get("api.baseApiUrl") + path;
        }
        return path;
    },

    /**
     * Function used to generate the needed headers for each request
     * @async
     * @function setHeaders
     * @param headers
     * @param {boolean} defaultHeadersFlag
      * @returns {Promise<Object>} - Returns an object with the headers
     */
    setHeaders: async function (headers = {}, defaultHeadersFlag = false) {

        if(!defaultHeadersFlag) {
            return headers;
        }

        let defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        if (config.has('api.x-api-key')) {
            defaultHeaders['X-Api-Key'] = config.get('api.x-api-key');
        }
        if (config.has('api.Authorization')) {
            defaultHeaders['X-Api-Key'] = config.get('api.Authorization');
        }
        if (headers && defaultHeaders) {
            defaultHeaders = {
                ...defaultHeaders,
                ...headers
            }
        }
        return defaultHeaders;
    },

    /**
     * Prepare and set the basic auth (if needed).
     * This method supports if the API and the website have different basic auth.
     * @async
     * @function setHeaders
     * @returns {Promise<{Object}>}
     */
    setBasicAuth: async function () {
        let basicAuth = {};
        if (config.has('api.authUser')) {
            basicAuth = {
                username: config.get('api.authUser'),
                password: config.get('api.authPass')
            }
        } else if (config.has('basicAuth.authUser')) {
            basicAuth = {
                username: config.get('basicAuth.authUser'),
                password: config.get('basicAuth.authPass')
            }
        }
        return basicAuth;
    },

    /**
     * Sends an HTTP request using axios.
     *
     * @async
     * @function sendRequest
     * @param {string} method - The HTTP method to use for the request.
     * @param {string} [url="/"] - The URL to send the request to. Defaults to "/".
     * @param {Object} [headers={}] - An object containing HTTP headers to include with the request. Defaults to an empty object.
     * @param {Object} [data={}] - An object containing data to send in the body of the request. Defaults to an empty object.
     * @returns {Promise<Object>} Returns a Promise that resolves to the response from the server.
     * @throws {Error} Throws an error if the request fails.
     */
    sendRequest: async function (
        method,
        url = "/",
        headers = {},
        data = {}
    ) {
        const apiUrl = await this.prepareUrl(url);
        const requestHeaders = await this.setHeaders(headers, true);
        const auth = await this.setBasicAuth();
        if (this.request) {
            data = this.request;
        }
        try {
            this.response = await axios.request({
                url: apiUrl,
                method: method.toLowerCase(),
                ...(Object.keys(auth).length && {auth}),
                // The data is conditionally added to the request, because it's not used with GET requests and creates conflict.
                // The following checks if data object is not empty, returns data object if not empty or skip if empty.
                ...(Object.keys(data).length && {data}),
                headers: requestHeaders,
            })
            return this.response;
        } catch (error) {
            throw new Error(`Request failed with: ${error}`)
        }
    },

    /**
     * Replace placeholders of type %var% and prepare request body
     * @async
     * @function prepareRequestBody
     * @param body - the request body needs to be passed in string format
     * @returns {Promise<Object>} - returns the request body object
     */
    prepareRequestBody: async function (body) {
        const preparedBody = await storage.checkForMultipleVariables(body);
        this.request = JSON.parse(preparedBody);
        return this.request;
    },

    /**
     * Put values in request 1 by 1
     * Example object: {
     *     property: value
     * }
     * @async
     * @function prepareRequestBody
     * @param value - the value of the new property
     * @param property - the name of the property
     * @param object - parent object name
     * @returns {Promise<Object>} - returns the request body object
     */
    iPutValuesInRequestBody: async function (value, property, object) {
        const preparedValue = await storage.checkForVariable(value);
        if (!this.request) {
              this.request = {}
        }
        this.request[object][property] = preparedValue;
        return this.request;
    },

    /**
     * This step is used to validate the status code of the response
     * @param code
     * @returns {Promise<void>}
     */
    validateResponseCode: async function (code) {
        if (this.response.status !== Number(code)) {
            throw new Error(`Response code is different than expected, code: ${this.response.status}`)
        }
    },

    /**
     * Use this step whether the response is of type array or object
     * @param type
     * @returns {Promise<void>}
     */
    validateResponseType: async function (type) {
        await assert.typeOf(this.response.data, type, `Response is not an ${type}`);
    },

    /**
     * Asynchronously checks if a property of the response data is of a specified type.
     *
     * @async
     * @function propertyIs
     * @param {string} property - The property of the response data to check.
     * @param {string} type - The type that the property should be.
     * @throws {Error} - Will throw an error if the property is not of the specified type.
     */
    propertyIs: async function (property, type) {
        const value = this.response.data[property];
        await assert.typeOf(value, type, `The property is not an ${type}`);
    },

    /**
     * Validate value of property from the http response.
     * @param property
     * @param expectedValue
     * @returns {Promise<void>}
     */
    propertyHasValue: async function (property, expectedValue) {
        const actualValue = await this.getPropertyValue(property);
        assert.strictEqual(actualValue, expectedValue, `Property "${property}" does not have the expected value`);
    },    

    /**
     * @async
     * @function iRememberVariable
     * @param property - the name of the JSON property, written in root.parent.child syntax
     * @param variable - the name of the variable to which it will be stored
     * @throws {Error} - if no property is found in the response data
     * @returns {Promise<void>}
     */
    iRememberVariable: async function (property, variable) {
        const propValue = await this.getPropertyValue(property);
        await storage.iStoreVariableWithValueToTheJsonFile(propValue, variable)
    },

    /**
     * Go through the response object and return the value of specific property
     * @param property - name of the property. For nested structure use -> parent.child1.child2 etc.
     * @returns {Promise<*>}
     */
    getPropertyValue: async function (property) {
        const response = this.response.data;
        const keys = property.split(".");
        let value = response;
        for (let key of keys) {
            value = value[key];
        }
        if (!value) {
            throw new Error(`Value with property: ${property} is not found!`)
        }
        return value;
    },

    /**
     * Load custom json file and make a request body from it
     * @param path
     * @returns {Promise<Object>}
     */
    createRequestBodyFromFile: async function (path) {
        this.request = storage.getJsonFile(path);
        return this.request;
    },

    /**
     * Send request to an endpoint and validate whether the response is valid xml.
     * @param url
     * @returns {Promise<void>}
     */
    validateXMLEndpoint: async function(url) {
        const xmlUrl = await this.prepareUrl(url);
        let response;
        try {
            const auth = await this.setBasicAuth();
            response = await axios.request({
                url: xmlUrl,
                method: 'get',
                ...(Object.keys(auth).length && {auth}),
            })
        } catch (error) {
            throw new Error(`Request failed with: ${error}`)
        }

        const isValid =  await xml2js.parseStringPromise(response.data);
        if(!isValid) {
            throw new Error("XML is not valid!")
        }
    },

    /**
     *
     * @param {string} method - method - GET,POST, PUT etc.
     * @param {string} currentUrl - url of the page/endpoint
     * @param {object} reqHeaders - request headers
     * @param {string} resHeaders - response headers
     * @param {boolean} flag - direction of presence (true/false)
     * @returns {Promise<void>}
     */
    validateResponseHeader: async function(
        method,
        currentUrl,
        reqHeaders,
        resHeaders,
        flag
    ) {
        const prepareUrl = await this.prepareUrl(currentUrl);
        const requestHeaders = await this.setHeaders(reqHeaders);
        const auth = await this.setBasicAuth();
        let response;
        try {
            response = await axios.request({
                url: prepareUrl,
                method: method,
                ...(Object.keys(auth).length && {auth}),
                headers: requestHeaders,
            })
        } catch (error) {
            throw new Error(`Request failed with: ${error}`)
        }
        const hasProperty = response.headers.hasOwnProperty(resHeaders.toLowerCase());
        if (hasProperty !== flag) {
            throw new Error("The response headers are different than expected!")
        }
    }

}