# Cuppet Core - Configuration & Step Definitions Guide

## Table of Contents

1. [Configuration Options](#configuration-options)
2. [Step Definitions Overview](#step-definitions-overview)
3. [Environment Configuration](#environment-configuration)
4. [Example Configurations](#example-configurations)

## Configuration Options

The Cuppet Core framework uses the [config](https://www.npmjs.com/package/config) module for configuration management, supporting multiple environments and configuration overrides. Below are all available configuration properties that can be used in your JSON configuration files:

### Core Application Configuration

#### `jsonFilePath` (string)

- **Purpose**: Path to the JSON file where test data will be stored during test execution
- **Default**: `"jsonFiles/example.json"`
- **Used by**: Data storage operations, variable management
- **Example**: `"jsonFiles/test-data.json"`

#### `screenshotsPath` (string)

- **Purpose**: Directory path where screenshots will be saved when tests fail
- **Default**: `"screenshots/"`
- **Used by**: Test failure handling, screenshot capture
- **Example**: `"screenshots/failed-tests/"`

#### `filePath` (string, optional)

- **Purpose**: Base directory path for file uploads in tests
- **Default**: `"files/"` (if not configured)
- **Used by**: File upload step definitions, attachment handling
- **Example**: `"test-files/uploads/"`

#### `language` (string, optional)

- **Purpose**: Language setting for multilingual test support
- **Default**: `"en"`
- **Used by**: Multilingual string resolution in step definitions
- **Example**: `"fr"`, `"de"`, `"es"`

### Browser Configuration

#### `browserOptions` (object)

- **Purpose**: Puppeteer browser configuration options

##### `browserOptions.args` (array)

- **Purpose**: Command-line arguments passed to the browser
- **Used by**: Browser initialization, visual regression testing
- **Example**:

```json
{
    "args": [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--proxy-server='direct://'",
        "--proxy-bypass-list=*",
        "--headless=new"
    ]
}
```

##### `browserOptions.viewport` (object)

- **Purpose**: Viewport configurations for different screen sizes
- **Used by**: Browser setup, visual regression testing
- **Properties**:
    - `default`: Default viewport size (used in browser initialization)
    - `MacBook`: MacBook screen dimensions
    - `laptop`: Laptop screen dimensions
    - `tablet`: Tablet screen dimensions
    - `mobile`: Mobile screen dimensions
    - `backstop`: BackstopJS visual regression testing viewport

**Example**:

```json
{
    "viewport": {
        "default": { "width": 1920, "height": 1080 },
        "MacBook": { "width": 1440, "height": 900 },
        "laptop": { "width": 1280, "height": 720 },
        "tablet": { "width": 768, "height": 1024 },
        "mobile": { "width": 320, "height": 667 },
        "backstop": { "width": 1600, "height": 900 }
    }
}
```

### Authentication Configuration

#### `credentials` (object)

- **Purpose**: Main application credentials and base URL

##### `credentials.baseUrl` (string)

- **Purpose**: Base URL for the application under test
- **Used by**: URL preparation, navigation steps, API base URL fallback
- **Example**: `"https://demoqa.com/"`

##### `credentials.username` (string, optional)

- **Purpose**: Username for automated login
- **Used by**: Login step definitions
- **Example**: `"testuser@example.com"`

##### `credentials.password` (string, optional)

- **Purpose**: Password for automated login
- **Used by**: Login step definitions
- **Example**: `"SecurePassword123"`

#### `basicAuth` (object, optional)

- **Purpose**: HTTP Basic Authentication credentials

##### `basicAuth.authUser` (string)

- **Purpose**: Username for HTTP Basic Auth
- **Used by**: Browser authentication, API fallback authentication
- **Example**: `"basicuser"`

##### `basicAuth.authPass` (string)

- **Purpose**: Password for HTTP Basic Auth
- **Used by**: Browser authentication, API fallback authentication
- **Example**: `"basicpass"`

### API Testing Configuration

#### `api` (object, optional)

- **Purpose**: Configuration for API testing capabilities

##### `api.baseApiUrl` (string, optional)

- **Purpose**: Base URL for API endpoints
- **Used by**: API step definitions, request URL preparation
- **Example**: `"https://api.example.com/v1/"`

##### `api.x-api-key` (string, optional)

- **Purpose**: API key for X-Api-Key header authentication
- **Used by**: API request authentication
- **Example**: `"your-api-key-here"`

##### `api.Authorization` (string, optional)

- **Purpose**: Authorization header value for API requests
- **Used by**: API request authentication
- **Example**: `"Bearer your-token-here"`

##### `api.authUser` (string, optional)

- **Purpose**: Username for API Basic Authentication
- **Used by**: API request authentication (takes precedence over basicAuth)
- **Example**: `"apiuser"`

##### `api.authPass` (string, optional)

- **Purpose**: Password for API Basic Authentication
- **Used by**: API request authentication (takes precedence over basicAuth)
- **Example**: `"apipassword"`

### Mobile Testing Configuration

#### `appiumCapabilities` (object)

- **Purpose**: Appium capabilities for mobile testing
- **Used by**: Mobile step definitions, Appium session management
- **Example**:

```json
{
    "platformName": "Android",
    "appium:automationName": "UiAutomator2",
    "appium:deviceName": "Android",
    "appium:disableIdLocatorAutocompletion": true,
    "appium:appPackage": "com.android.settings",
    "appium:appActivity": ".Settings"
}
```

### UI Testing Configuration

#### `regionMap` (object, optional)

- **Purpose**: Mapping of region names to CSS selectors for page regions
- **Used by**: Region-specific step definitions, element interaction within regions
- **Example**:

```json
{
    "ExampleRegion": ".valid-css-selector",
    "Cards": ".category-cards",
    "Header": ".site-header",
    "Footer": ".site-footer"
}
```

#### `blockingCookie` (string, optional)

- **Purpose**: CSS selector for cookie consent button to auto-click
- **Used by**: Automatic cookie consent handling during page visits
- **Example**: `".cookie-consent-accept"`

### Accessibility Testing Configuration

#### `pa11yConfig` (object, optional)

- **Purpose**: Configuration for Pa11y accessibility testing
- **Used by**: Accessibility step definitions, Pa11y test execution
- **Properties**:
    - `hideElements`: CSS selector for elements to hide during testing
    - `standard`: Accessibility standard to test against
    - `runners`: Array of accessibility testing runners

**Example**:

```json
{
    "hideElements": ".elementSelector",
    "standard": "WCAG2AA",
    "runners": ["axe", "htmlcs"]
}
```

### Conditional Testing Configuration

#### `skipSteps` (string, optional)

- **Purpose**: Text value to conditionally skip certain test steps
- **Used by**: Conditional step definitions (if visible steps)
- **Example**: `"Skip this step in staging"`

#### `trimRegex` (string, optional)

- **Purpose**: Custom regex pattern for trimming variable values
- **Used by**: Variable processing in data storage
- **Default**: `/[?&@$#:,;]/`
- **Example**: `"[?&@$#:,;|]"`

### Dynamic Configuration Properties

The framework also supports dynamic configuration properties that can be accessed using the step definitions:

- Any custom property can be added and accessed via `config.get('propertyName')`
- Configuration values can be used in step definitions with phrases like "from config"
- Email variables and other dynamic values can be stored and retrieved

## Step Definitions Overview

The Cuppet Core framework provides comprehensive step definitions organized into modules for different testing capabilities:

### 1. General Steps (`generalSteps.js`)

- **Purpose**: Core navigation and authentication steps
- **Key Features**:
    - Page navigation (`I visit "/path"`)
    - Login functionality (`I log in`)
    - Custom login with credentials (`I log in as "username" "password"`)
    - Saved path navigation

### 2. Page Elements (`pageElements.js`)

- **Purpose**: Core UI interaction and validation steps
- **Key Features**:
    - Element visibility checks (`I should see "text"`)
    - Click interactions (`I click on the element "selector"`)
    - Text-based interactions (`I click on the text "text"`)
    - Region-specific operations (`I should see "text" in "region" region`)
    - Form validation (`I should see "value" in "field"`)
    - Element existence validation

### 3. Page Elements with Config (`pageElementsConfig.js`)

- **Purpose**: Configuration-driven element interactions
- **Key Features**:
    - Configuration-based text clicking (`I click on the text "configKey" from config`)
    - Configuration value validation (`I check if "configKey" from config contains "value"`)
    - Dynamic configuration access in steps

### 4. Page Elements with JSON (`pageElementsJson.js`)

- **Purpose**: JSON data-driven element interactions
- **Key Features**:
    - JSON variable display (`I should see "variable" from json in element "selector"`)
    - JSON variable input (`I fill in "field" with "variable" variable from JSON`)
    - JSON data validation in regions
    - JSON stringify operations

### 5. Conditional Steps (`ifVisibleSteps.js`)

- **Purpose**: Conditional operations based on element visibility
- **Key Features**:
    - Conditional text verification (`I should see "text" if visible`)
    - Conditional clicking (`I click on the element "selector" if visible`)
    - Conditional form filling (`I fill in "field" with "value" if visible`)
    - Skip functionality based on configuration

### 6. API Steps (`apiSteps.js`)

- **Purpose**: RESTful API testing capabilities
- **Key Features**:
    - HTTP method testing (`I send a "GET" request to "/endpoint"`)
    - Response validation (`the response code should be "200"`)
    - JSON response validation (`the property "name" should be an "string"`)
    - Request body preparation (`I have request body`)
    - Variable storage from responses (`I store "property" to "variable" variable`)
    - XML validation (`I validate that the page is a valid XML`)

### 7. Helper Steps (`helperSteps.js`)

- **Purpose**: Utility functions and data management
- **Key Features**:
    - Path saving (`I save the path of the current page`)
    - Configuration to JSON storage (`I store "configKey" from config to "variable" in JSON`)
    - Entity ID extraction (`I store the entity id with variable name "variable"`)
    - Element value storage (`I store the value from the element "selector" in "variable"`)
    - Variable manipulation and validation

### 8. Mobile Steps (`appiumSteps.js`)

- **Purpose**: Mobile application testing with Appium
- **Key Features**:
    - App navigation (`I go to "package" app package and "activity" activity`)
    - Mobile element interaction (`I click on the element "selector" on mobile`)
    - Mobile scrolling (`I scroll to the element "selector" on mobile`)

### 9. Accessibility Steps (`accessibilitySteps.js`)

- **Purpose**: Web accessibility testing with Pa11y
- **Key Features**:
    - Current page accessibility validation (`I validate the saved page accessibility`)
    - Specific page accessibility testing (`I validate the accessibility of the "/path" page`)
    - Automated HTML report generation

### 10. Performance Steps (`lighthouseSteps.js`)

- **Purpose**: Performance testing with Google Lighthouse
- **Key Features**:
    - Current page performance testing (`I generate lighthouse report for the saved page`)
    - Specific page performance testing (`I generate lighthouse report for "/path" page`)
    - Automated performance report generation

### 11. Visual Regression Steps (`visualRegressionSteps.js`)

- **Purpose**: Visual regression testing with BackstopJS
- **Key Features**:
    - Reference screenshot generation (`I generate reference screenshot for "/path"`)
    - Visual comparison testing (`I compare "/path" to reference screenshot`)
    - Multiple page testing (`I generate reference screenshot for multiple pages`)
    - Batch visual testing (`I compare multiple pages to their references`)

### 12. Iframe Steps (`iframeSteps.js`)

- **Purpose**: Iframe-specific testing operations
- **Key Features**:
    - Iframe content validation (`I should see "text" in iframe "selector"`)
    - Iframe element interaction (`I click on element "selector" in iframe "frameSelector"`)
    - Iframe text interaction (`I click on the text "text" in iframe "frameSelector"`)
    - Iframe form operations (`I type "text" in "field" field in iframe "frameSelector"`)

## Environment Configuration

The framework supports multiple configuration environments using the `NODE_CONFIG_ENV` environment variable. You can create environment-specific configuration files like:

- `config/default.json` - Default configuration
- `config/development.json` - Development environment overrides
- `config/staging.json` - Staging environment overrides
- `config/production.json` - Production environment overrides

Environment-specific files will merge with and override the default configuration.

## Example Configurations

### Basic Web Testing Configuration

```json
{
    "jsonFilePath": "jsonFiles/test-data.json",
    "screenshotsPath": "screenshots/",
    "credentials": {
        "baseUrl": "https://example.com/",
        "username": "testuser",
        "password": "testpass"
    },
    "browserOptions": {
        "args": ["--no-sandbox", "--headless=new"],
        "viewport": {
            "default": { "width": 1920, "height": 1080 }
        }
    },
    "regionMap": {
        "MainContent": ".main-content",
        "Navigation": ".navbar"
    },
    "blockingCookie": ".cookie-accept"
}
```

### API Testing Configuration

```json
{
    "jsonFilePath": "jsonFiles/api-data.json",
    "credentials": {
        "baseUrl": "https://frontend.example.com/"
    },
    "api": {
        "baseApiUrl": "https://api.example.com/v1/",
        "x-api-key": "your-api-key-here"
    },
    "basicAuth": {
        "authUser": "user",
        "authPass": "pass"
    }
}
```

### Mobile Testing Configuration

```json
{
    "jsonFilePath": "jsonFiles/mobile-data.json",
    "screenshotsPath": "screenshots/mobile/",
    "appiumCapabilities": {
        "platformName": "Android",
        "appium:automationName": "UiAutomator2",
        "appium:deviceName": "Android",
        "appium:app": "/path/to/your/app.apk"
    }
}
```

### Accessibility & Performance Testing Configuration

```json
{
    "jsonFilePath": "jsonFiles/test-data.json",
    "credentials": {
        "baseUrl": "https://example.com/"
    },
    "browserOptions": {
        "args": ["--no-sandbox"],
        "viewport": {
            "default": { "width": 1920, "height": 1080 },
            "backstop": { "width": 1600, "height": 900 }
        }
    },
    "pa11yConfig": {
        "hideElements": ".ads, .tracking",
        "standard": "WCAG2AA",
        "runners": ["axe", "htmlcs"]
    }
}
```

### Complete Configuration Example

```json
{
    "jsonFilePath": "jsonFiles/complete-test-data.json",
    "screenshotsPath": "screenshots/",
    "filePath": "files/",
    "language": "en",
    "credentials": {
        "baseUrl": "https://example.com/",
        "username": "testuser",
        "password": "testpass"
    },
    "browserOptions": {
        "args": ["--no-sandbox", "--disable-setuid-sandbox", "--headless=new"],
        "viewport": {
            "default": { "width": 1920, "height": 1080 },
            "mobile": { "width": 375, "height": 667 },
            "backstop": { "width": 1600, "height": 900 }
        }
    },
    "api": {
        "baseApiUrl": "https://api.example.com/v1/",
        "x-api-key": "your-api-key-here"
    },
    "appiumCapabilities": {
        "platformName": "Android",
        "appium:automationName": "UiAutomator2",
        "appium:deviceName": "Android"
    },
    "regionMap": {
        "Header": ".site-header",
        "MainContent": ".main-content",
        "Footer": ".site-footer"
    },
    "basicAuth": {
        "authUser": "user",
        "authPass": "pass"
    },
    "blockingCookie": ".cookie-accept",
    "pa11yConfig": {
        "hideElements": ".ads",
        "standard": "WCAG2AA",
        "runners": ["axe"]
    },
    "skipSteps": "Skip in CI",
    "trimRegex": "[?&@$#:,;]"
}
```

This configuration system provides maximum flexibility for different testing environments and scenarios while maintaining clean separation of test logic and configuration data. The comprehensive step definitions enable testing across web, mobile, API, accessibility, performance, and visual regression scenarios all within a single framework.
