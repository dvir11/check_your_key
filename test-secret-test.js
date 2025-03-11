// Test file for the testSecret variable

// Using the testSecret variable directly (security issue)
const testSecret = "this-is-a-test-secret";

// Adding another security issue
const apiKey = "this-is-an-api-key";

function getSecretData() {
  // Using the testSecret variable again
  return {
    id: 123,
    secret: testSecret,
    key: apiKey
  };
}

// Exporting the testSecret (another security issue)
module.exports = {
  getSecretData,
  testSecret,
  apiKey
}; 