import type { IDropdownOption } from "@fluentui/react";

// Move Consultant Folder to Terminated
export const moveFolderOptions: IDropdownOption[] = [
  { key: "Pending", text: "Pending" },
  { key: "Done", text: "Done" },
];

// Kantola Trainings
export const kantolaTrainingsOptions: IDropdownOption[] = [
  { key: "Archived", text: "Archived" },
  { key: "Not-Archived", text: "Not Archived" },
];

// 401K Distribution
export const k401DistributionOptions: IDropdownOption[] = [
  { key: "Rollover Instructions Sent", text: "Rollover Instructions Sent" },
  { key: "Forced Cash Out", text: "Forced Cash Out" },
  { key: "Not Enrolled", text: "Not Enrolled" },
  { key: "Non-W2", text: "Non-W2" },
];

export const yesNo: IDropdownOption[] = [
  { key: "Yes", text: "Yes" },
  { key: "No", text: "No" },
];

// Separation Document
export const separationDocumentOptions: IDropdownOption[] = [
  { key: "Pending", text: "Pending" },
  { key: "Sent", text: "Sent" },
  { key: "Not Required", text: "Not Required" },
];

// Reason for Termination
export const reasonForTerminationOptions: IDropdownOption[] = [
  { key: "Select", text: "Select" },
  { key: "Voluntary – Resigned", text: "Voluntary – Resigned" },
  {
    key: "Voluntary – Client converted fulltime",
    text: "Voluntary – Client converted fulltime",
  },
  {
    key: "Involuntary – Layoff/Lack of work",
    text: "Involuntary – Layoff/Lack of work",
  },
  {
    key: "Involuntary – Termination due to Non-Performance",
    text: "Involuntary – Termination due to Non-Performance",
  },
  {
    key: "Involuntary – Background Check Failed",
    text: "Involuntary – Background Check Failed",
  },
  {
    key: "Involuntary – Misconduct/Fired",
    text: "Involuntary – Misconduct/Fired",
  },
  { key: "Close FT Employee", text: "Close FT Employee" },
];

// Asset Return
export const assetReturnOptions: IDropdownOption[] = [
  { key: "Yes", text: "Yes" },
  { key: "No", text: "No" },
  { key: "Converted FT with the client", text: "Converted FT with the client" },
  { key: "Using Varite Laptop", text: "Using Varite Laptop" },
  { key: "Using personal laptop", text: "Using personal laptop" },
  {
    key: "Client Handels equipment return",
    text: "Client Handels equipment return",
  },
];
