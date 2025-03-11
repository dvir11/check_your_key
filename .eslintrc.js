module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: ["eslint:recommended"],
  rules: {
    // כללים פשוטים שעובדים בכל עורך
    "semi": ["error", "always"],
    "no-undef": "error",
    "no-unused-vars": "warn",
    
    // כללים לזיהוי משתנים רגישים
    "id-denylist": ["error", "privateKey", "secretKey", "apiKey", "password", "token", "debugMode"],
    
    // כללים מתקדמים יותר
    "no-restricted-syntax": [
      "error",
      {
        selector: 'Property[key.name="secretKey"]',
        message: '🔴 אסור להשתמש במפתח \'secretKey\'!'
      },
      {
        selector: 'Property[key.name="privateKey"]',
        message: '🔴 אסור להשתמש במפתח \'privateKey\'!'
      },
      {
        selector: 'Property[key.name="apiKey"]',
        message: '🔴 אסור להשתמש במפתח \'apiKey\'!'
      },
      {
        selector: 'Property[key.name="password"]',
        message: '🔴 אסור להשתמש במפתח \'password\'!'
      },
      {
        selector: 'Property[key.name="token"]',
        message: '🔴 אסור להשתמש במפתח \'token\'!'
      },
      {
        selector: 'Property[key.name="debugMode"]',
        message: "🔴 אסור להשתמש במפתח 'debugMode'!"
      }
    ],
    
    // כללים פשוטים יותר לזיהוי משתנים רגישים
    'no-restricted-properties': [
      'error',
      {
        'object': 'config',
        'property': 'debugMode',
        'message': '🔴 אסור להשתמש ב-config.debugMode!'
      },
      {
        'property': 'privateKey',
        'message': '🔴 אסור להשתמש במשתנה \'privateKey\'!'
      },
      {
        'property': 'secretKey',
        'message': '🔴 אסור להשתמש במשתנה \'secretKey\'!'
      },
      {
        'property': 'apiKey',
        'message': '🔴 אסור להשתמש במשתנה \'apiKey\'!'
      },
      {
        'property': 'password',
        'message': '🔴 אסור להשתמש במשתנה \'password\'!'
      },
      {
        'property': 'token',
        'message': '🔴 אסור להשתמש במשתנה \'token\'!'
      }
    ]
  }
};
