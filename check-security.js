#!/usr/bin/env node

/**
 * Security Check Script
 * 
 * // תיאור: סקריפט לבדיקת משתנים רגישים בקוד
 * // מטרה: זיהוי ומניעת שימוש במשתנים רגישים שעלולים לחשוף מידע אבטחתי
 * // שימוש: node check-security.js [קובץ או תיקייה]
 */

const fs = require('fs');
const path = require('path');

// // צבעים לקונסול - מאפשרים פלט צבעוני וברור
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
  underline: (text) => `\x1b[4m${text}\x1b[0m`,
  bgRed: (text) => `\x1b[41m${text}\x1b[0m`,
  bgGreen: (text) => `\x1b[42m${text}\x1b[0m`,
  bgBlue: (text) => `\x1b[44m${text}\x1b[0m`,
  bgYellow: (text) => `\x1b[43m${text}\x1b[0m`
};

// // טעינת הגדרות - קובץ ההגדרות מאפשר התאמה אישית של הכלי
let config = {
  forbiddenVariables: [
    { name: 'privateKey', alternatives: ["process.env.PRIVATE_KEY", "os.environ.get('PRIVATE_KEY')"], description: "Private key that could expose sensitive information" },
    { name: 'secretKey', alternatives: ["process.env.SECRET_KEY", "os.environ.get('SECRET_KEY')"], description: "Secret key that could expose sensitive information" },
    { name: 'apiKey', alternatives: ["process.env.API_KEY", "os.environ.get('API_KEY')"], description: "API key that could expose sensitive information" },
    { name: 'password', alternatives: ["process.env.PASSWORD", "os.environ.get('PASSWORD')"], description: "Password that could expose sensitive information" },
    { name: 'token', alternatives: ["process.env.TOKEN", "os.environ.get('TOKEN')"], description: "Token that could expose sensitive information" },
    { name: 'debugMode', alternatives: ["process.env.DEBUG_MODE === 'true'", "os.environ.get('DEBUG_MODE') == 'True'"], description: "Debug mode that could expose sensitive information in production" }
  ],
  excludedDirectories: ['node_modules', 'dist', 'build', '.git', 'venv', '__pycache__', '.pytest_cache'],
  excludedFiles: ['security-config.json'],
  fileExtensions: ['.js', '.jsx', '.ts', '.tsx', '.py'],
  alerts: {
    enabled: true,
    showAlternatives: true,
    showDescription: true,
    severity: "high"
  },
  languagePatterns: {
    javascript: {
      envVarPattern: "process.env.{VAR_NAME}",
      importPattern: "require('dotenv').config();"
    },
    python: {
      envVarPattern: "os.environ.get('{VAR_NAME}')",
      importPattern: "import os"
    }
  }
};

// // ניסיון לטעון הגדרות מותאמות אישית מקובץ
try {
  if (fs.existsSync('./security-config.json')) {
    const fileContent = fs.readFileSync('./security-config.json', 'utf8');
    
    try {
      const customConfig = JSON.parse(fileContent);
      
      // // מיזוג ההגדרות
      if (customConfig.forbiddenVariables) {
        config.forbiddenVariables = customConfig.forbiddenVariables;
      }
      
      if (customConfig.excludedDirectories) {
        config.excludedDirectories = customConfig.excludedDirectories;
      }
      
      if (customConfig.excludedFiles) {
        config.excludedFiles = customConfig.excludedFiles;
      }
      
      if (customConfig.fileExtensions) {
        config.fileExtensions = customConfig.fileExtensions;
      }
      
      if (customConfig.alerts) {
        config.alerts = { ...config.alerts, ...customConfig.alerts };
      }
      
      if (customConfig.languagePatterns) {
        config.languagePatterns = { ...config.languagePatterns, ...customConfig.languagePatterns };
      }
      
      console.log(colors.green('✓ Loaded custom security configuration from security-config.json'));
    } catch (parseError) {
      console.error(colors.red('Error parsing security-config.json:'), parseError.message);
      console.log(colors.yellow('Using default configuration instead'));
    }
  }
} catch (error) {
  console.error(colors.red('Error loading security-config.json:'), error.message);
  console.log(colors.yellow('Using default configuration instead'));
}

// // חילוץ שמות המשתנים האסורים לשימוש מהיר
const FORBIDDEN_VARS = config.forbiddenVariables.map(v => v.name);

// // פונקציה לקבלת מידע על משתנה
function getVariableInfo(varName) {
  return config.forbiddenVariables.find(v => v.name === varName);
}

// // פונקציה להצגת התראה בהתאם לחומרת הבעיה
function getSeverityTag(severity) {
  switch(severity.toLowerCase()) {
    case 'high':
      return colors.bgRed(colors.bold(' HIGH '));
    case 'medium':
      return colors.bgYellow(colors.bold(' MEDIUM '));
    case 'low':
      return colors.bgBlue(colors.bold(' LOW '));
    default:
      return colors.bgRed(colors.bold(' HIGH '));
  }
}

// // פונקציה לבדיקת קובץ - מחפשת משתנים רגישים בקוד
function checkFile(filePath) {
  try {
    // // דילוג על קבצים שהוחרגו
    const fileName = path.basename(filePath);
    if (config.excludedFiles.includes(fileName)) {
      return { hasIssues: false, issues: [] };
    }
    
    // // בדיקת סיומת הקובץ
    const ext = path.extname(filePath);
    if (!config.fileExtensions.includes(ext)) {
      return { hasIssues: false, issues: [] };
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let hasIssues = false;
    let issues = [];
    
    // // זיהוי שפת התכנות לפי סיומת הקובץ
    const isPython = ext === '.py';
    const language = isPython ? 'python' : 'javascript';
    
    console.log(`Checking file ${filePath}`);
    console.log('Forbidden variables:', FORBIDDEN_VARS);
    console.log('File content:', content);
    
    // // בדיקת כל שורה בקובץ
    lines.forEach((line, index) => {
      // דילוג על שורות הערה בפייתון
      if (isPython && (line.trim().startsWith('#') || line.trim().startsWith('"""') || line.trim().startsWith("'''"))) {
        return;
      }
      
      // דילוג על שורות הערה בג'אווהסקריפט
      if (!isPython && (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*'))) {
        return;
      }
      
      FORBIDDEN_VARS.forEach(forbiddenVar => {
        // בדיקה אם המשתנה מופיע בשורה
        let found = false;
        let foundVar = forbiddenVar;
        let position = -1;
        
        // בדיקות שונות לפי שפת התכנות
        if (isPython) {
          // בדיקת משתנה רגיל
          const varRegex = new RegExp(`\\b${forbiddenVar}\\b`, 'g');
          if (varRegex.test(line)) {
            found = true;
            position = line.indexOf(forbiddenVar);
          }
          
          // בדיקת משתנה עם self.
          const selfVarRegex = new RegExp(`\\bself\\.${forbiddenVar}\\b`, 'g');
          if (selfVarRegex.test(line)) {
            found = true;
            foundVar = `self.${forbiddenVar}`;
            position = line.indexOf(foundVar);
          }
          
          // בדיקת מפתח במילון עם גרשיים בודדות
          const singleQuoteKeyRegex = new RegExp(`['"]${forbiddenVar}['"]\\s*:`, 'g');
          if (singleQuoteKeyRegex.test(line)) {
            found = true;
            // מציאת המפתח המדויק
            if (line.includes(`'${forbiddenVar}'`)) {
              foundVar = `'${forbiddenVar}'`;
            } else {
              foundVar = `"${forbiddenVar}"`;
            }
            position = line.indexOf(foundVar);
          }
          
          // בדיקת משתנה בשם קבוע (כמו SECRET_KEY)
          if (forbiddenVar === forbiddenVar.toUpperCase()) {
            const constVarRegex = new RegExp(`\\b${forbiddenVar}\\b`, 'g');
            if (constVarRegex.test(line)) {
              found = true;
              position = line.indexOf(forbiddenVar);
            }
          }
        } else {
          // בדיקה רגילה לג'אווהסקריפט
          const varRegex = new RegExp(`\\b${forbiddenVar}\\b`, 'g');
          if (varRegex.test(line)) {
            found = true;
            position = line.indexOf(forbiddenVar);
          }
        }
        
        if (found && position >= 0) {
          const varInfo = getVariableInfo(forbiddenVar);
          
          // // התאמת החלופות לשפת התכנות והסרת כפילויות
          let languageSpecificAlternatives = [];
          
          if (isPython) {
            // שמירה רק על חלופות פייתון או המרת חלופות JavaScript לפייתון
            languageSpecificAlternatives = varInfo.alternatives
              .filter(alt => alt.includes('os.environ') || alt.includes('process.env'))
              .map(alt => {
                if (alt.includes('process.env')) {
                  return alt.replace('process.env.', "os.environ.get('") + "')";
                }
                return alt;
              });
              
            // הוספת חלופה של python-dotenv
            let varNameUpperCase;
            if (forbiddenVar === forbiddenVar.toUpperCase()) {
              // אם המשתנה כבר באותיות גדולות, אין צורך להוסיף קווים תחתונים
              varNameUpperCase = forbiddenVar;
            } else {
              // המרת camelCase ל-SNAKE_CASE
              varNameUpperCase = forbiddenVar.replace(/([A-Z])/g, '_$1').toUpperCase();
            }
            const dotenvAlt = `os.getenv('${varNameUpperCase}')`;
            if (!languageSpecificAlternatives.includes(dotenvAlt)) {
              languageSpecificAlternatives.push(dotenvAlt);
            }
          } else {
            // שמירה רק על חלופות JavaScript או המרת חלופות פייתון ל-JavaScript
            languageSpecificAlternatives = varInfo.alternatives
              .filter(alt => alt.includes('process.env') || alt.includes('os.environ'))
              .map(alt => {
                if (alt.includes('os.environ')) {
                  return alt.replace("os.environ.get('", 'process.env.').replace("')", '');
                }
                return alt;
              });
          }
          
          // הסרת כפילויות
          languageSpecificAlternatives = [...new Set(languageSpecificAlternatives)];
          
          issues.push({
            line: index + 1,
            column: position + 1,
            variable: forbiddenVar,
            text: line.trim(),
            alternatives: languageSpecificAlternatives,
            description: varInfo.description,
            severity: varInfo.severity || config.alerts.severity,
            language: language
          });
          hasIssues = true;
        }
      });
    });
    
    // // הצגת הבעיות שנמצאו
    if (hasIssues && config.alerts.enabled) {
      console.log(`\n${colors.blue('Checking file:')} ${colors.bold(filePath)}`);
      console.log(`${colors.red(colors.bold('✖'))} ${colors.red(`Found ${issues.length} security issues:`)}`);
      
      issues.forEach(issue => {
        const severityTag = getSeverityTag(issue.severity);
        console.log(`  ${colors.yellow(`${issue.line}:${issue.column}`)} ${severityTag} Use of forbidden variable ${colors.bold(issue.variable)}`);
        console.log(`    ${colors.cyan(issue.text.replace(issue.variable, colors.bgRed(issue.variable)))}`);
        
        // // הצגת תיאור הבעיה
        if (issue.description && config.alerts.showDescription) {
          console.log(`    ${colors.yellow('Description:')} ${issue.description}`);
        }
        
        // // הצגת חלופות מומלצות
        if (issue.alternatives && issue.alternatives.length > 0 && config.alerts.showAlternatives) {
          console.log(`    ${colors.green('Suggested alternatives:')}`);
          issue.alternatives.forEach(alt => {
            console.log(`      ${colors.bgBlue(' → ')} ${colors.green(alt)}`);
          });
          
          // // הצגת הערה על ייבוא הספרייה הנדרשת
          if (issue.language === 'python') {
            if (issue.alternatives.some(alt => alt.includes('os.environ'))) {
              console.log(`      ${colors.yellow('Note:')} Add ${colors.green('import os')} at the top of your file`);
            }
            if (issue.alternatives.some(alt => alt.includes('os.getenv'))) {
              console.log(`      ${colors.yellow('Note:')} For .env files, add ${colors.green('from dotenv import load_dotenv; load_dotenv()')} at the top of your file`);
            }
          } else if (issue.language === 'javascript' && issue.alternatives.some(alt => alt.includes('process.env'))) {
            console.log(`      ${colors.yellow('Note:')} For .env files, add ${colors.green("require('dotenv').config()")} at the top of your file`);
          }
        }
        
        console.log(''); // // שורה ריקה בין הבעיות
      });
    }
    
    return { hasIssues, issues };
  } catch (error) {
    console.error(`${colors.red('Error checking file')} ${filePath}:`, error.message);
    return { hasIssues: false, issues: [] };
  }
}

// // פונקציה לבדיקת תיקייה - עוברת רקורסיבית על כל הקבצים בתיקייה
function checkDirectory(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    let hasIssues = false;
    let allIssues = [];
    
    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      
      // // דילוג על תיקיות שהוחרגו
      if (config.excludedDirectories.includes(file) || file.startsWith('.') && !config.excludedDirectories.includes(file)) {
        return;
      }
      
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        const { hasIssues: dirHasIssues, issues: dirIssues } = checkDirectory(fullPath);
        hasIssues = hasIssues || dirHasIssues;
        allIssues = [...allIssues, ...dirIssues];
      } else {
        const { hasIssues: fileHasIssues, issues: fileIssues } = checkFile(fullPath);
        hasIssues = hasIssues || fileHasIssues;
        allIssues = [...allIssues, ...fileIssues];
      }
    });
    
    return { hasIssues, issues: allIssues };
  } catch (error) {
    console.error(`${colors.red('Error checking directory')} ${dirPath}:`, error.message);
    return { hasIssues: false, issues: [] };
  }
}

// // פונקציה להדפסת סיכום - מציגה סיכום של כל הבעיות שנמצאו
function printSummary(hasIssues, issues) {
  console.log('\n' + '='.repeat(60));
  
  if (hasIssues) {
    console.log(`${colors.bgRed(colors.bold(` ✖ Total: ${issues.length} security issues found! `))}`);
    
    if (config.alerts.enabled) {
      console.log(`${colors.yellow('\nProblematic variables found:')}`);
      
      // // ספירת מספר ההופעות של כל משתנה
      const varCounts = {};
      issues.forEach(issue => {
        varCounts[issue.variable] = (varCounts[issue.variable] || 0) + 1;
      });
      
      // // הצגת המשתנים לפי סדר יורד של מספר ההופעות
      Object.entries(varCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([variable, count]) => {
          const varInfo = getVariableInfo(variable);
          console.log(`  ${colors.red('•')} ${colors.bold(variable)}: ${count} occurrences - ${varInfo.description}`);
        });
      
      // // ספירת מספר הבעיות לפי שפה
      const languageCounts = {};
      issues.forEach(issue => {
        languageCounts[issue.language] = (languageCounts[issue.language] || 0) + 1;
      });
      
      if (Object.keys(languageCounts).length > 1) {
        console.log(`\n${colors.yellow('Issues by language:')}`);
        Object.entries(languageCounts).forEach(([language, count]) => {
          console.log(`  ${colors.blue('•')} ${colors.bold(language)}: ${count} issues`);
        });
      }
      
      // // הצגת המלצות לתיקון
      console.log('\n' + `${colors.yellow('To fix these issues:')}`);
      console.log('  1. Use environment variables instead of sensitive variables directly in code');
      
      if (languageCounts['javascript']) {
        console.log('  2. For JavaScript: Add .env files to .gitignore and use dotenv');
        console.log(`     ${colors.green("require('dotenv').config()")}`);
      }
      
      if (languageCounts['python']) {
        console.log('  2. For Python: Use environment variables with os.environ or python-dotenv');
        console.log(`     ${colors.green("import os")}`);
        console.log(`     ${colors.green("api_key = os.environ.get('API_KEY')")}`);
        console.log(`     Or with python-dotenv:`);
        console.log(`     ${colors.green("from dotenv import load_dotenv\nload_dotenv()")}`);
        console.log(`     ${colors.green("import os")}`);
        console.log(`     ${colors.green("api_key = os.getenv('API_KEY')")}`);
      }
      
      console.log('  3. Use different variable names that are not in the forbidden list');
      console.log('  4. Check the suggested alternatives for each issue');
      
      // // מידע על התאמה אישית של הכלי
      console.log('\n' + `${colors.blue('Want to customize the security checker?')}`);
      console.log(`  Edit ${colors.bold('security-config.json')} to add your own forbidden variables and alternatives`);
      console.log(`  Use the template at the end of the file to quickly add new variables`);
    }
  } else {
    console.log(`${colors.bgGreen(colors.bold(' ✓ No security issues found! '))}`);
  }
  
  console.log('='.repeat(60));
}

// // פונקציה ליצירת קובץ הגדרות ברירת מחדל אם הוא לא קיים
function createDefaultConfigIfNeeded() {
  if (!fs.existsSync('./security-config.json')) {
    try {
      // // יצירת קובץ הגדרות סטנדרטי
      fs.writeFileSync('./security-config.json', JSON.stringify(config, null, 2));
      console.log(colors.green('✓ Created default security-config.json'));
    } catch (error) {
      console.error(colors.red('Error creating security-config.json:'), error.message);
    }
  }
}

// // פונקציה להוספה מהירה של משתנה חדש
function addNewVariable(name, description, alternatives) {
  try {
    if (!name || !description) {
      console.error(colors.red('Error: Variable name and description are required'));
      return false;
    }
    
    if (fs.existsSync('./security-config.json')) {
      try {
        // // קריאת הקובץ כ-JSON
        const customConfig = JSON.parse(fs.readFileSync('./security-config.json', 'utf8'));
        
        // // בדיקה אם המשתנה כבר קיים
        const exists = customConfig.forbiddenVariables.some(v => v.name === name);
        if (exists) {
          console.error(colors.red(`Error: Variable "${name}" already exists in the configuration`));
          return false;
        }
        
        // // יצירת חלופות ברירת מחדל אם לא סופקו
        let defaultAlternatives = [];
        
        // חלופה לג'אווהסקריפט
        defaultAlternatives.push(`process.env.${name.replace(/([A-Z])/g, '_$1').toUpperCase()}`);
        
        // חלופה לפייתון
        defaultAlternatives.push(`os.environ.get('${name.replace(/([A-Z])/g, '_$1').toUpperCase()}')`);
        
        // // הוספת המשתנה החדש
        customConfig.forbiddenVariables.push({
          name: name,
          alternatives: alternatives && alternatives.length > 0 ? alternatives : defaultAlternatives,
          description: description,
          severity: "high"
        });
        
        // // שמירת הקובץ המעודכן
        fs.writeFileSync('./security-config.json', JSON.stringify(customConfig, null, 2));
        console.log(colors.green(`✓ Added new variable "${name}" to security-config.json`));
        
        // // עדכון המשתנים האסורים בזיכרון
        config.forbiddenVariables.push({
          name: name,
          alternatives: alternatives && alternatives.length > 0 ? alternatives : defaultAlternatives,
          description: description,
          severity: "high"
        });
        
        // עדכון מערך המשתנים האסורים
        FORBIDDEN_VARS.push(name);
        
        return true;
      } catch (error) {
        console.error(colors.red('Error parsing security-config.json:'), error.message);
        return false;
      }
    } else {
      console.error(colors.red('Error: security-config.json not found'));
      createDefaultConfigIfNeeded();
      return addNewVariable(name, description, alternatives);
    }
  } catch (error) {
    console.error(colors.red('Error adding new variable:'), error.message);
    return false;
  }
}

// // פונקציה להצגת מידע על שימוש במשתנה חדש
function displayVariableUsageInfo(name) {
  console.log('\n' + colors.cyan('='.repeat(60)));
  console.log(colors.bold(colors.yellow(`How to use the new variable "${name}":`) + '\n'));
  console.log(colors.cyan('='.repeat(60)));
  
  console.log(`\n${colors.bold('1. Where to store the actual secret value:')}\n`);
  console.log(`   ${colors.green('✓')} In JavaScript/Node.js: Create a ${colors.bold('.env')} file in your project root:`);
  console.log(`     ${colors.green(`${name.replace(/([A-Z])/g, '_$1').toUpperCase()}=your-actual-secret-value`)}`);
  console.log(`   ${colors.green('✓')} In Python: Create a ${colors.bold('.env')} file in your project root:`);
  console.log(`     ${colors.green(`${name.replace(/([A-Z])/g, '_$1').toUpperCase()}=your-actual-secret-value`)}`);
  console.log(`   ${colors.red('✗')} ${colors.bold('NEVER')} store the actual secret value directly in your code!`);
  
  console.log(`\n${colors.bold('2. How to access the secret in your code:')}`);
  console.log(`   ${colors.green('✓')} In JavaScript/Node.js:`);
  console.log(`     ${colors.green(`require('dotenv').config();`)}`);
  console.log(`     ${colors.green(`const ${name} = process.env.${name.replace(/([A-Z])/g, '_$1').toUpperCase()};`)}`);
  console.log(`   ${colors.green('✓')} In Python:`);
  console.log(`     ${colors.green(`import os`)}`);
  console.log(`     ${colors.green(`from dotenv import load_dotenv`)}`);
  console.log(`     ${colors.green(`load_dotenv()`)}`);
  console.log(`     ${colors.green(`${name} = os.environ.get('${name.replace(/([A-Z])/g, '_$1').toUpperCase()}')`)}`);
  
  console.log(`\n${colors.bold('3. To check your code for this variable:')}`);
  console.log(`   ${colors.green('✓')} Check all files in your project:`);
  console.log(`     ${colors.green(`node check-security.js`)}`);
  console.log(`   ${colors.green('✓')} Check a specific file:`);
  console.log(`     ${colors.green(`node check-security.js path/to/your/file.js`)}`);
  console.log(`   ${colors.green('✓')} Watch for changes and check automatically:`);
  console.log(`     ${colors.green(`node check-security.js --watch`)}`);
  
  console.log('\n' + colors.cyan('='.repeat(60)));
}

// // קוד ראשי - נקודת הכניסה לסקריפט
const args = process.argv.slice(2);

// // יצירת קובץ הגדרות ברירת מחדל אם צריך
createDefaultConfigIfNeeded();

// // בדיקה אם זו הוספה מהירה של משתנה חדש
if (args[0] === '--add' || args[0] === '-a') {
  // הדפסת כותרת
  process.stdout.write(`\n${colors.bold(colors.cyan('🔒 Code Security Checker - Adding New Variable'))}\n`);
  process.stdout.write(`${colors.cyan('='.repeat(50))}\n`);
  
  const name = args[1];
  const description = args[2];
  const alternatives = args.slice(3);
  
  if (!name || !description) {
    process.stderr.write(colors.red('Error: Variable name and description are required\n'));
    process.stdout.write(`Usage: ${colors.cyan('node check-security.js --add <name> <description> [alternatives...]')}\n`);
    process.exit(1);
  }
  
  const success = addNewVariable(name, description, alternatives);
  if (success) {
    // הדפסת מידע על השימוש במשתנה
    console.log('\n' + colors.cyan('='.repeat(60)));
    console.log(colors.bold(colors.yellow(`How to use the new variable "${name}":`) + '\n'));
    console.log(colors.cyan('='.repeat(60)));
    
    console.log(`\n${colors.bold('1. Where to store the actual secret value:')}`);
    console.log(`   ${colors.green('✓')} In JavaScript/Node.js: Create a ${colors.bold('.env')} file in your project root:`);
    console.log(`     ${colors.green(`${name.replace(/([A-Z])/g, '_$1').toUpperCase()}=your-actual-secret-value`)}`);
    console.log(`   ${colors.green('✓')} In Python: Create a ${colors.bold('.env')} file in your project root:`);
    console.log(`     ${colors.green(`${name.replace(/([A-Z])/g, '_$1').toUpperCase()}=your-actual-secret-value`)}`);
    console.log(`   ${colors.red('✗')} ${colors.bold('NEVER')} store the actual secret value directly in your code!`);
    
    console.log(`\n${colors.bold('2. How to access the secret in your code:')}`);
    console.log(`   ${colors.green('✓')} In JavaScript/Node.js:`);
    console.log(`     ${colors.green(`require('dotenv').config();`)}`);
    console.log(`     ${colors.green(`const ${name} = process.env.${name.replace(/([A-Z])/g, '_$1').toUpperCase()};`)}`);
    console.log(`   ${colors.green('✓')} In Python:`);
    console.log(`     ${colors.green(`import os`)}`);
    console.log(`     ${colors.green(`from dotenv import load_dotenv`)}`);
    console.log(`     ${colors.green(`load_dotenv()`)}`);
    console.log(`     ${colors.green(`${name} = os.environ.get('${name.replace(/([A-Z])/g, '_$1').toUpperCase()}')`)}`);
    
    console.log(`\n${colors.bold('3. To check your code for this variable:')}`);
    console.log(`   ${colors.green('✓')} Check all files in your project:`);
    console.log(`     ${colors.green(`node check-security.js`)}`);
    console.log(`   ${colors.green('✓')} Check a specific file:`);
    console.log(`     ${colors.green(`node check-security.js path/to/your/file.js`)}`);
    console.log(`   ${colors.green('✓')} Watch for changes and check automatically:`);
    console.log(`     ${colors.green(`node check-security.js --watch`)}`);
    
    console.log('\n' + colors.cyan('='.repeat(60)) + '\n');
    
    process.stdout.write(colors.green(`Run the security check to test the new variable: node check-security.js\n`));
  }
  process.exit(0);
}

// // בדיקה אם זה מצב צפייה
if (args[0] === '--watch' || args[0] === '-w') {
  // // הסרת הארגומנט הראשון כדי שנוכל להשתמש בשאר הארגומנטים
  const watchArgs = args.slice(1);
  
  console.log(`\n${colors.bold(colors.cyan('🔒 Code Security Checker - Watch Mode'))}`);
  console.log(`${colors.cyan('='.repeat(50))}`);
  console.log(`${colors.yellow('Watching for file changes...')}`);
  
  // // מעקב אחר שינויים בקבצים
  const watchPath = watchArgs.length > 0 ? watchArgs[0] : '.';
  
  // // פונקציה לבדיקת קובץ שהשתנה
  const checkChangedFile = (filePath) => {
    // // בדיקה אם הקובץ קיים
    if (!fs.existsSync(filePath)) {
      return;
    }
    
    // // בדיקה אם זה קובץ או תיקייה
    const stats = fs.statSync(filePath);
    
    console.log(`\n${colors.yellow('File changed:')} ${filePath}`);
    
    if (stats.isDirectory()) {
      const { hasIssues, issues } = checkDirectory(filePath);
      printSummary(hasIssues, issues);
    } else {
      const { hasIssues, issues } = checkFile(filePath);
      printSummary(hasIssues, issues);
    }
    
    console.log(`\n${colors.yellow('Watching for file changes...')}`);
  };
  
  // // הגדרת מעקב אחר שינויים בקבצים
  try {
    // // בדיקה ראשונית של הקבצים
    if (fs.existsSync(watchPath)) {
      const stats = fs.statSync(watchPath);
      
      if (stats.isDirectory()) {
        console.log(`${colors.blue(`Initial check of all files in directory ${watchPath}...`)}`);
        const { hasIssues, issues } = checkDirectory(watchPath);
        printSummary(hasIssues, issues);
      } else {
        console.log(`${colors.blue(`Initial check of file ${watchPath}...`)}`);
        const { hasIssues, issues } = checkFile(watchPath);
        printSummary(hasIssues, issues);
      }
    }
    
    // // הגדרת מעקב אחר שינויים בקבצים
    console.log(`\n${colors.yellow('Watching for file changes...')}`);
    console.log(`${colors.cyan('Press Ctrl+C to stop watching')}`);
    
    // // שימוש ב-fs.watch לצפייה בשינויים
    const watcher = fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
      if (!filename) return;
      
      // // בניית נתיב מלא לקובץ
      const filePath = path.join(watchPath, filename);
      
      // // בדיקה אם הקובץ מוחרג
      const ext = path.extname(filePath);
      if (!config.fileExtensions.includes(ext)) {
        return;
      }
      
      // // בדיקה אם הקובץ או התיקייה מוחרגים
      const parts = filePath.split(path.sep);
      for (const part of parts) {
        if (config.excludedDirectories.includes(part)) {
          return;
        }
      }
      
      if (config.excludedFiles.includes(path.basename(filePath))) {
        return;
      }
      
      // // בדיקת הקובץ שהשתנה
      setTimeout(() => {
        checkChangedFile(filePath);
      }, 100); // // המתנה קצרה כדי לאפשר לקובץ להיסגר
    });
    
    // // טיפול בסגירת התוכנית
    process.on('SIGINT', () => {
      console.log(`\n${colors.green('Stopped watching for file changes')}`);
      if (watcher) {
        watcher.close();
      }
      process.exit(0);
    });
    
    // // השארת התוכנית פעילה
    setInterval(() => {}, 1000);
  } catch (error) {
    console.error(`${colors.red('Error watching files:')} ${error.message}`);
    process.exit(1);
  }
  
  // // מניעת המשך הריצה של הקוד
  return;
}

// // בדיקה אם זה בדיקת קבצים שהשתנו
if (args[0] === '--changed' || args[0] === '-c') {
  console.log(`\n${colors.bold(colors.cyan('🔒 Code Security Checker - Changed Files Only'))}`);
  console.log(`${colors.cyan('='.repeat(50))}`);
  
  try {
    // // בדיקה אם git מותקן
    const { exec } = require('child_process');
    
    // // הרצת פקודת git לקבלת רשימת הקבצים שהשתנו
    exec('git diff --name-only HEAD', (error, stdout, stderr) => {
      if (error) {
        console.error(`${colors.red('Error getting changed files:')} ${error.message}`);
        console.error(`${colors.yellow('Make sure you are in a git repository')}`);
        process.exit(1);
      }
      
      // // פיצול הפלט לשורות
      const changedFiles = stdout.trim().split('\n').filter(file => file.trim() !== '');
      
      if (changedFiles.length === 0) {
        console.log(`${colors.green('No changed files found')}`);
        process.exit(0);
      }
      
      console.log(`${colors.blue(`Found ${changedFiles.length} changed files:`)}`);
      changedFiles.forEach(file => {
        console.log(`  ${colors.cyan(file)}`);
      });
      
      console.log(`\n${colors.blue('Checking changed files...')}`);
      
      // // בדיקת כל הקבצים שהשתנו
      let hasIssues = false;
      let allIssues = [];
      
      changedFiles.forEach(file => {
        // // בדיקה אם הקובץ קיים
        if (!fs.existsSync(file)) {
          return;
        }
        
        // // בדיקה אם הקובץ מוחרג
        const ext = path.extname(file);
        if (!config.fileExtensions.includes(ext)) {
          return;
        }
        
        // // בדיקה אם הקובץ או התיקייה מוחרגים
        const parts = file.split(path.sep);
        for (const part of parts) {
          if (config.excludedDirectories.includes(part)) {
            return;
          }
        }
        
        if (config.excludedFiles.includes(path.basename(file))) {
          return;
        }
        
        // // בדיקת הקובץ
        const { hasIssues: fileHasIssues, issues: fileIssues } = checkFile(file);
        hasIssues = hasIssues || fileHasIssues;
        allIssues = [...allIssues, ...fileIssues];
      });
      
      // // הדפסת סיכום
      printSummary(hasIssues, allIssues);
      
      if (hasIssues) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    });
  } catch (error) {
    console.error(`${colors.red('Error checking changed files:')} ${error.message}`);
    process.exit(1);
  }
  
  // // מניעת המשך הריצה של הקוד
  return;
}

// // בדיקה אם זה התקנת הוק
if (args[0] === '--install-hook') {
  console.log(`\n${colors.bold(colors.cyan('🔒 Code Security Checker - Installing Git Hook'))}`);
  console.log(`${colors.cyan('='.repeat(50))}`);
  
  try {
    // // בדיקה אם git מותקן
    const { execSync } = require('child_process');
    
    // // בדיקה אם אנחנו בתוך מאגר git
    try {
      execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    } catch (error) {
      console.error(`${colors.red('Error:')} Not a git repository`);
      console.error(`${colors.yellow('Please run this command inside a git repository')}`);
      process.exit(1);
    }
    
    // // בדיקה אם התיקייה .git/hooks קיימת
    const gitDir = execSync('git rev-parse --git-dir', { encoding: 'utf8' }).trim();
    const hooksDir = path.join(gitDir, 'hooks');
    
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }
    
    // // נתיב להוק pre-commit
    const preCommitHookPath = path.join(hooksDir, 'pre-commit');
    
    // // תוכן ההוק
    const hookContent = `#!/bin/sh
# Code Security Checker pre-commit hook
# Automatically checks for sensitive variables before each commit

echo "🔒 Running Code Security Checker..."
node "${path.resolve(__dirname, 'check-security.js')}" --changed

# If the security check fails, prevent the commit
if [ $? -ne 0 ]; then
  echo "❌ Security check failed. Please fix the issues before committing."
  exit 1
fi

exit 0
`;
    
    // // כתיבת ההוק
    fs.writeFileSync(preCommitHookPath, hookContent);
    
    // // הפיכת ההוק לניתן להרצה
    try {
      fs.chmodSync(preCommitHookPath, '755');
    } catch (error) {
      console.warn(`${colors.yellow('Warning:')} Could not make the hook executable`);
      console.warn(`${colors.yellow('You may need to run:')} chmod +x ${preCommitHookPath}`);
    }
    
    console.log(`${colors.green('✓ Git pre-commit hook installed successfully')}`);
    console.log(`${colors.blue('The security checker will now run automatically before each commit')}`);
    console.log(`${colors.blue('Hook location:')} ${preCommitHookPath}`);
    
    process.exit(0);
  } catch (error) {
    console.error(`${colors.red('Error installing Git hook:')} ${error.message}`);
    process.exit(1);
  }
}

// // הצגת עזרה
if (args[0] === '--help' || args[0] === '-h') {
  console.log(`\n${colors.bold('Usage:')} node check-security.js [options] [file or directory]`);
  console.log(`\n${colors.bold('Options:')}`);
  console.log(`  ${colors.yellow('--add, -a')} ${colors.cyan('<name> <description> [alternatives...]')} Add a new variable to check`);
  console.log(`  ${colors.yellow('--watch, -w')} ${colors.cyan('[path]')} Watch for file changes and check them automatically`);
  console.log(`  ${colors.yellow('--changed, -c')} Check only files that have changed since the last commit`);
  console.log(`  ${colors.yellow('--install-hook')} Install a Git pre-commit hook to run checks automatically`);
  console.log(`  ${colors.yellow('--help, -h')} Show this help message`);
  
  console.log(`\n${colors.bold('Examples:')}`);
  console.log(`  ${colors.cyan('node check-security.js')} Check all files in the current directory`);
  console.log(`  ${colors.cyan('node check-security.js path/to/file.js')} Check a specific file`);
  console.log(`  ${colors.cyan('node check-security.js --add myApiToken "API token for service" "process.env.API_TOKEN"')} Add a new variable`);
  console.log(`  ${colors.cyan('node check-security.js --watch')} Watch all files in the current directory`);
  console.log(`  ${colors.cyan('node check-security.js --watch path/to/dir')} Watch files in a specific directory`);
  console.log(`  ${colors.cyan('node check-security.js --changed')} Check only files that have changed since the last commit`);
  console.log(`  ${colors.cyan('node check-security.js --install-hook')} Install a Git pre-commit hook`);
  
  console.log(`\n${colors.bold('Adding New Variables:')}`);
  console.log(`  When you add a new variable with ${colors.yellow('--add')}, it will be added to the configuration file.`);
  console.log(`  After adding, you need to run a separate command to check your files for this variable:`);
  console.log(`    ${colors.cyan('node check-security.js')} - This will check ALL files in your project for the new variable`);
  console.log(`    ${colors.cyan('node check-security.js specific-file.js')} - This will check only the specified file`);
  console.log(`  The ${colors.yellow('--add')} command itself does NOT perform any checks, it only updates the configuration.`);
  
  console.log(`\n${colors.bold('Variable Storage:')}`);
  console.log(`  ${colors.red('✗')} ${colors.bold('NEVER')} store sensitive values directly in your code!`);
  console.log(`  ${colors.green('✓')} Store sensitive values in environment variables or .env files (add to .gitignore)`);
  console.log(`  ${colors.green('✓')} For JavaScript: Use ${colors.cyan('process.env.VARIABLE_NAME')} to access variables`);
  console.log(`  ${colors.green('✓')} For Python: Use ${colors.cyan("os.environ.get('VARIABLE_NAME')")} to access variables`);
  
  process.exit(0);
}

// Check file or directory provided as argument
const targetPath = args[0];
if (targetPath && !targetPath.startsWith('-')) {
  if (fs.existsSync(targetPath)) {
    const stats = fs.statSync(targetPath);
    if (stats.isDirectory()) {
      const { hasIssues, issues } = checkDirectory(targetPath);
      printSummary(hasIssues, issues);
      process.exit(hasIssues ? 1 : 0);
    } else {
      const { hasIssues, issues } = checkFile(targetPath);
      printSummary(hasIssues, issues);
      process.exit(hasIssues ? 1 : 0);
    }
  } else {
    console.error(colors.red(`Error: Path ${targetPath} does not exist`));
    process.exit(1);
  }
}
