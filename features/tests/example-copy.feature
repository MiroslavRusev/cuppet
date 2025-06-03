@appium
Feature: Click elements on mobile device
  Scenario: Open settings page and click on a specific setting
    Given I go to "com.google.android.youtube" app package and ".HomeActivity" activity
    And I click on the element "id=com.android.permissioncontroller:id/permission_deny_button" on mobile
    And I wait for "2" seconds
    Then I scroll to the element 'text("Reject all")' on mobile
    Then I click on the element '.text("Reject all")' on mobile
    Then I click on the element '.description("Search")' on mobile