# בודק אבטחת קוד

כלי עוצמתי לזיהוי ומניעת שימוש במשתנים רגישים בקוד JavaScript/TypeScript שלך.

## תכונות חדשות! 🎉

- **הצעות חלופה אוטומטיות** - הכלי מציע חלופות בטוחות למשתנים רגישים
- **הגדרה קלה של משתנים מותאמים אישית** - קובץ הגדרות פשוט להוספת משתנים לבדיקה
- **תיאורים מפורטים** - הסבר על כל משתנה רגיש והסיכון שהיא מהווה
- **מצב צפייה** - ניטור אוטומטי של שינויים בקבצים ובדיקה מיידית
- **בדיקת קבצים שהשתנו** - בדיקה רק של קבצים שהשתנו מאז הקומיט האחרון
- **התקנת Git Hook** - הוספה אוטומטית של בדיקת אבטחה לפני כל קומיט
- **תמיכה בשפות נוספות** - הרחבת התמיכה לשפות תכנות נוספות

## איך זה עובד

1. **זיהוי אוטומטי**: סורק את כל הקבצים בפרויקט שלך כדי לזהות משתנים רגישים
2. **הודעות שגיאה ברורות**: מציג הודעות שגיאה מפורטות עם מיקום מדויק של משתנים רגישים
3. **מניעת Commit**: מונע דחיפת קוד עם משתנים רגישים ל-Git
4. **ניטור בזמן אמת**: עוקב אחר שינויים בקבצים ובודק אוטומטית קוד חדש

## משתנים רגישים שנבדקים

הכלי מזהה את המשתנים הרגישים הבאים:

- `privateKey` - מפתח פרטי שעלול לחשוף מידע רגיש
- `secretKey` - מפתח סודי שעלול לחשוף מידע רגיש
- `apiKey` - מפתח API שעלול לחשוף מידע רגיש
- `password` - סיסמה שעלולה לחשוף מידע רגיש
- `token` - טוקן שעלול לחשוף מידע רגיש
- `debugMode` - מצב דיבאג שעלול לחשוף מידע רגיש בסביבת ייצור

## התקנה

### אפשרות 1: התקנה בפרויקט שלך

1. שכפל את המאגר:
   ```
   git clone https://github.com/your-username/code-security-checker.git
   cd code-security-checker
   ```

2. התקן את התלויות:
   ```
   npm install
   ```

3. התקן את Git Hook (אופציונלי):
   ```
   node check-security.js --install-hook
   ```

### אפשרות 2: העתקת בודק האבטחה לפרויקט קיים

1. העתק את הקבצים `check-security.js` ו-`security-config.json` לתיקיית השורש של הפרויקט שלך
2. התקן את Git Hook (אופציונלי):
   ```
   node check-security.js --install-hook
   ```

## שימוש

### בדיקת הקוד שלך

יש מספר דרכים לבדוק את הקוד שלך:

1. **בדיקה חד-פעמית של כל הפרויקט**:
   ```
   node check-security.js
   ```

2. **בדיקה של קובץ ספציפי**:
   ```
   node check-security.js path/to/file.js
   ```

3. **בדיקה אוטומטית בכל שינוי** (מצב צפייה):
   ```
   node check-security.js --watch
   ```

4. **בדיקה של תיקייה ספציפית במצב צפייה**:
   ```
   node check-security.js --watch path/to/dir
   ```

5. **בדיקה רק של קבצים שהשתנו מאז הקומיט האחרון**:
   ```
   node check-security.js --changed
   ```

6. **הוספת משתנה חדש לבדיקה**:
   ```
   node check-security.js --add myApiToken "API token for service" "process.env.API_TOKEN"
   ```

7. **התקנת Git Hook לבדיקה אוטומטית לפני כל קומיט**:
   ```
   node check-security.js --install-hook
   ```

8. **הצגת עזרה**:
   ```
   node check-security.js --help
   ```

### שילוב עם Git Hooks

יש שתי דרכים להתקין Git Hook:

1. **שימוש בפקודת ההתקנה המובנית** (מומלץ):
   ```
   node check-security.js --install-hook
   ```

2. **התקנה ידנית**:
   ```
   # יצירת קובץ pre-commit
   echo '#!/bin/sh
   node check-security.js --changed
   if [ $? -ne 0 ]; then
     echo "❌ Security check failed. Please fix the issues before committing."
     exit 1
   fi
   exit 0' > .git/hooks/pre-commit
   
   # הפיכת הקובץ לניתן להרצה
   chmod +x .git/hooks/pre-commit
   ```

## הבנת הפלט

כאשר הכלי מוצא משתנים רגישים, הוא יציג:

1. את נתיב הקובץ שבו נמצאה הבעיה
2. את מספר השורה והעמודה של כל בעיה
3. את רמת החומרה של הבעיה (HIGH, MEDIUM, LOW)
4. את המשתנה הספציפי שהפעיל את השגיאה
5. את שורת הקוד המכילה את המשתנה הרגיש (מודגש)
6. תיאור של הבעיה והסיכון שהיא מהווה
7. הצעות לחלופות בטוחות למשתנה הרגיש
8. סיכום של כל הבעיות שנמצאו, כולל ספירה לכל סוג של משתנה

דוגמה לפלט:
```
Checking file: config.js
✖ Found 5 security issues:
  6:3 HIGH Use of forbidden variable debugMode
    debugMode: true,
    Description: Debug mode that could expose sensitive information in production
    Suggested alternatives:
      → process.env.DEBUG_MODE === 'true'
      → config.isDebugMode()

  13:3 HIGH Use of forbidden variable secretKey
    secretKey: "abc123",
    Description: Secret key that could expose sensitive information
    Suggested alternatives:
      → process.env.SECRET_KEY
      → config.getSecretFromEnv()
  ...

============================================================
 ✖ Total: 63 security issues found! 
Problematic variables found:
  • secretKey: 23 occurrences - Secret key that could expose sensitive information
  • debugMode: 19 occurrences - Debug mode that could expose sensitive information in production
  • privateKey: 8 occurrences - Private key that could expose sensitive information
  ...
```

## תיקון בעיות

כאשר הכלי מזהה משתנים רגישים, יש מספר דרכים לתקן את הבעיה:

1. **שימוש במשתני סביבה**:
   ```javascript
   // במקום:
   const apiKey = "my-secret-key";

   // השתמש ב:
   const apiKey = process.env.API_KEY;
   ```

2. **שינוי שמות המשתנים**:
   ```javascript
   // במקום:
   const secretKey = "abc123";

   // השתמש ב:
   const apiSecret = "abc123";
   ```

3. **שימוש בקובץ .env**:
   ```
   # .env
   API_KEY=my-secret-key
   ```

   ```javascript
   // config.js
   require('dotenv').config();
   const config = {
     apiKeyFromEnv: process.env.API_KEY
   };
   ```

## התאמה אישית של הכלי

### הוספת משתנים רגישים נוספים

יש שתי דרכים להוסיף משתנים רגישים חדשים:

1. **שימוש בפקודת הוספה מהירה**:
   ```
   node check-security.js --add myApiToken "API token for service" "process.env.API_TOKEN"
   ```

2. **עריכה ידנית של קובץ ההגדרות**:
   ערוך את הקובץ `security-config.json`:

```json
{
  "forbiddenVariables": [
    {
      "name": "privateKey",
      "alternatives": [
        "process.env.PRIVATE_KEY",
        "config.getPrivateKeyFromEnv()"
      ],
      "description": "Private key that could expose sensitive information",
      "severity": "high"
    },
    // הוסף משתנים חדשים כאן
    {
      "name": "myCustomSecret",
      "alternatives": [
        "process.env.MY_CUSTOM_SECRET",
        "getSecureValue('myCustomSecret')"
      ],
      "description": "Custom variable that contains sensitive information",
      "severity": "high"
    }
  ],
  "excludedDirectories": [
    "node_modules",
    "dist",
    "build",
    ".git"
    // הוסף תיקיות להחרגה כאן
  ],
  "excludedFiles": [
    "security-config.json"
    // הוסף קבצים להחרגה כאן
  ],
  "fileExtensions": [
    ".js",
    ".jsx",
    ".ts",
    ".tsx"
    // הוסף סיומות קבצים כאן
  ],
  "alerts": {
    "enabled": true,
    "showAlternatives": true,
    "showDescription": true,
    "severity": "high"
  }
}
```

### התאמת הגדרות התראות

ניתן להתאים את אופן הצגת ההתראות על ידי עריכת מקטע ה-`alerts` בקובץ ההגדרות:

```json
"alerts": {
  "enabled": true,         // האם להציג התראות
  "showAlternatives": true, // האם להציג חלופות מוצעות
  "showDescription": true,  // האם להציג תיאור של הבעיה
  "severity": "high"        // רמת החומרה הכללית (high, medium, low)
}
```

## פיתוח עתידי

תכונות שאנחנו מתכננים להוסיף בעתיד:

1. **בדיקת קוד בזמן CI/CD** - שימוש במערכות CI/CD כמו GitHub Actions
2. **דוחות מפורטים** - יצירת דוחות HTML או JSON מפורטים
3. **זיהוי חכם יותר** - שימוש בניתוח סמנטי לזיהוי משתנים רגישים גם אם השם שונה
4. **תמיכה בשפות נוספות** - הרחבת התמיכה לשפות תכנות נוספות

## רישיון

פרויקט זה מופץ תחת רישיון MIT. ראה את קובץ `LICENSE` לפרטים נוספים.
