// קובץ זה נועד לבדוק את החוקים החדשים שהוספנו ל-ESLint

// דוגמה 1: הגדרת משתנה בעייתי
const debugMode = true; // אמור לסמן שגיאה!

// דוגמה 2: שימוש בתכונה בעייתית באובייקט
const config = {
  debugMode: true, // אמור לסמן שגיאה!
  secretKey: "12345" // אמור לסמן שגיאה!
    secretKey2: "12345" // אמור לסמן שגיאה!
        secretKey3: "12345" // אמור לסמן שגיאה!
        secretKey3: "12345" // אמור לסמן שגיאה!
        secretKey3233: "12345" // אמור לסמן שגיאה!
        secretKey323233: "12345" // אמור לסמן שגיאה!
        secretKey32223233: "12345" // אמור לסמן שגיאה!
        secretKey322232323: "12345" // אמור לסמן שגיאה!
        secretKey3222332323: "12345" // אמור לסמן שגיאה!


};

// דוגמה 3: גישה לתכונה בעייתית
console.log(config.debugMode); // אמור לסמן שגיאה!

// דוגמה 4: הגדרת משתנה רגיש נוסף
const secretKey = "abcdef"; // אמור לסמן שגיאה!

// דוגמה 5: שימוש בתכונה באובייקט אחר
const user = {
  name: "מישהו",
  secretKey: "uvwxyz" // אמור לסמן שגיאה!
};

// דוגמה 6: הגדרת משתנה בתוך פונקציה
function initializeApp() {
  const debugMode = false; // אמור לסמן שגיאה!
  return { ready: true };
}

// דוגמה 7: העברת משתנה רגיש כפרמטר
function connect(secretKey) { // אמור לסמן שגיאה!
  return "Connected with key: " + secretKey;
}

// דוגמה 8: שימוש במשתנה רגיש בתוך מערך
const settings = ["normal", "advanced", { debugMode: true }]; // אמור לסמן שגיאה!

// דוגמה 9: ייבוא משתנה רגיש
import { debugMode as importedDebugMode } from './config'; // אמור לסמן שגיאה!

// דוגמה 10: שימוש במשתנה רגיש בתוך פונקציית משנה (arrow function)
const checkStatus = () => {
  const secretKey = "xyz123"; // אמור לסמן שגיאה!
  return secretKey.length > 0;
};

// דוגמה 11: הגדרת אובייקט מורכב עם משתנים רגישים
const serverConfig = {
  database: {
    credentials: {
      secretKey: "server-db-key" // אמור לסמן שגיאה!
    }
  },
  settings: {
    debugMode: true // אמור לסמן שגיאה!
  }
};

// דוגמה 12: שימוש בשמות אובייקטים משתנים
const configName = "config";
const obj = {};
obj[configName] = { debugMode: true }; // אמור לסמן שגיאה!

// דוגמה 13: הגדרת אובייקטים בתוך לולאה
for (let i = 0; i < 3; i++) {
  const tempConfig = {
    debugMode: (i === 0), // אמור לסמן שגיאה!
    secretKey: `key-${i}` // אמור לסמן שגיאה!
  };
  console.log(tempConfig);
}

// הדוגמה הבאה שונה מהקודמות - היא אמורה להיות תקינה (משתני סביבה)
const API_KEY = process.env.API_KEY; // תקין - משתמש במשתנה סביבה
const SECRET_TOKEN = process.env.SECRET_TOKEN; // תקין - משתמש במשתנה סביבה

// פונקציה שמנסה להשתמש במשתנה בעייתי
function toggleDebug() {
  return config.debugMode; // אמור לסמן שגיאה!
}

// דוגמה 14: שימוש במרובה במשתנים רגישים
class SecurityManager {
  constructor() {
    this.debugMode = true; // אמור לסמן שגיאה!
    this.secretKey = "class-key"; // אמור לסמן שגיאה!
  }
  
  verify() {
    if (this.debugMode) { // אמור לסמן שגיאה!
      return this.secretKey; // אמור לסמן שגיאה!
    }
  }
}

// דוגמה 15: הרחבה של אובייקט קיים עם משתנים רגישים
config.newSettings = {
  debugMode: false, // אמור לסמן שגיאה!
  secretKey: "new-key" // אמור לסמן שגיאה!
};

// דוגמה 16: הבטחות (Promises) עם משתנים רגישים
const authPromise = new Promise((resolve) => {
  const secretKey = "promise-key"; // אמור לסמן שגיאה!
  resolve(secretKey);
});

// דוגמה 17: פונקציות אסינכרוניות
async function fetchData() {
  const debugMode = await checkServerMode(); // אמור לסמן שגיאה!
  return { success: debugMode };
}

// דוגמה 18: רדיוס פעולה (scope) מקונן עמוק
function outerFunction() {
  function middleFunction() {
    function innerFunction() {
      const secretKey = "inner-key"; // אמור לסמן שגיאה!
      return secretKey;
    }
    return innerFunction();
  }
  return middleFunction();
}

// דוגמה 19: קבועים מרובים
const { serverMode: debugModeSettings, apiToken: secretKeySettings } = getSettings(); // אמור לסמן שגיאה פעמיים!

// דוגמה 20: מחלקות עם גטרים וסטרים
class DebugService {
  get debugMode() { // אמור לסמן שגיאה!
    return this._debugValue;
  }
  
  set secretKey(value) { // אמור לסמן שגיאה!
    this._secretValue = value;
  }
}