import type { StandaloneContext } from "../../CandidateStatusTracker";
import * as Yup from "yup";

// Define the form values type :COMBINED
export type CreateFormValues = {
  consultantFirstName: string;
  consultantMiddleName: string;
  consultantLastName: string;
  suffix: string;
  consultantFullName: string;
  consultantGender: string;
  phoneNumber: string;
  email: string;
  homeAddressStreet: string;
  homeAddressCity: number | null;
  homeAddressStateOrProvince: number | null;
  homeAddressCountry: number | null;
  homeAddressPostalCode: string;

  workCity: number | null; //As it is IWorkCity
  workLocation: string;
  workState: number | null; //As it is IStateId
  workCountry: number | null; //As it is iWorkCountry

  comments: string;

  hiringManager: number | null; //As it is IHiringManagerId
  recruiterName: number | null;
  secondaryRecruiterName: number | null;
  teamLead: number | null;
  accountManagerName: number | null;
  associateAccountManagerName: number | null;
  sharedServiceManagerName: number | null;
  secondaryAccountManagerName: number | null;
  deliveryDirectorName: string;
  deliveryDirectorId: number | null;
  sourceWebsite: string;
  vendorEmailAddress: string;
  vendorNameAndDetails: string;
  accountManagerFirstName: string | null;
  accountManagerLastName: string | null;

  //Job-Details
  exemptStatus: string;
  typeOfPlacement: string;
  employeeStatus: number | null;
  clientName: number | null; //As it is IClientId
  // MSP: string;
  jobTitle: string;
  clientSubVendor: string;
  jobDuties: string;
  division: string;
  payRateType: string;
  contractDurationMonths: number | null;
  noOfHoursOnThisPosition: number | null;
  tentativeJoiningDate: Date | null;
  proposedEndDate: Date | null;
  payrollSchedule: string;
  typeOfEngagement: string;
  workAuthorizationStatus: string;
  workAuthorizationExpirationDate: Date | null;
  requirementID: string;
  contingentWorkerID: string;
  requirementClassification: string;

  payRate: number | null;
  payRateDuration: number | null;
  payRateCurrency: number | null;

  billRate: number | null;
  billRateDuration: number | null;
  billRateCurrency: number | null;

  overtimeBillRate: number | null;
  overtimeBillRateDuration: number | null;
  overtimeBillRateCurrency: number | null;

  overtimePayRate: number | null;
  overtimePayRateDuration: number | null;
  overtimePayRateCurrency: number | null;

  doubleOvertimePayRate: number | null;
  doubleOvertimePayRateDuration: number | null;
  doubleOvertimePayRateCurrency: number | null;

  doubleOvertimeBillRate: number | null;
  doubleOvertimeBillRateDuration: number | null;
  doubleOvertimeBillRateCurrency: number | null;

  perDiemCost: number | null;
  perDiemCostDuration: number | null;
  perDiemCostCurrency: number | null;

  nonBillableBonus: number | null;
  nonBillableBonusDuration: number | null;
  nonBillableBonusCurrency: number | null;

  //Joining Details
  dateOfJoining: Date | null;
  timesheetAccess: string;
  medicalBenefits: string;
  vendorCOIrequired: string;
  vendorCOIexpiration: Date | null;
  vendorCOIexpirationDateField: Date | null;
  postJoiningConsultant: Date | null;

  //OnBoarding Details
  onboardingSpecialist: number | null;
  operationsManager: number | null;
  //initialEmailSent: string,
  identityverification: string; //dropdown
  backgroundCheckPortalInvitation: string; //dropdown
  backgroundCheckStatus: string; //dropdown
  variteAssetAssigned: string; //dropdown
  eSConsultantPacket: string; //textfield
  eSStateDocuments: string; //textfield
  eSClientPacket: string; //textfield
  adobeSendClientDocuments: string; //textfield
  adobeSend401kPacket: string; //dropdown
  //consultantPacketSigned: string,
  clientPacketupdatedtoClientPortal: string; //dropdown
  kantolaTraining: string; //dropdown
  i9Scheduling: string; //dropdown
  i9VerificationStatus: string; //dropdown
  //i9EVerification: string,
  checklistCreated: string; //dropdown
  firstDayInstructions: string;

  //New fields for Pay Rate / Bill Rate Change : can be removed check
  payRateBillRateChange: string;
  payRateEffectiveDate: Date | null;
  billRateEffectiveDate: Date | null;
  perDiemEffectiveDate: Date | null;
  nonBillableEffectiveDate: Date | null;

  newPayRateDuration: number | null;
  newPayRateCurrency: number | null;
  newPayRate: number | null;

  newOvertimePayRateDuration: number | null;
  newOvertimePayRateCurrency: number | null;
  newOvertimePayRate: number | null;

  newDoubleOvertimePayRateDuration: number | null;
  newDoubleOvertimePayRateCurrency: number | null;
  newDoubleOvertimePayRate: number | null;

  newBillRateDuration: number | null;
  newBillRateCurrency: number | null;
  newBillRate: number | null;

  newOvertimeBillRateDuration: number | null;
  newOvertimeBillRateCurrency: number | null;
  newOvertimeBillRate: number | null;

  newDoubleOvertimeBillRateDuration: number | null;
  newDoubleOvertimeBillRateCurrency: number | null;
  newDoubleOvertimeBillRate: number | null;

  //New Fields For edit Adjustment for power app

  //benefits
  benefitCost: string;
  enrollmentStatus: string;
  employeeEngagement: string;
  enrollment401kDate: Date | null;
  employeeEngagementDate: Date | null;

  //finance tab
  financeSpecialist: number | null;
  createAddEmployeeQB: string;
  createUploadPaylocityFile: string;
  paylocityLoginInstructions: string;
  verifyWorkLocationSetup: string;
  reviewTaxSetupPaylocity: string;
  reviewSickHoursSetupPaylocity: string;

  //offboarding
  offboardingspecialist: number | null;
  DateofTermination: Date | null;
  reasonForTermination: string;
  separationDocument: string;
  assetReturn: string;
  medicalBenefitTermination: string;
  k401Distribution: string;
  finalPaycheck: string;
  finalPaycheckDate: Date | null;
  kantolaTrainings: string;
  moveConsultantFolder: string;
  fileAttachment: Array<Object> | null;
};

// Combine all initial values
export const CreateFormInitialValues = {
  consultantFirstName: "", //Done
  consultantMiddleName: "", //Done
  consultantLastName: "", //Done
  suffix: "", //Done
  consultantFullName: "", //Done
  consultantGender: "", //Done
  phoneNumber: "",
  email: "", //Done
  homeAddressStreet: "",
  homeAddressCity: null,
  homeAddressStateOrProvince: null,
  homeAddressCountry: null,
  homeAddressPostalCode: "",
  workCity: null,
  workLocation: "",
  workState: null,
  workCountry: null,

  hiringManager: null,
  recruiterName: null,
  secondaryRecruiterName: null,
  teamLead: null,
  accountManagerName: null,
  associateAccountManagerName: null,
  sharedServiceManagerName: null,
  secondaryAccountManagerName: null,
  deliveryDirectorName: "",
  deliveryDirectorId: null,
  sourceWebsite: "",
  vendorEmailAddress: "",
  vendorNameAndDetails: "",
  accountManagerFirstName: "",
  accountManagerLastName: "",

  comments: "",

  //change to form values
  exemptStatus: "", //dropdown
  typeOfPlacement: "", //dropdown
  employeeStatus: null, //dropdown
  clientName: null, //dropdown
  // MSP: "", //dropdown
  jobTitle: "",
  clientSubVendor: "", //dropdown
  jobDuties: "",
  division: "", //dropdown
  payRateType: "", //dropdown
  contractDurationMonths: null,
  noOfHoursOnThisPosition: null, //dropdown
  tentativeJoiningDate: null, //date
  proposedEndDate: null, //date
  payrollSchedule: "", //dropdown
  typeOfEngagement: "", //dropdown
  workAuthorizationStatus: "", //dropdown
  workAuthorizationExpirationDate: null, //date
  requirementID: "", //textfield
  contingentWorkerID: "", //textfield
  requirementClassification: "", //dropdown

  payRate: null,
  payRateDuration: null,
  payRateCurrency: null,

  billRate: null,
  billRateDuration: null,
  billRateCurrency: null,

  overtimeBillRate: null,
  overtimeBillRateDuration: null,
  overtimeBillRateCurrency: null,

  overtimePayRate: null,
  overtimePayRateDuration: null,
  overtimePayRateCurrency: null,

  doubleOvertimePayRate: null,
  doubleOvertimePayRateDuration: null,
  doubleOvertimePayRateCurrency: null,

  doubleOvertimeBillRate: null,
  doubleOvertimeBillRateDuration: null,
  doubleOvertimeBillRateCurrency: null,

  perDiemCost: 0,
  perDiemCostDuration: null,
  perDiemCostCurrency: null,

  nonBillableBonus: 0,
  nonBillableBonusDuration: null,
  nonBillableBonusCurrency: null,

  //Joining Details
  dateOfJoining: null, //
  timesheetAccess: "", //
  medicalBenefits: "", //
  vendorCOIrequired: "", //
  vendorCOIexpiration: null, //
  vendorCOIexpirationDateField: null, //
  postJoiningConsultant: null,

  //OnBoarding Details
  onboardingSpecialist: null,
  operationsManager: null,
  //initialEmailSent: "",
  identityverification: "", //dropdown
  backgroundCheckPortalInvitation: "", //dropdown
  backgroundCheckStatus: "", //dropdown
  variteAssetAssigned: "", //dropdown
  eSConsultantPacket: "", //textfield
  eSStateDocuments: "", //textfield
  eSClientPacket: "", //textfield
  adobeSendClientDocuments: "", //textfield
  adobeSend401kPacket: "", //dropdown
  //consultantPacketSigned: "",
  clientPacketupdatedtoClientPortal: "", //dropdown
  kantolaTraining: "", //dropdown
  i9Scheduling: "", //dropdown
  i9VerificationStatus: "", //dropdown
  //i9EVerification: "",
  checklistCreated: "", //dropdown
  firstDayInstructions: "",
  fileAttachment: [],
};

// Combine all validations
export const CreateFormValidationSchema = Yup.object().shape({
  //Candidate Details
  consultantFirstName: Yup.string().required("First name is required"),
  consultantMiddleName: Yup.string(),
  consultantLastName: Yup.string().required("Last name is required"),
  suffix: Yup.string(),
  consultantFullName: Yup.string().required("Full name is required"),
  consultantGender: Yup.string().required("Gender is required"),
  // phoneNumber: Yup.string()
  //   .matches(
  //     /^\(\d{3}\)\d{3}-\d{4}$/,
  //     "Phone number must be in the format (XXX)XXX-XXXX"
  //   )
  //   .required("Phone number is required"),

  phoneNumber: Yup.string()
    .when("homeAddressCountry", {
      is: null, // No Value
      then: (schema) =>
        schema
          .matches(
            /^\(\d{3}\)\d{3}-\d{4}$/,
            "Please select home address country first"
          )
          .required("Phone number is required"),
    })
    .when("homeAddressCountry", {
      is: 1, // Canada
      then: (schema) =>
        schema
          .matches(
            /^\(\d{3}\)\d{3}-\d{4}$/,
            "Canada phone must be in (XXX)XXX-XXXX format"
          )
          .required("Phone number is required"),
    })
    .when("homeAddressCountry", {
      is: 3, // USA
      then: (schema) =>
        schema
          .matches(
            /^\(\d{3}\)\d{3}-\d{4}$/,
            "USA phone must be in (XXX)XXX-XXXX format"
          )
          .required("Phone number is required"),
    })
    .when("homeAddressCountry", {
      is: 2, // UK
      then: (schema) =>
        schema
          .matches(
            /^\+44\s?\d{4}\s?\d{6}$/,
            "UK phone must be in +44 XXXX XXXXXX format"
          )
          .required("Phone number is required"),
    }),

  email: Yup.string()
    .email("Invalid email")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Invalid Email"
    )
    .required("Email is required"),
  homeAddressStreet: Yup.string().required("Home address street is required"),

  homeAddressCity: Yup.number()
    .typeError("Home address city is required")
    .required("Home address city is required"),
  homeAddressStateOrProvince: Yup.number()
    .typeError("Home address state is required")
    .required("Home address state is required"),
  homeAddressCountry: Yup.number()
    .typeError("Home address country is required")
    .required("Home address country is required"),

  homeAddressPostalCode: Yup.string()
    .when("homeAddressCountry", {
      is: null, // No Value
      then: (schema) =>
        schema
          .matches(
            /^\(\d{3}\)\d{3}-\d{4}$/,
            "Please select home address country first"
          )
          .required("Postal code is required"),
    })
    .when("homeAddressCountry", {
      is: 1, // Canada
      then: (schema) =>
        schema
          .matches(
            /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
            "Postal code must be a valid Canadian format (e.g., K1A 0B1)"
          )
          .required("Postal code is required"),
    })
    .when("homeAddressCountry", {
      is: 2, // UK
      then: (schema) =>
        schema
          .matches(
            /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/,
            "Postal code must be a valid UK format (e.g., SW1A 1AA)"
          )
          .required("Postal code is required"),
    })
    .when("homeAddressCountry", {
      is: 3, // USA
      then: (schema) =>
        schema
          .matches(
            /^\d{5}(-\d{4})?$/,
            "Postal code must be a valid US format (e.g., 12345 or 12345-6789)"
          )
          .required("Postal code is required"),
    }),
  workCity: Yup.number()
    .typeError("Work City is required")
    .required("Work city is required"),
  workLocation: Yup.string().required("Work location is required"),
  workState: Yup.number()
    .typeError("Work State is required")
    .required("Work state is required"),
  workCountry: Yup.number()
    .typeError("Work Country is required")
    .required("Work country is required"),

  //Recruiter Details
  hiringManager: Yup.number().required("Hiring Manager is required"),
  recruiterName: Yup.number().required("Recruiter Name is required"),
  // secondaryRecruiterName: Yup.number().required(
  //   "Secondary Recruiter's Name is required"
  // ),
  // teamLead: Yup.number().required("Team Lead is required"),
  accountManagerName: Yup.number().required(
    "Account Manager's Name is required"
  ),
  // associateAccountManagerName: Yup.number().required(
  //   "Associate Account Manager's Name is required"
  // ),
  // sharedServiceManagerName: Yup.number().required(
  //   "Shared Service Manager's Name is required"
  // ),
  // secondaryAccountManagerName: Yup.number().required(
  //   "Secondary Account Manager's Name is required"
  // ),
  deliveryDirectorName: Yup.string().required(
    "Delivery Director Name is required"
  ),
  deliveryDirectorId: Yup.number().required("Delivery Director ID is required"),
  sourceWebsite: Yup.string().required("Source Website is required"),
  vendorEmailAddress: Yup.string().email("Invalid email address"),
  // vendorNameAndDetails: Yup.string().required(
  //   "Vendor Name and Details is required"
  // ),

  //comments
  // comments: Yup.string()
  //   .required("Comments are required")
  //   .max(500, "Comments cannot exceed 500 characters"),

  //Job Details
  exemptStatus: Yup.string().required("Exempt status is required"),
  typeOfPlacement: Yup.string().required("Type of placement is required"),
  employeeStatus: Yup.number()
    .typeError("Employee status is required")
    .required("Employee status is required"),
  clientName: Yup.number().required("Client name is required"),
  // MSP: Yup.string().required("MSP is required"),
  jobTitle: Yup.string().required("Job title is required"),
  clientSubVendor: Yup.string().required("Client sub-vendor is required"),
  jobDuties: Yup.string()
    .required("Job duties are required")
    .min(5, "Job duties must be at least 5 characters")
    .max(256, "Job duties cannot exceed 256 characters"),
  division: Yup.string().required("Division is required"),
  payRateType: Yup.string().required("Pay rate type is required"),
  contractDurationMonths: Yup.number().required(
    "Contract duration is required"
  ),
  noOfHoursOnThisPosition: Yup.number().required("Number of hours is required"),
  tentativeJoiningDate: Yup.date().required(
    "Tentative joining date is required"
  ),
  proposedEndDate: Yup.date().required("Proposed end date is required"),
  payrollSchedule: Yup.string().required("Payroll schedule is required"),
  typeOfEngagement: Yup.string().required("Type of engagement is required"),
  workAuthorizationStatus: Yup.string().required(
    "Work authorization status is required"
  ),
  workAuthorizationExpirationDate: Yup.date().when("workAuthorizationStatus", {
    is: (val?: string) =>
      !!val &&
      [
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
      ].indexOf(val) !== -1,
    then: (schema) =>
      schema.required("Work authorization expiration date is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  requirementID: Yup.string().required("Requirement ID is required"),
  // contingentWorkerID: Yup.string().required("Contingent worker ID is required"),
  requirementClassification: Yup.string().required(
    "Requirement classification is required"
  ),

  payRate: Yup.number()
    .required("Pay rate is required")
    .typeError("Pay rate is required"), //Ig have to give this
  payRateDuration: Yup.number().required("Pay rate duration is required"),
  payRateCurrency: Yup.number().required("Pay rate currency is required"),

  billRate: Yup.number().required("Bill rate is required"),
  billRateDuration: Yup.number().required("Bill rate duration is required"),
  billRateCurrency: Yup.number().required("Bill rate currency is required"),

  overtimeBillRate: Yup.number().required("Overtime bill rate is required"),
  overtimeBillRateDuration: Yup.number().required(
    "Overtime bill rate duration is required"
  ),
  overtimeBillRateCurrency: Yup.number().required(
    "Overtime bill rate currency is required"
  ),

  overtimePayRate: Yup.number().required("Overtime pay rate is required"),
  overtimePayRateDuration: Yup.number().required(
    "Overtime pay rate duration is required"
  ),
  overtimePayRateCurrency: Yup.number().required(
    //It casts but still
    "Overtime pay rate currency is required"
  ),

  doubleOvertimePayRate: Yup.number().required(
    "Double overtime pay rate is required"
  ),
  doubleOvertimePayRateDuration: Yup.number().required(
    "Double overtime pay rate duration is required"
  ),
  doubleOvertimePayRateCurrency: Yup.number().required(
    "Double overtime pay rate currency is required"
  ),

  doubleOvertimeBillRate: Yup.number().required(
    "Double overtime bill rate is required"
  ),
  doubleOvertimeBillRateDuration: Yup.number().required(
    "Double overtime bill rate duration is required"
  ),
  doubleOvertimeBillRateCurrency: Yup.number().required(
    "Double overtime bill rate currency is required"
  ),

  perDiemCost: Yup.number().required("Per diem cost is required"),
  perDiemCostDuration: Yup.number().required(
    "Per diem cost duration is required"
  ),
  perDiemCostCurrency: Yup.number().required(
    "Per diem cost currency is required"
  ),

  nonBillableBonus: Yup.number().required("Non-billable bonus is required"),
  nonBillableBonusDuration: Yup.number().required(
    "Non-billable bonus duration is required"
  ),
  nonBillableBonusCurrency: Yup.number().required(
    "Non-billable bonus currency is required"
  ),
  accountManagerFirstName: Yup.string().nullable(),
  accountManagerLastName: Yup.string().nullable(),

  //Joining Details
  // dateOfJoining: Yup.date().required("Date of joining is required"),
  // timesheetAccess: Yup.string().required("Timesheet access is required"),
  // medicalBenefits: Yup.string().required("Medical benefits is required"),
  vendorCOIrequired: Yup.string().required("Vendor COI required is required"),
  // vendorCOIexpiration: Yup.date().required("Vendor COI expiration is required"),
  vendorCOIexpiration: Yup.date().when("vendorCOIrequired", {
    is: "Yes", // or true if it's a boolean
    then: (schema) => schema.required("Vendor COI expiration is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // vendorCOIexpirationDateField: Yup.date().required(
  //   "Vendor COI expiration date field is required"
  // ),
  // postJoiningConsultant: Yup.date().required(
  //   "Post joining consultant is required"
  // ),

  //OnBoarding Details
  // onboardingSpecialist: Yup.number().required(
  //   //TODO : id
  //   "Onboarding Specialist is required"
  // ),
  // operationsManager: Yup.number().required("Operations Manager is required"), //TODO : id
  // identityverification: Yup.string().required(
  //   "Identity verification is required"
  // ),
  // backgroundCheckPortalInvitation: Yup.string().required(
  //   "Background check portal invitation is required"
  // ),
  // backgroundCheckStatus: Yup.string().required(
  //   "Background check status is required"
  // ),
  // eSConsultantPacket: Yup.string().required("ES Consultant Packet is required"),
  // eSStateDocuments: Yup.string().required("ES State Documents is required"),
  // eSClientPacket: Yup.string().required("ES Client Packet is required"),
  // adobeSendClientDocuments: Yup.string().required(
  //   "Adobe Send Client Documents is required"
  // ),
  // adobeSend401kPacket: Yup.string().required(
  //   "Adobe Send 401k Packet is required"
  // ),
  // clientPacketupdatedtoClientPortal: Yup.string().required(
  //   "Client Packet updated to Client Portal is required"
  // ),
  // kantolaTraining: Yup.string().required("Kantola Training is required"),
  // i9Scheduling: Yup.string().required("I9 Scheduling is required"),
  // i9VerificationStatus: Yup.string().required(
  //   "I9 Verification Status is required"
  // ),
  // checklistCreated: Yup.string().required("Checklist Created is required"),
  // firstDayInstructions: Yup.string().required(
  //   "First Day Instructions are required"
  // ),
  fileAttachment: Yup.array().nullable(),
});

//Other utility functions can be added here as needed
export type SubHeaderItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

export interface CstViewProps {
  context: StandaloneContext;
}

export type IStateOption = {
  key: number; // iStateId
  text: string; // cStateName
  countryId: number; // iCountryId
};

export type IHiringManagerOption = {
  key: number; // iHiringManagerId
  text: string; // cHiringManagerName
  iVariteHiringMangerID: number;
};

export type IClientOption = {
  key: number; // iClientId
  text: string; // cClientName
  iDeliveryDirectorName: string | null;
  iDeliveryDirectorId: number | null;
  iVariteClientId: number;
};

export type ICurrencyOption = {
  key: number; // iCurrencyId
  text: string; // cCurrencyName
};

export type IEmployeeStatusOption = {
  key: number; // iEmployeeStatusId
  text: string; // cEmployeeStatus
};

export type IRateFrequencyOption = {
  key: number; // iRateFrequencyType
  text: string; // cRateFrequencyTypeName
};

export type Country = {
  iCountryId: number;
  cCountryName: string;
};
export type State = {
  iStateId: number; // Unique ID for the state
  cStateName: string; // Full name of the state
  cStateShortName: string; // Short name (like "AL")
  iCountryId: number; // The parent country ID
};

export type City = {
  iCityid: number; // Unique ID for the city
  cCityName: string; // City name
  iStateId: number; // Parent state ID
  iCountryId: number; // Parent country ID
};
