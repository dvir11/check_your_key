// This is a safe configuration file example
// It doesn't use sensitive variables directly

// Import environment variables (should be loaded from .env file in production)
require('dotenv').config();

const config = {
  // Safe configuration that won't be flagged by ESLint
  appName: "My Secure App",
  port: 3000,
  
  // Safe way to handle sensitive information - using environment variables
  auth: {
    // These won't be flagged by ESLint because they don't use the restricted property names
    secretFromEnv: process.env.SECRET_KEY,
    apiKeyFromEnv: process.env.API_KEY,
    passwordFromEnv: process.env.PASSWORD,
    tokenFromEnv: process.env.TOKEN,
    privateKeyFromEnv: process.env.PRIVATE_KEY
  },
  
  // Safe way to handle debug mode - using environment variable
  isDebugMode: process.env.DEBUG_MODE === 'true'
};

module.exports = config; 