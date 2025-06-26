@example-dev
 Feature: Open DEMO QA (as base site) run visual tests

  Scenario: Backstop visual test 
    And I generate reference screenshot for "https://demoqa.com/elements"
    Then I compare "https://demoqa.com/elements" to reference screenshot