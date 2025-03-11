// קובץ בדיקה עם privateKey
// ESLint אמור לזהות את זה כמשתנה אסור

const credentials = {
  username: "admin",
  // זה אמור להיות מזוהה כמשתנה אסור
  privateKey: "private-key-123456"
      secretKey2: "12345" // אמור לסמן שגיאה!
      secretK2ey2: "12345" // אמור לסמן שגיאה!
      secretKe2y2: "12345" // אמור לסמן שגיאה!
      secretKe222y2: "12345" // אמור לסמן שגיאה!
      secretKe22222y2: "12345" // אמור לסמן שגיאה!
      secretKe2222222y2: "12345" // אמור לסמן שגיאה!

};

function getCredentials() {
  return {
    // גם זה אמור להיות מזוהה כמשתנה אסור
    privateKey: "another-private-key"
  };
}

module.exports = {
  credentials,
  getCredentials
}; 