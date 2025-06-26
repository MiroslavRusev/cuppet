@example-dev
 Feature: Open DEMO QA (as base site) run performance tests
  
  Scenario: Light house performance test
    Given I go to "/"
    Then I save the path of the current page
    And I generate lighthouse report for the saved page

