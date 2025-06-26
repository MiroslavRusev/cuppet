@example-dev
 Feature: Open DEMO QA (as base site) and use the elements section

   Scenario: Go to demo qa page and open the elements section
     Given I go to "/"
     And I should see "Elements" in "Cards" region
     Then I click on the text "Elements" in the "Cards" region
     And I wait for the text "Please select an item from left" to appear within "5" seconds
     Then I click on the element "TextBox"
     And I wait for "0.5" seconds
     And I fill in "#userName" with "Example Name"
     And I fill in "#userEmail" with "example@example.com"
     And I fill in "#currentAddress" with "Example text in text area"
     Then I click on the element "#submit"
     And I wait for element with "#output" selector to appear within "2" seconds
     And I should see the element with selector "#name"
     And I should see the element with selector "#email"
     And I should see the element with selector "p#currentAddress"
  
  Scenario: Light house performance test
    Given I go to "/"
    Then I save the path of the current page
    And I generate lighthouse report for the saved page

  Scenario: Pa11y accessibility test
    Given I go to "/"
    Then I save the path of the current page
    And I validate the saved page accessibility

  Scenario: Backstop visual test 
    And I generate reference screenshot for "https://demoqa.com/elements"
    Then I compare "https://demoqa.com/elements" to reference screenshot