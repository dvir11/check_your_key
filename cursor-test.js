// קובץ בדיקה פשוט לבדיקה ב-Cursor

// שגיאת ; חסר - אמורה להיות מסומנת
const x = 5

// שגיאת שם משתנה אסור - אמורה להיות מסומנת
const privateKey = "this-should-show-error";

// שגיאת שם משתנה אסור באובייקט - אמורה להיות מסומנת
const config = {
  secretKey: "this-should-show-error-too"
};

// משתנה לא בשימוש - אמור להיות מסומן כאזהרה
const unusedVar = "this is not used";

// פונקציה עם שגיאת ;
function test() {
  return "test"
}

module.exports = {
  x,
  privateKey,
  config,
  test
}; 