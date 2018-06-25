# Random Sample Generators: Tools for Data Auditing

These sample generators are built for integration into Google Sheets to enable faster and easier generation of test samples for QA auditing. Some samplers are generic and usable with any data set, whereas others are more specialized and should be paired with a specific sheet template in order to function as intended.

----
## Contents
  - [Tech](#tech)
  - [Generic Sample Generator](#generic-sample-generator)
  - [Onboarding Sampler](#onboarding-sampler)
  - [How to Use](#how-to-use)
  - More to Come

----
## Tech
All files are written in Google Apps Script and meant for use with Google Sheets.

----
## Generic Sample Generator
This sampler can be used with any Google Sheets-based dataset that is formatted with one item per row.

Users input some basic information about the sheet they are sampling from, including the header rows to exclude and the number of items they wish to include in the sample, and the sampler will create a new, timestamped tab with the sample.
![alt text][generic]
Artificial data generated using [Mockaroo][mockdata].

----
## Onboarding Sampler
Details coming soon!

----
## How to Use
Each code file is built to be fully self-contained. To use each sampler, simply open the Script Editor under the Tools menu of the spreadsheet you wish to sample. Paste in the code and save the project. You may need to refresh the page to view the menu options that will allow you to launch the sampler.

[generic]: https://github.com/kathrynchew/sampler/blob/master/_img/Random_Audit_Generator_1-Animation.gif?raw=true "Generic Audit Sampler"
[mockdata]: https://mockaroo.com/
