// Test file for the new secret variables

// Using the new secret variables directly (security issues)
const newPythonSecret = "this-is-a-python-secret";
const anotherSecret = "this-is-another-secret";
const thirdSecret = "this-is-a-third-secret";
const fourthSecret = "this-is-a-fourth-secret";
const fifthSecret = "this-is-a-fifth-secret";

// Using the secrets in an object
const secrets = {
  newPythonSecret,
  anotherSecret,
  thirdSecret,
  fourthSecret,
  fifthSecret
};

// Exporting the secrets (security issues)
module.exports = {
  newPythonSecret,
  anotherSecret,
  thirdSecret,
  fourthSecret,
  fifthSecret
}; 