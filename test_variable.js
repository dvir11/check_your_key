// Test file for the testVariable

// Using the testVariable directly (security issue)
const testVariable = "this-is-a-test-variable";

// Using the variable in an object
const config = {
  testVariable
};

// Exporting the variable (security issue)
module.exports = {
  testVariable
}; 