/* ###### VERSION 2.0 OF AUDIT SAMPLE GENERATOR [[ONBOARDING TRANSACTION REVIEW]] ###### */
/* For use with Google Sheets Code Editor */


/* SETUP GOES HERE */

function onOpen() {    // Create new menu item to launch sampler
  SpreadsheetApp.getUi()
    .createMenu('Audit')
    .addItem('Generate All Samples', 'onboardingTransactionSample') // Run all sampler functions
    .addToUi();
}

function getAllValues() {    // Fetch all values from intial raw data csv content
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Raw Data");
  var startRow = 2;
  var lastRow = sheet.getLastRow();
  lastRow = lastRow - startRow + 1;
  var startCol = 1;
  var lastCol = 19;
  var values = sheet.getSheetValues(startRow, startCol, lastRow, lastCol); 
  
  return values;
}

/* FILTERING LOGIC GOES HERE */

function getNoPslCrb(allValues) {   // Filter for all loans that meet parameters: student_loan == No, saas_institution_id == 1, loan_status == funded
  var filteredValues = [];
  for (i=0; i<allValues.length; i++) {
    if (allValues[i][1]==1 && allValues[i][2]==='funded' && allValues[i][5]==='No') {
      filteredValues.push(allValues[i]);
    }
  }
  return filteredValues;  
}

function getNoPslBm(allValues) {   // Filter for all loans that meet parameters: student_loan == No, saas_institution_id == 3, loan_status == funded
  var filteredValues = [];
  for (i=0; i<allValues.length; i++) {
    if (allValues[i][1]==3 && allValues[i][2]==='funded' && allValues[i][5]==='No') {
      filteredValues.push(allValues[i]);
    }
  }
  return filteredValues;  
}

function getYesPslCrb(allValues) { // Filter for all loans that meet parameters: student_loan == Yes, saas_institution_id == 1, loan_status == funded
  var filteredValues = [];
  for (i=0; i<allValues.length; i++) {
    if (allValues[i][1]==1 && allValues[i][2]==='funded' && allValues[i][5]==='Yes') {
      filteredValues.push(allValues[i]);
    }
  }
  return filteredValues;  
}

function getDeclinedCrb(allValues) { // Filter for all loans that meet parameters: student_loan == No, saas_institution_id == 1, loan_status == funded
  var filteredValues = [];
  for (i=0; i<allValues.length; i++) {
    if (allValues[i][1]==1 && allValues[i][5]==='No' && (allValues[i][2]==='declined' || allValues[i][2]==='disqualified')) {
      filteredValues.push(allValues[i]);
    }
  }
  return filteredValues;  
}

function getDeclinedBm(allValues) {    // Filter for all loans that meet parameters: student_loan == No, saas_institution_id == 1, loan_status == funded
  var filteredValues = [];
  for (i=0; i<allValues.length; i++) {
    if (allValues[i][1]==3 && allValues[i][5]==='No' && (allValues[i][2]==='declined' || allValues[i][2]==='disqualified')) {
      filteredValues.push(allValues[i]);
    }
  }
  return filteredValues;  
}

/* LOGIC TO FILTER A RANDOM SAMPLE OF APPROPRIATE SIZE GOES HERE */

function randomCrbSample(crbData) {    // Randomly select 10 rows from filtered set
  var auditSample = [];
  for (a=0; a<10; a++) {   
    var randomSelect = Math.floor(Math.random() * crbData.length);
    var spliceSelect = crbData.splice(randomSelect,1);
    auditSample.push(spliceSelect[0]);
  }
  return auditSample;
}

function randomBmSample(bmData) {    // Randomly select 5 rows from filtered set; if <5 rows, return all rows
  var auditSample = [];
  if (bmData.length > 5) {
    for (a=0; a<5; a++) {   
      var randomSelect = Math.floor(Math.random() * bmData.length);
      var spliceSelect = bmData.splice(randomSelect,1);
      auditSample.push(spliceSelect[0]);
    }
    return auditSample;
  }
  else {
    return bmData;
    }
}

/* LOGIC TO WRITE FILTERED VALUES TO SHEETS GOES HERE */

function writeSampleToSheet(sampleData, sheetName) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
  if (sampleData.length > 0) {
    var startRow = 6;
    var startCol = 1;
    var lastRow = sampleData.length;
    var lastCol = sampleData[0].length;
    var range = sheet.getRange(startRow, startCol, lastRow, lastCol).setValues(sampleData); 
  }
  else {
    sheet.getRange("A6").setValue("No Matching Accounts Were Found");
  }
}

/* CALL ALL FUNCTIONS USING NEW MENU OPTION */

function onboardingTransactionSample() {    // Run all sampler functions
  var allValues = getAllValues();
  var noPslCrb = getNoPslCrb(allValues);
  var noPslBm = getNoPslBm(allValues);
  var yesPslCrb = getYesPslCrb(allValues);
  var declinedCrb = getDeclinedCrb(allValues);
  var declinedBm = getDeclinedBm(allValues);
  
  var noPslCrbSample = randomCrbSample(noPslCrb);
  var noPslBmSample = randomBmSample(noPslBm);
  var yesPslCrbSample = randomCrbSample(yesPslCrb);
  var declinedCrbSample = randomCrbSample(declinedCrb);
  var declinedBmSample = randomBmSample(declinedBm);
  
  writeSampleToSheet(noPslCrbSample, "Funded - NO PSL - CRB");
  writeSampleToSheet(noPslBmSample, "Funded - NO PSL - BM");
  writeSampleToSheet(yesPslCrbSample, "Funded - PSL - CRB");
  writeSampleToSheet(declinedCrbSample, "Declined - CRB");
  writeSampleToSheet(declinedBmSample, "Declined - BM");
}
