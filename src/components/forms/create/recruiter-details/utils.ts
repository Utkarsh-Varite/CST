import * as Yup from "yup";

import type { IDropdownOption } from "@fluentui/react";
import type { StandaloneContext } from "../../../CandidateStatusTracker";

export const dropdownOptions: IDropdownOption[] = [
  { key: "option1", text: "Option 1" },
  { key: "option2", text: "Option 2" },
  { key: "option3", text: "Option 3" },
  { key: "option4", text: "Option 4" },
];

export const sourceDropDownOptions: IDropdownOption[] = [
  { key: "Career Builder", text: "Career Builder" },
  { key: "Ceipal", text: "Ceipal" },
  { key: "Job Diva", text: "Job Diva" },
  { key: "Dice", text: "Dice" },
  { key: "Glassdoor", text: "Glassdoor" },
  { key: "Indeed", text: "Indeed" },
  { key: "LinkedIn Personal", text: "LinkedIn Personal" },
  { key: "LinkedIn Premium", text: "LinkedIn Premium" },
  { key: "Monster", text: "Monster" },
  { key: "Others", text: "Others" },
  { key: "Referral", text: "Referral" },
  { key: "Varite.com", text: "Varite.com" },
];

export const validationSchema = Yup.object({
  hiringManager: Yup.string().required("Hiring Manager is required"),
  recruiterName: Yup.string().required("Recruiter Name is required"),
  secondaryRecruiterName: Yup.string().required(
    "Secondary Recruiter's Name is required"
  ),
  teamLead: Yup.string().required("Team Lead is required"),
  accountManagerName: Yup.string().required(
    "Account Manager's Name is required"
  ),
  associateAccountManagerName: Yup.string().required(
    "Associate Account Manager's Name is required"
  ),
  sharedServiceManagerName: Yup.string().required(
    "Shared Service Manager's Name is required"
  ),
  secondaryAccountManagerName: Yup.string().required(
    "Secondary Account Manager's Name is required"
  ),
  deliveryDirectorName: Yup.string().required(
    "Delivery Director Name is required"
  ),
  deliveryDirectorId: Yup.string().required("Delivery Director ID is required"),
  sourceWebsite: Yup.string().required("Source Website is required"),
  vendorEmailAddress: Yup.string()
    .email("Invalid email address")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Invalid Email"
    )
    .required("Vendor Email Address is required"),
  vendorNameAndDetails: Yup.string().required(
    "Vendor Name and Details is required"
  ),
});

export interface IMyComponentProps {
  context: StandaloneContext;
}
