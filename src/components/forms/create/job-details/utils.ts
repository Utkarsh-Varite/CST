import type { IDropdownOption } from "@fluentui/react";

export const exemptStatusOptions: IDropdownOption[] = [
  //might change key
  { key: "Exempt", text: "Exempt" },
  { key: "Non-Exempt", text: "Non-Exempt" },
];

export const typeOfPlacementOptions: IDropdownOption[] = [
  { key: "Contract", text: "Contract" },
  { key: "Permanent", text: "Permanent" },
];

export const clientSubVendorOptions: IDropdownOption[] = [
  { key: "Not Applicable", text: "Not Applicable" },
  { key: "TalentSpace", text: "TalentSpace" },
  { key: "ICON Consultants/VendorPass", text: "ICON Consultants/VendorPass" },
  { key: "IDC Technologies", text: "IDC Technologies" },
  { key: "vDart", text: "vDart" },
];

export const payRateTypeOptions: IDropdownOption[] = [
  { key: "W2", text: "W2" },
  { key: "Canada T4", text: "Canada T4" },
  { key: "CTC - US", text: "CTC - US" },
  { key: "CTC - CANADA", text: "CTC - CANADA" },
  { key: "Permanent-US", text: "Permanent-US" },
  { key: "Permanent-CANADA", text: "Permanent-CANADA" },
  { key: "Permanent-UK", text: "Permanent-UK" },
  { key: "1099", text: "1099" },
  { key: "UK - Agency Worker", text: "UK - Agency Worker" },
  { key: "IR35 – UK", text: "IR35 – UK" },
];

export const noOfHoursOnThisPositionOptions: IDropdownOption[] = [];

for (let i = 1; i <= 48; i++) {
  noOfHoursOnThisPositionOptions.push({
    key: Number(i), // as we are passing number
    text: i.toString(),
  });
}

export const payrollScheduleOptions: IDropdownOption[] = [
  { key: "Select", text: "Select" },
  { key: "Weekly", text: "Weekly" },
  { key: "Semi-Monthly", text: "Semi-Monthly" },
  { key: "Non-W2", text: "Non-W2" },
  { key: "Monthly", text: "Monthly" },
];

export const typeOfEngagementOptions: IDropdownOption[] = [
  { key: "Payrolled", text: "Payrolled" },
  { key: "Recruited", text: "Recruited" },
  { key: "Permanent", text: "Permanent" },
];

export const workAuthorizationStatusOptions: IDropdownOption[] = [
  { key: "Select", text: "Select" },
  { key: "US Citizen", text: "US Citizen" },
  { key: "Canadian Citizen", text: "Canadian Citizen" },
  { key: "Canadian Permanent Resident", text: "Canadian Permanent Resident" },
  { key: "Canadian Work Permit", text: "Canadian Work Permit" },
  { key: "Green Card", text: "Green Card" },
  { key: "H1 B Visa", text: "H1 B Visa" },
  { key: "TN Visa", text: "TN Visa" },
  { key: "T4 Visa", text: "T4 Visa" },
  { key: "H4 EAD", text: "H4 EAD" },
  { key: "OPT EAD", text: "OPT EAD" },
  { key: "F1 OPT EAD", text: "F1 OPT EAD" },
  { key: "E3 EAD", text: "E3 EAD" },
  { key: "GC EAD", text: "GC EAD" },
  { key: "UK Citizen", text: "UK Citizen" },
  { key: "L2 EAD", text: "L2 EAD" },
  { key: "Remote Contractor", text: "Remote Contractor" },
];

export const nonExpiryWorkAuthorisationOptions = [
  "Canadian Work Permit",
  "Green Card",
  "H1 B Visa",
  "TN Visa",
  "T4 Visa",
  "H4 EAD",
  "OPT EAD",
  "F1 OPT EAD",
  "E3 EAD",
  "GC EAD",
  "L2 EAD",
  "Remote Contractor",
];

export const requirementClassificationOptions: IDropdownOption[] = [
  { key: "IT", text: "IT" },
  { key: "Finance", text: "Finance" },
  { key: "Clinical", text: "Clinical" },
  { key: "Marketing", text: "Marketing" },
  { key: "Operation", text: "Operation" },
  { key: "Administration", text: "Administration" },
  { key: "Engineering", text: "Engineering" },
  { key: "Other", text: "Other" },
];

export const divisionOptions: IDropdownOption[] = [
  { key: "bifi", text: "BIFI - Boehringer Ingelheim Fremont Inc" },
  { key: "biah", text: "BIAH - Boehringer Ingelheim Animal Health USA Inc" },
  { key: "bipi", text: "BIPI - Boehringer Ingelheim Pharmaceuticals Inc" },
  { key: "biusa", text: "BIUSA - Boehringer Ingelheim USA Corporation" },
  { key: "bhe-nng", text: "BHE:NNG" },
  { key: "bhe-mec", text: "BHE:MEC" },
  { key: "bhe-pac", text: "BHE:PAC" },
  { key: "dupont-iff", text: "Dupont IFF" },
  { key: "soal-medicaid-agency", text: "SOAL:Medicaid-Agency" },
  { key: "soal-alea", text: "SOAL:ALEA" },
  { key: "kroll-uk", text: "Kroll UK" },
  { key: "not-applicable", text: "Not Applicable" },
];

export const payRateBillRateChangeOptions: IDropdownOption[] = [
  { key: "Pay Rate change", text: "Pay Rate change" },
  { key: "Bill Rate change", text: "Bill Rate change" },
  {
    key: "Bill Rate and Pay Rate change",
    text: "Bill Rate and Pay Rate change",
  },
];
