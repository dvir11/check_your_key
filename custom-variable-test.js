// קובץ בדיקה עם משתנה מותאם אישית

// נוסיף משתנה מותאם אישית לקובץ ההגדרות ונבדוק אם הכלי מזהה אותו
const myCustomSecret = "this-is-my-custom-secret";

function testFunction() {
  // שימוש במשתנה הרגיש
  console.log("Using custom secret:", myCustomSecret);
  
  return {
    data: "some data",
    secret: myCustomSecret // שימוש נוסף במשתנה הרגיש
  };
}

module.exports = {
  testFunction,
  myCustomSecret
}; 