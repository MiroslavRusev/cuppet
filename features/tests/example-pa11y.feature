@example-dev
 Feature: Open DEMO QA (as base site) run accessibility tests

  Scenario: Pa11y accessibility test
    Given I go to "/"
    Then I save the path of the current page
    And I validate the saved page accessibility

  Scenario: Backstop visual test 
    And I generate reference screenshot for "https://demoqa.com/elements"
    Then I compare "https://demoqa.com/elements" to reference screenshot