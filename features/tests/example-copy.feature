@appium
Feature: Click elements on mobile device
  Scenario: Open settings page and click on a specific setting
    Given I go to "com.android.settings" app package and activity ".Settings"
    Then I click on the element "#currentAddress" on mobile