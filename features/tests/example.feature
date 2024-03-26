@example-dev
 Feature: Open DEMO QA (as base site) and use the elements section

   Scenario: Go to demo qa page and open the elements section
     Given I go to "/"
     And I should see "Elements" in "Cards" region
     Then I click on the text "Elements" in the "Cards" region
     And I wait for the text "Please select an item from left" to appear within "5" seconds
     Then I click on the element ".show #item-0"
     And I wait for "0.5" seconds
     And I fill in "#userName" with "Example Name"
     And I fill in "#userEmail" with "example@example.com"
     And I fill in "#currentAddress" with "Example text in text area"
     Then I click on the element "#submit"
     And I wait for element with "#output" selector to appear within "2" seconds
     And I should see the element with selector "#name"
     And I should see the element with selector "#email"
     And I should see the element with selector "p#currentAddress"