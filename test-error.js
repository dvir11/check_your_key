// קובץ בדיקה עם שגיאת ESLint ברורה
const x = 5

// שגיאת ; חסר בשורה 2
const config = {
  privateKey: "this-should-show-error"
};

// עוד שגיאת ; חסר
const y = 10

module.exports = {
  x,
  config,
  y
}; 