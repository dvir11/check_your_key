// This is a sample configuration file
// ESLint will detect the sensitive variables in this file

const config = {
  // This will be flagged by ESLint
  debugMode: true,
  
  // Regular configuration that is fine
  appName: "My Secure App",
  port: 3000,
  
  // These will be flagged by ESLint
  secretKey: "abc123",
  apiKey: "xyz789",
  password: "secure123",
  token: "jwt-token-example"
};

module.exports = config; 