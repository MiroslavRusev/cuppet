@example-dev
 Feature: Open DEMO QA and run visual tests

  Scenario: Backstop visual test 
    And I generate reference screenshot for "https://demoqa.com/elements"
    Then I compare "https://demoqa.com/elements" to reference screenshot