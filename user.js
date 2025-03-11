// This is a sample user file
// ESLint will detect the sensitive variables in this file

const user = {
  name: "Avi",
  email: "avi@example.com",
  
  // These will be flagged by ESLint
  secretKey: "user-secret-123",
  password: "user-password-456",
  token: "user-token-789"
};

// This function will also be flagged because it uses restricted properties
function authenticateUser() {
  const credentials = {
    apiKey: "auth-api-key",
    password: "auth-password"
  };
  
  return credentials;
}

module.exports = {
  user,
  authenticateUser
}; 