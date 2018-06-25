/* ###### VERSION 2.0 OF AUDIT SAMPLE GENERATOR [[ONBOARDING TRANSACTION REVIEW]] ###### */
/* For use with Google Sheets Code Editor */


/* SETUP GOES HERE */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Audit')
  .addItem('Generate All Samples', 'onboardingTransactionSample') // Run all sampler functions
  .addSeparator()
  .addSubMenu(ui.createMenu('Output Category Data')
              .addItem('[ALL] Funded - No PSL - CRB', 'writeNoPslCrbAll')
              .addItem('[ALL] Funded - No PSL - BankMobile','writeNoPslBmAll')
              .addItem('[ALL] Funded - PSL - CRB','writeYesPslCrbAll')
              .addItem('[ALL] Declined - CRB','writeDeclinedCrbAll')
              .addItem('[ALL] Declined - BankMobile','writeDeclinedBmAll')
             )
  .addSubMenu(ui.createMenu('Re-Run One Sample Set')
              .addItem('Funded - No PSL - CRB', 'runNoPslCrb')
              .addItem('Funded - No PSL - BankMobile', 'runNoPslBm')
              .addItem('Funded - PSL - CRB', 'runYesPslCrb')
              .addItem('Declined - CRB', 'runDeclinedCrb')
              .addItem('Declined - BankMobile', 'runDeclinedBm')
             )
  .addToUi();
}

function getAllValues() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Raw Data");
  var startRow = 1;
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

function getDeclinedBm(allValues) { // Filter for all loans that meet parameters: student_loan == No, saas_institution_id == 1, loan_status == funded
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
  var currentContents = sheet.getRange("Z6:AO15").getValues();
  var contentCount = 0;
                                                                             // Arrays to confirm re-running audit sample will not                 
  var fivePlaceholders = ["Funded - NO PSL - BankMobile"];                   // overwrite an audit that has already started
  var tenPlaceholders = ["Funded - NO PSL - CRB", "Funded - PSL - CRB", "Declined - BankMobile"];
  var twentyPlaceholders = ["Declined - CRB"];
  
  for (var i=0;i<currentContents.length;i++) {                               // Count how many fields in the sheet have been filled in   
    for (var a=0;a<currentContents[0].length;a++) {
      if (currentContents[i][a].length > 0) {
        contentCount++;
      }
    }
  }
  
  if (contentCount > 10 && tenPlaceholders.indexOf(sheetName) != -1) {            // If a sheet that should only have 10 (auto)filled 
    var ui = SpreadsheetApp.getUi();                                              // audit cells has more, throw an alert
    ui.alert("Auditing of the current dataset [[ " + sheetName + " ]] has already begun. Sample cannot be re-generated.");
  }
  else if (contentCount > 5 && fivePlaceholders.indexOf(sheetName) != -1) {       // If a sheet that should only have 5 (auto)filled 
    var ui = SpreadsheetApp.getUi();                                              // audit cells has more, throw an alert
    ui.alert("Auditing of the current dataset [[ " + sheetName + " ]] has already begun. Sample cannot be re-generated.");  
  }
  else if (contentCount > 20 && twentyPlaceholders.indexOf(sheetName) != -1) {    // If a sheet that should have 20 (auto)filled 
    var ui = SpreadsheetApp.getUi();                                              // audit cells has more, throw an alert
    ui.alert("Auditing of the current dataset [[ " + sheetName + " ]] has already begun. Sample cannot be re-generated.");  
  }
  else {                                                                    // Otherwise, evaluate whether any matching accounts were found
    if (sampleData.length > 0) {                                            // If yes, write accounts to the sheet
      var startRow = 6;
      var startCol = 1;
      var lastRow = sampleData.length;
      var lastCol = sampleData[0].length;
      var range = sheet.getRange(startRow, startCol, lastRow, lastCol).setValues(sampleData); 
    }
    else {                                                                  // If no, fill in a value confirming that were none were found
      sheet.getRange("A6").setValue("No Matching Accounts Were Found");     // (So there is no confusion that the code actually ran successfully)
    }    
  }
}


function writeAllToSheet(categoryData, sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName(sheetName)) {
    SpreadsheetApp.getUi().alert("That data has already been outputted.");
  }
  else {
    ss.insertSheet(sheetName);
    var sheet = ss.getSheetByName(sheetName);
    var range = sheet.getRange(1, 1, categoryData.length, 
                               categoryData[0].length).setValues(categoryData); 
  }
}

/* CALL FUNCTIONS TO OUTPUT ALL DATA IN A SINGLE FILTER CATEGORY */

function writeNoPslCrbAll() {
  var allValues = getAllValues();
  var noPslCrbAll = getNoPslCrb(allValues);
  writeAllToSheet(noPslCrbAll, "[ALL] Funded - NO PSL - CRB");
}

function writeNoPslBmAll() {
  var allValues = getAllValues();
  var noPslBmAll = getNoPslBm(allValues);
  writeAllToSheet(noPslBmAll, "[ALL] Funded - NO PSL - BankMobile");
}

function writeYesPslCrbAll() {
  var allValues = getAllValues();
  var yesPslCrbAll = getYesPslCrb(allValues);
  writeAllToSheet(yesPslCrbAll, "[ALL] Funded - PSL - CRB");
}

function writeDeclinedCrbAll() {
  var allValues = getAllValues();
  var declinedCrbAll = getDeclinedCrb(allValues);
  writeAllToSheet(declinedCrbAll, "[ALL] Declined - CRB");
}

function writeDeclinedBmAll() {
  var allValues = getAllValues();
  var declinedBmAll = getDeclinedBm(allValues);
  writeAllToSheet(declinedBmAll, "[ALL] Declined - BankMobile");
}


/* CALL FUNCTIONS TO RUN GENERATION OF A SINGLE SAMPLE DATA SET, OR RE-DO IF "__NAME__" == "__MAIN__" */

function runNoPslCrb() {
  var allValues = getAllValues();
  var noPslCrb = getNoPslCrb(allValues);
  var noPslCrbSample = randomCrbSample(noPslCrb);
  writeSampleToSheet(noPslCrbSample, "Funded - NO PSL - CRB");
}

function runNoPslBm() {
  var allValues = getAllValues();
  var noPslBm = getNoPslBm(allValues);
  var noPslBmSample = randomBmSample(noPslBm);
  writeSampleToSheet(noPslBmSample, "Funded - NO PSL - BankMobile");
}

function runYesPslCrb() {
  var allValues = getAllValues();
  var yesPslCrb = getYesPslCrb(allValues);
  var yesPslCrbSample = randomCrbSample(yesPslCrb);
  writeSampleToSheet(yesPslCrbSample, "Funded - PSL - CRB");
}

function runDeclinedCrb() {
  var allValues = getAllValues();
  var declinedCrb = getDeclinedCrb(allValues);
  var declinedCrbSample = randomCrbSample(declinedCrb);
  writeSampleToSheet(declinedCrbSample, "Declined - CRB");
}

function runDeclinedBm() {
  var allValues = getAllValues();
  var declinedBm = getDeclinedBm(allValues);
  var declinedBmSample = randomBmSample(declinedBm);
  writeSampleToSheet(declinedBmSample, "Declined - BankMobile");
}


/* CALL FUNCTIONS TO GENERATE ALL SAMPLES */

function onboardingTransactionSample() {  // Run all sampler functions
  runNoPslCrb()
  runNoPslBm()
  runYesPslCrb()
  runDeclinedCrb()
  runDeclinedBm()
}

