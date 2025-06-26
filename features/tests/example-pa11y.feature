@example-dev
 Feature: Open DEMO QA (as base site) run accessibility tests

  Scenario: Pa11y accessibility test
    Given I go to "/"
    Then I save the path of the current page
    And I validate the saved page accessibility