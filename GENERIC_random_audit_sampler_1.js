/* ##### VERSION 1.0 OF AUDIT SAMPLER GENERATOR [[WORKS WITH ANY SAMPLE]] ##### */
/* For use with Google Sheets Code Editor */

/* MENU */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Audit')
    .addItem('Generate Sample', 'runAll')  // Run all sampler functions
    .addToUi();
}


/* SAMPLING FUNCTIONS */

function sheetName() {
  var targetName = Browser.inputBox('Type the NAME of the tab to be sampled from exactly as it appears.'); 
  return targetName;
}

function firstRow() {
  var startRow = parseInt(Browser.inputBox('Enter the number of the FIRST ROW containing data in the box below. Enter the number as a digit.'));
  return startRow;
}

function finalRow(targetName,startRow) {
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheetByName(targetName);
 var lastRow = (sheet.getLastRow() - startRow) + 1;
  return lastRow;
}

function firstCol() {
  var startCol = parseInt(Browser.inputBox('Enter the number of the FIRST COLUMN containing data in the box below. Enter the number as a digit.'));
  return startCol; 
}

function finalCol(targetName,startCol) {
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheetByName(targetName);
 var endCol = (sheet.getLastColumn() - startCol) + 1; 
  return endCol;
}

function auditSize() {
  var sampleSize = parseInt(Browser.inputBox('How many items will you audit? Enter the number as a digit.'));
  return sampleSize;
}

function dataCollect(targetName, startRow, startCol, lastRow, endCol) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
   var sheet = ss.getSheetByName(targetName);
   var values = sheet.getSheetValues(startRow, startCol, lastRow, endCol); 
  return values;
}

function randomSelect(allLoans, sampleSize) {
  var auditArray = [];
  for (a=0; a<sampleSize; a++) {   
    var randomSelect = Math.floor(Math.random() * allLoans.length);
    var spliceSelect = allLoans.splice(randomSelect,1);
    auditArray.push(spliceSelect[0]);
  }
  allLoans[spliceSelect];
  return auditArray;
}

function writeValues(contentsToAudit, startRow, startCol, sampleSize, endCol) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var today = Utilities.formatDate(new Date(), "PST", "yyyy-MM-dd HH:mm:ss");
  var printSheet = 'Audit Sample ' + today
  ss.insertSheet(printSheet);
  var sheet = ss.getSheetByName(printSheet);
  var range = sheet.getRange(startRow, startCol, sampleSize, endCol).setValues(contentsToAudit); 
}

function runAll(){
  var targetName = sheetName();
  var startRow = firstRow();
  var lastRow = finalRow(targetName, startRow);
  var startCol = firstCol();
  var endCol = finalCol(targetName, startCol);
  var sampleSize = auditSize();
  var allLoansArray = dataCollect(targetName, startRow, startCol, lastRow, endCol);
  var auditArray = randomSelect(allLoansArray,sampleSize);
  writeValues(auditArray, startRow, startCol, sampleSize, endCol);
}
