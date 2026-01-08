import React, { useEffect, useState } from "react";
import { CandidateDetails } from "../forms/create/candidate-details";
import { RecruiterDetails } from "../forms/create/recruiter-details";
import { Comments } from "../forms/create/comments";
import { Formik, Form } from "formik";
import type { FormikHelpers, FormikProps } from "formik";
import { Save20Regular, HomeFilled } from "@fluentui/react-icons";
import FormikEffect from "../helpers/formik-effect";
import { PrimaryButton } from "@fluentui/react";
import type { IDropdownOption } from "@fluentui/react";
import dayjs from "dayjs";
import type {
  CreateFormValues,
  IClientOption,
  ICurrencyOption,
  IEmployeeStatusOption,
  IHiringManagerOption,
  IRateFrequencyOption,
  SubHeaderItem,
  CstViewProps,
  Country,
  State,
  City,
} from "./utils/create-utils";
import {
  CreateFormValidationSchema,
  CreateFormInitialValues,
} from "./utils/create-utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { JobDetails } from "../forms/create/job-details";
import { JoiningDetails } from "../forms/create/joining-details";
import { Onboarding } from "../forms/create/onboarding";
import { EditFormValidationSchema } from "./utils/edit-utils";
import type { EditFormValues } from "./utils/edit-utils";
import { Benefits } from "../forms/edit/benefits";
import { FinanceChecklist } from "../forms/edit/finance-checklist";
import { History } from "./history";
import { Offboarding } from "../forms/edit/off-boarding";
import ApiClient from "../../services/ApiClient";
// import { payRateTypeOptions } from "../forms/create/job-details/utils";
import utc from "dayjs/plugin/utc";
import Loader from "../commons/loader";
dayjs.extend(utc);
//import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
// import { WebPartContext } from "@microsoft/sp-webpart-base";
import { buildChangeLogString } from "./helpers";

export const CstView: React.FC<CstViewProps> = ({ context }) => {
  // context: WebPartContext;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const consultantId = searchParams.get("consultantId");
  //Edit mode if consultantId is present only and not view : /cst-view?consultantId=${params.row.id}
  const isViewMode = searchParams.get("view") === "true";
  //View mode if view is true and consultantId is present : /cst-view?consultantId=${params.row.id}&view=true
  //Create Mode  none is present: /cst-view
  const [EditFormInitialValues, setEditFormInitialValues] =
    useState<EditFormValues | null>(null);

  const [activeTab, setActiveTab] = useState("candidateDetails");

  // const [stateOptions, setStateOptions] = useState<IStateOption[]>([]);

  const [hiringManagerOptions, setHiringManagerOptions] = useState<
    IHiringManagerOption[]
  >([]);
  const [currencyOptions, setCurrencyOptions] = useState<ICurrencyOption[]>([]);

  const [clientOptions, setClientOptions] = useState<IClientOption[]>([]);

  const [employeeStatusOptions, setEmployeeStatusOptions] = useState<
    IEmployeeStatusOption[]
  >([]);

  const [rateFrequencyOptions, setRateFrequencyOptions] = useState<
    IRateFrequencyOption[]
  >([]);

  const [countries, setCountries] = useState<IDropdownOption[]>([]); //Work
  const [states, setStates] = useState<IDropdownOption[]>([]); //Work
  const [cities, setCities] = useState<IDropdownOption[]>([]); //Work

  const [homeCountries, setHomeCountries] = useState<IDropdownOption[]>([]); //Home
  const [homeStates, setHomeStates] = useState<IDropdownOption[]>([]); //Home
  const [homeCities, setHomeCities] = useState<IDropdownOption[]>([]); //Home

  //Recruiter Emails
  const [recruiterNameEmail, setRecruiterNameEmail] = useState<string | null>(
    null
  );
  const [secRecruiterNameEmail, setSecRecruiterNameEmail] = useState<
    string | null
  >(null);
  const [teamLeadNameEmail, setTeamLeadNameEmail] = useState<string | null>(
    null
  );
  const [accountManagerNameEmail, setAccountManagerNameEmail] = useState<
    string | null
  >(null);

  const [
    associateAccountManagerNameEmail,
    setAssociateAccountManagerNameEmail,
  ] = useState<string | null>(null);

  const [sharedServiceManagerNameEmail, setSharedServiceManagerNameEmail] =
    useState<string | null>(null);

  const [secAccountManagerNameEmail, setSecAccountManagerNameEmail] = useState<
    string | null
  >(null);

  //Onboarding Emails
  const [onboardingSpeNameEmail, setOnboardingSpeNameEmail] = useState<
    string | null
  >(null);
  const [operationManagerNameEmail, setOperationManagerNameEmail] = useState<
    string | null
  >(null);

  //Finance Email

  const [financeSpecialistNameEmail, setFinanceSpecialistNameEmail] = useState<
    string | null
  >(null);

  //Offboarding Email
  const [offboardignSpeNameEmail, setOffboardignSpeNameEmail] = useState<
    string | null
  >(null);

  const [createdBy, setCreatedBy] = useState<{ id: number; email: string }>({
    id: 0,
    email: "",
  });

  const [variteEmployeeId, setVariteEmployeeId] = useState<number | null>(null);

  /** appointment letter trigger */
  let isButtonClicked = false;

  async function sendAppointmentLetter(): Promise<void> {
    if (!isButtonClicked) {
      isButtonClicked = true;

      try {
        //const itemId = new URLSearchParams(window.location.search).get("ID");
        const url = `https://varite.sharepoint.com/usa/USOnboarding/_api/web/lists/GetByTitle('Candidate Status Tracker')/items(${variteEmployeeId})`;

        const response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json;odata=verbose" },
        });

        const data = await response.json();

        if (data.d.Sent_x0020_Adobe_x0020_Kit !== "Yes") {
          await SendAdobeKit(variteEmployeeId);
          //alert("Paper work initiated sucessfully!!!");
        } else {
          alert(
            "Paperwork was already initiated and is in progress!! Please reach out to the Operations Manager if this needs to be sent again.!!"
          );
        }
        // else if (data.d.Sent_x0020_Adobe_x0020_Kit === "Sent") {
        //   const userConfirmed = confirm(
        //     "Paperwork already sent, do you want to send again?"
        //   );
        //   if (userConfirmed) {
        //     await SendAdobeKit(variteEmployeeId);
        //     alert("Paper work initiated sucessfully!!!");
        //   } else {
        //     console.log("User canceled. Stopping...");
        //   }
        // }
      } catch (ex) {
        console.error(ex);
      }
    } else {
      alert(
        "Paperwork was already initiated and is in progress!! Please reach out to the Operations Manager if this needs to be sent again.!!"
      );
    }
  }

  const SendAdobeKit = async (variteEmployeeId: number | null) => {
    if (!variteEmployeeId) {
      alert("Employee ID is missing!");
      return;
    }

    const siteUrl = "https://varite.sharepoint.com/usa/USOnboarding"; // Adjust if needed

    // 1️⃣ Get form digest value for SharePoint authentication
    const digestResponse = await fetch(`${siteUrl}/_api/contextinfo`, {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
      },
    });

    const digestData = await digestResponse.json();
    const requestDigest = digestData.d.GetContextWebInformation.FormDigestValue;

    // 2️⃣ Prepare payload
    const body = JSON.stringify({
      __metadata: {
        type: "SP.Data.Candidate_x0020_Status_x0020_TrackerListItem",
      },
      Sent_x0020_Adobe_x0020_Kit: "Sending",
    });

    try {
      // 3️⃣ Make the update request
      const response = await fetch(
        `${siteUrl}/_api/web/lists/GetByTitle('Candidate Status Tracker')/items(${variteEmployeeId})`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
            "X-RequestDigest": requestDigest, // Required for authentication
          },
          body,
        }
      );

      // 4️⃣ Handle response
      if (response.ok) {
        console.log("Paper work initiated successfully");
        alert("Paper work initiated successfully!");
      } else {
        const errorResponse = await response.json();
        console.error(
          "Error updating candidate:",
          errorResponse.error.message.value
        );
        alert("Error: " + errorResponse.error.message.value);
      }
    } catch (err) {
      console.error("Exception updating candidate:", err);
      alert("Exception: " + JSON.stringify(err));
    }
  };

  /* Initial Email Trigger */
  let InitialButtonClicked = false;

  async function sendInitialEmail(): Promise<void> {
    if (!InitialButtonClicked) {
      InitialButtonClicked = true;

      try {
        const url = `https://varite.sharepoint.com/usa/USOnboarding/_api/web/lists/GetByTitle('Candidate Status Tracker')/items(${variteEmployeeId})`;
        const response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json;odata=verbose" },
        });

        const data = await response.json();

        if (data.d.Sent_x0020_Initial_x0020_Email == null) {
          await sendInitialEmailInternal(variteEmployeeId);
          alert("Initial Email Sent Successfully!!!");
        } else if (data.d.Sent_x0020_Initial_x0020_Email === "Sent") {
          const userConfirmed = confirm(
            "Initial Email already sent, do you want to send again?"
          );
          if (userConfirmed) {
            await sendInitialEmailInternal(variteEmployeeId);
            alert("Initial Email Sent Successfully!!!");
          } else {
            console.log("User canceled. Stopping...");
          }
        }
      } catch (ex) {
        console.error(ex);
        alert("Error sending initial email.");
      }
    } else {
      alert("Initial Email sending is in progress!!!");
    }
  }

  const sendInitialEmailInternal = async (variteEmployeeId: number | null) => {
    if (!variteEmployeeId) return;

    const siteUrl = "https://varite.sharepoint.com/usa/USOnboarding";

    try {
      // 1️⃣ Get form digest
      const digestResponse = await fetch(`${siteUrl}/_api/contextinfo`, {
        method: "POST",
        headers: { Accept: "application/json;odata=verbose" },
      });
      const digestData = await digestResponse.json();
      const requestDigest =
        digestData.d.GetContextWebInformation.FormDigestValue;

      // 2️⃣ Prepare payload
      const body = JSON.stringify({
        __metadata: {
          type: "SP.Data.Candidate_x0020_Status_x0020_TrackerListItem",
        },
        Sent_x0020_Initial_x0020_Email: "Yes",
      });

      // 3️⃣ Update item
      const response = await fetch(
        `${siteUrl}/_api/web/lists/GetByTitle('Candidate Status Tracker')/items(${variteEmployeeId})`,
        {
          method: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
            "X-RequestDigest": requestDigest,
          },
          body,
        }
      );

      if (response.ok) {
        console.log("Initial Email Sending in Progress");
      } else {
        const errorResponse = await response.json();
        console.error(
          "Error updating candidate:",
          errorResponse.error.message.value
        );
        alert("Error: " + errorResponse.error.message.value);
      }
    } catch (err) {
      console.error("Exception updating candidate:", err);
      alert("Exception: " + JSON.stringify(err));
    }
  };

  const today = new Date();

  //BeforeStateUsers when Form Loads
  const [beforeOnboardingSpe, setbeforeOnboardingSpe] = useState<string>("");
  const [beforeOperationsMan, setbeforeOperationsMan] = useState<string>("");
  const [beforeFinanceSpe, setbeforeFinanceSpe] = useState<string>("");
  const [beforeOffboardingSpe, setbeforOffboardingSpe] = useState<string>("");
  const [beforeRecruiterName, setBeforeRecruiterName] = useState<string>("");
  const [beforeSecondaryRecruiterName, setBeforeSecondaryRecruiterName] =
    useState<string>("");
  const [beforeTeamLead, setBeforeTeamLead] = useState<string>("");
  const [beforeAccountManagerName, setBeforeAccountManagerName] =
    useState<string>("");
  const [
    beforeAssociateAccountManagerName,
    setBeforeAssociateAccountManagerName,
  ] = useState<string>("");
  const [beforeSharedServiceManagerName, setBeforeSharedServiceManagerName] =
    useState<string>("");
  const [
    beforeSecondaryAccountManagerName,
    setBeforeSecondaryAccountManagerName,
  ] = useState<string>("");

  const showActionButtons = Boolean(beforeOnboardingSpe && beforeOperationsMan);
  const [clientMsp, setClientMsp] = useState("");
  console.log(showActionButtons);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // const stateRes = await fetch(
        //   "https://varfunctiontypescriptcst.azurewebsites.net/api/states/list/all?"
        // );
        // fetch(
        //   "http://localhost:7071/api/states/list/all"
        // );
        // const stateData: {
        //   iStateId: number;
        //   // cStateName: string;  Not used in the component
        //   cStateShortName: string;
        //   iCountryId: number;
        // }[] = await stateRes.json();
        // setStateOptions(
        //   stateData.map((item) => ({
        //     key: item.iStateId, // This will be sent in create/edit API also used in view api
        //     text: item.cStateShortName, // This is shown in dropdown
        //     countryId: item.iCountryId, //We need this to send in create/edit API
        //   }))
        // );
      } catch (error) {
        console.error("Failed to fetch state dropdown data", error);
      }
    };

    fetchDropdownData();
  }, []);

  /*
  useEffect(() => {
    const fetchHiringManagerOptions = async () => {
      try {
        const res = await fetch(
          "https://varfunctiontypescriptcst.azurewebsites.net/api/hiring-managers/list?"
        );

        // fetch(
        //   "http://localhost:7071/api/hiring-managers/list" await ApiClient.get<HiringManager[]>("hiring-managers");
        // );

        const data: {
          iHiringManagerId: number;
          cHiringManagerName: string;
          iVariteHiringMangerID: number;
        }[] = await res.json();

        setHiringManagerOptions(
          data.map((item) => ({
            key: item.iHiringManagerId,
            text: item.cHiringManagerName,
            iVariteHiringMangerID: item.iVariteHiringMangerID,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch hiring manager options", error);
      }
    };

    fetchHiringManagerOptions();
  }, []);

  */

  // useEffect(() => {
  //   const fetchHiringManagerOptions = async () => {
  //     try {
  //       // ✅ Call your Azure Function API securely via AadHttpClient
  //       const data: {
  //         iHiringManagerId: number;
  //         cHiringManagerName: string;
  //         iVariteHiringMangerID: number;
  //       }[] = await ApiClient.get("hiring-managers/list");

  //       // ✅ Map to dropdown options (same as your current logic)
  //       setHiringManagerOptions(
  //         data.map((item) => ({
  //           key: item.iHiringManagerId,
  //           text: item.cHiringManagerName,
  //           iVariteHiringMangerID: item.iVariteHiringMangerID,
  //         }))
  //       );
  //     } catch (error) {
  //       console.error("Failed to fetch hiring manager options", error);
  //     }
  //   };

  //   fetchHiringManagerOptions();
  // }, []);

  useEffect(() => {
    const fetchHiringManagerOptions = async () => {
      try {
        // --- Types ---
        type HiringManagerType = {
          iHiringManagerId: number;
          cHiringManagerName: string;
          iVariteHiringMangerID: number;
        };

        // --- API Call (ApiClient.get returns JSON already) ---
        const data = (await ApiClient.get(
          "hiring-managers/list"
        )) as HiringManagerType[];

        // --- Dropdown Mapping ---
        setHiringManagerOptions(
          data.map((item: HiringManagerType) => ({
            key: item.iHiringManagerId,
            text: item.cHiringManagerName,
            iVariteHiringMangerID: item.iVariteHiringMangerID,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch hiring manager options", error);
      }
    };

    fetchHiringManagerOptions();
  }, []);

  // useEffect(() => {
  //   const fetchDropdowns = async () => {
  //     try {
  //       const [clientRes, currencyRes, employeeStatusRes, rateFrequencyRes] =
  //         await Promise.all([
  //           // fetch(
  //           //   "https://varfunctiontypescriptcst.azurewebsites.net/api/client-name/getclient?"
  //           // ),
  //           // fetch(
  //           //   "https://varfunctiontypescriptcst.azurewebsites.net/api/currency-type/getcurrency?"
  //           // ),
  //           // fetch(
  //           //   "https://varfunctiontypescriptcst.azurewebsites.net/api/employee-status/list?"
  //           // ),
  //           // fetch(
  //           //   "https://varfunctiontypescriptcst.azurewebsites.net/api/rate-frequency-type/getfrequency?"
  //           // ),
  //           ApiClient.get("client-name/getclient"),
  //           ApiClient.get("currency-type/getcurrency"),
  //           ApiClient.get("employee-status/list"),
  //           ApiClient.get("rate-frequency-type/getfrequency"),
  //         ]);

  //       const clientData: {
  //         iClientId: number;
  //         cClientName: string;
  //         iDeliveryDirectorName: string | null;
  //         iDeliveryDirectorId: number | null;
  //         iVariteClientId: number;
  //       }[] = await clientRes.json();

  //       const currencyData: { iCurrencyId: number; cCurrencyName: string }[] =
  //         await currencyRes.json();
  //       const employeeStatusData: {
  //         iEmployeeStatusId: number;
  //         cEmployeeStatus: string;
  //       }[] = await employeeStatusRes.json();
  //       const rateFrequencyData: {
  //         iRateFrequencyType: number;
  //         cRateFrequencyTypeName: string;
  //       }[] = await rateFrequencyRes.json();

  //       setClientOptions(
  //         clientData
  //           .slice()
  //           .sort((a, b) => a.cClientName.localeCompare(b.cClientName))
  //           .map((item) => ({
  //             key: item.iClientId,
  //             text: item.cClientName,
  //             iDeliveryDirectorName: item.iDeliveryDirectorName,
  //             iDeliveryDirectorId: item.iDeliveryDirectorId,
  //             iVariteClientId: item.iVariteClientId,
  //           }))
  //       );

  //       setCurrencyOptions(
  //         currencyData.map((item) => ({
  //           key: item.iCurrencyId,
  //           text: item.cCurrencyName,
  //         }))
  //       );

  //       setEmployeeStatusOptions(
  //         employeeStatusData.map((item) => ({
  //           key: item.iEmployeeStatusId,
  //           text: item.cEmployeeStatus,
  //         }))
  //       );

  //       setRateFrequencyOptions(
  //         rateFrequencyData.map((item) => ({
  //           key: item.iRateFrequencyType,
  //           text: item.cRateFrequencyTypeName,
  //         }))
  //       );
  //       debugger;
  //     } catch (error) {
  //       console.error("Failed to fetch dropdown data", error);
  //     }
  //   };

  //   fetchDropdowns();
  //   console.log("EditForm Values ", EditFormInitialValues);
  //   console.log("EditForm Values ", EditFormInitialValues);
  // }, []);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [clientRes, currencyRes, employeeStatusRes, rateFrequencyRes] =
          await Promise.all([
            ApiClient.get("client-name/getclient"),
            ApiClient.get("currency-type/getcurrency"),
            ApiClient.get("employee-status/list"),
            ApiClient.get("rate-frequency-type/getfrequency"),
          ]);

        // ----- TYPES -----
        type ClientType = {
          iClientId: number;
          cClientName: string;
          iDeliveryDirectorName: string | null;
          iDeliveryDirectorId: number | null;
          iVariteClientId: number;
        };

        type CurrencyType = {
          iCurrencyId: number;
          cCurrencyName: string;
        };

        type EmployeeStatusType = {
          iEmployeeStatusId: number;
          cEmployeeStatus: string;
        };

        type RateFrequencyType = {
          iRateFrequencyType: number;
          cRateFrequencyTypeName: string;
        };

        // ----- REMOVE .json() BECAUSE ApiClient.get RETURNS JSON -----
        const clientData = clientRes as ClientType[];
        const currencyData = currencyRes as CurrencyType[];
        const employeeStatusData = employeeStatusRes as EmployeeStatusType[];
        const rateFrequencyData = rateFrequencyRes as RateFrequencyType[];

        // ----- CLIENT -----
        setClientOptions(
          clientData
            .slice()
            .sort((a: ClientType, b: ClientType) =>
              a.cClientName.localeCompare(b.cClientName)
            )
            .map((item: ClientType) => ({
              key: item.iClientId,
              text: item.cClientName,
              iDeliveryDirectorName: item.iDeliveryDirectorName,
              iDeliveryDirectorId: item.iDeliveryDirectorId,
              iVariteClientId: item.iVariteClientId,
            }))
        );

        // ----- CURRENCY -----
        setCurrencyOptions(
          currencyData.map((item: CurrencyType) => ({
            key: item.iCurrencyId,
            text: item.cCurrencyName,
          }))
        );

        // ----- EMPLOYEE STATUS -----
        setEmployeeStatusOptions(
          employeeStatusData.map((item: EmployeeStatusType) => ({
            key: item.iEmployeeStatusId,
            text: item.cEmployeeStatus,
          }))
        );

        // ----- RATE FREQUENCY -----
        setRateFrequencyOptions(
          rateFrequencyData.map((item: RateFrequencyType) => ({
            key: item.iRateFrequencyType,
            text: item.cRateFrequencyTypeName,
          }))
        );

        // debugger;
      } catch (error) {
        console.error("Failed to fetch dropdown data", error);
      }
    };

    fetchDropdowns();
    console.log("EditForm Values ", EditFormInitialValues);
    console.log("EditForm Values ", EditFormInitialValues);
  }, []);

  //User logged In
  useEffect(() => {
    const currentUser = context?.pageContext?.user;
    const email = currentUser?.email?.toLowerCase();

    if (!email) return;

    const fetchUserId = async () => {
      try {
        const encodedEmail = encodeURIComponent(email);
        const url = `https://varite.sharepoint.com/_api/web/siteuserinfolist/items?$filter=EMail eq '${encodedEmail}'`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json;odata=verbose",
          },
        });

        if (!response.ok) {
          throw new Error(`API call failed: ${response.statusText}`);
        }

        const data = await response.json();
        const user = data?.d?.results?.[0];

        if (user && user.ID) {
          console.log("User ID from API:", user.ID);
          setCreatedBy({ id: user.ID, email }); // 👈 store both in single state
        }
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, [context]);

  // const fetchUserById = async (id: string) => {
  //   try {
  //     const url = `https://varite.sharepoint.com/_api/web/siteuserinfolist/items?$filter=Id eq ${id}`;

  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json;odata=verbose",
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`API call failed: ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     const user = data?.d?.results?.[0];

  //     if (user && user.ID) {
  //       console.log("User from API:", user);
  //       // ✅ return both ID and email (or any props you want)
  //       // return {
  //       //   //id: user.ID,
  //       //   email: user.EMail,
  //       //   //name: user.Title,
  //       // };
  //       return user.EMail;
  //     } else {
  //       console.warn("No user found for ID:", id);
  //       return "";
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch user by ID:", error);
  //     return "";
  //   }
  // };

  const fetchUserById = async (id: string): Promise<string> => {
    const url = `https://varite.sharepoint.com/_api/web/siteuserinfolist/items?$filter=Id eq ${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json;odata=verbose" },
    }).catch(() => null);

    if (!response || !response.ok) return "";

    const data = await response.json().catch(() => null);
    return data?.d?.results?.[0]?.EMail ?? "";
  };
  const handleSubmit = async (
    values: CreateFormValues | EditFormValues,
    actions: FormikHelpers<any>
  ) => {
    const isEdit = !!consultantId;
    try {
      // @iiEmployeeId = 0,--0 for new , existing then pass employee id
      // @iiEmployeeTypeId = 2,--1 Internal, 2 consultant(always pass 2 for now)
      // @iiVendorId = NULL,-- always pass null for now
      // @idCreatedDate = '2025-05-21 16:03:08.000'-- At the time of creation pass
      // @ibIsActive =1,-- At the time of creation
      // @iiCreatedBy =1,-- login person

      console.log("Form values before submission:", values);

      console.log("Is Edit Mode:", isEdit);
      // const isEdit = consultantId !== undefined && consultantId !== null;

      let payloadToSend: any;

      if (isEdit) {
        console.log("is edit case running");
        const editValues = values as EditFormValues;
        const clientName = clientOptions.find(
          (d: any) => Number(d.key) === Number(editValues?.clientName)
        );
        const EditPayload = {
          iiEmployeeId: Number(consultantId),
          iiUniqueId: `${clientName?.text}:${clientMsp}:${editValues?.consultantLastName},${editValues?.consultantFirstName}`, //TODO Generate a random unique ID
          iiClientId: Number(editValues.clientName),

          icSuffix: editValues.suffix,
          icEmployeeName: editValues.consultantFullName,
          icFirstName: editValues.consultantFirstName,
          icMiddleName: editValues.consultantMiddleName,
          icLastName: editValues.consultantLastName,
          icEmail: editValues.email,
          icGender: editValues.consultantGender,
          icMaritalStatus: "",

          iiCityId: null, //TODO We are psssing text need to do something
          iiStateId: Number(editValues.workState), //TODO some state id should be passed: like consualntt state id
          iiCountryId: 3, //TODO
          iiEmployeeTypeId: 2, //TODO to get from employee status dropdown : --1 Internal, 2 consultant(always pass 2 for now)
          iiEmployeeStatusId: Number(editValues.employeeStatus),

          iiVendorId: null, //NULL,-- always pass null for now
          icPayType: editValues.payRateType,
          icPlacementType: editValues.typeOfPlacement,
          icJobTitle: editValues.jobTitle,
          icDateofJoining: editValues.dateOfJoining
            ? dayjs(editValues.dateOfJoining).format("YYYY-MM-DDT00:00:00")
            : null, //"1900-01-01T00:00:00"
          icDateofTermination: "1900-01-01T00:00:00", //TODO
          icJoiningTermination: null, //TODO
          // iiNonBillableBonus: editValues.nonBillableBonus, //TODO Where are its duration and currency?
          ibBenefitCost: false, //TODO
          icExemptStatus: editValues.exemptStatus,
          iiDivisionId: null, //TODO

          icVendorCOIRequired: editValues.vendorCOIrequired,
          idVendorCOIExpiration: editValues.vendorCOIexpiration
            ? dayjs(editValues.vendorCOIexpiration).format(
                "YYYY-MM-DDT00:00:00"
              )
            : null,
          idVendorCOIExpirationCalculatedDateField:
            editValues.vendorCOIexpirationDateField
              ? dayjs(editValues.vendorCOIexpirationDateField).format(
                  "YYYY-MM-DDT00:00:00"
                )
              : null,

          icPostJoiningConsultantFollowUp: "False", //Todo
          idPostJoiningConsultantFollowUp: editValues.postJoiningConsultant
            ? dayjs(editValues.postJoiningConsultant).format(
                "YYYY-MM-DDT00:00:00"
              )
            : null,

          icClientSubVendor: editValues.clientSubVendor,
          icJobDuities: editValues.jobDuties,
          icDivision: editValues.division,

          iiContactDurationInMonths: Number(editValues.contractDurationMonths), //TODO Maybe FLOAT need to check
          iiNoofHoursonthisPosition: Number(40.0),

          idTentativeJoiningDate: editValues.tentativeJoiningDate
            ? dayjs(editValues.tentativeJoiningDate).format(
                "YYYY-MM-DDT00:00:00"
              )
            : null,
          idProposedEndDate: editValues.proposedEndDate
            ? dayjs(editValues.proposedEndDate).format("YYYY-MM-DDT00:00:00")
            : null,

          icPayrollSchedule: editValues.payrollSchedule,
          icTypeofPlacement: editValues.typeOfPlacement,
          icTypeofEngagement: editValues.typeOfEngagement,
          icWorkAuthorizationStatus: editValues.workAuthorizationStatus,
          icWorkAuthorizationExpirationDate:
            editValues.workAuthorizationExpirationDate
              ? dayjs(editValues.workAuthorizationExpirationDate).format(
                  "YYYY-MM-DDT00:00:00"
                )
              : null, //TODO

          icRequirementId: editValues.requirementID,
          icContingentWorkerId: editValues.contingentWorkerID, //TODO String or number Not Sure  :
          icDisqualifiedPlacement: "Qualified", //TODO

          iiTenure: 1499, //TODO
          iiTenureLimit: 170.0, //TODO

          icRequirementClassification: editValues.requirementClassification,
          icSourceWebsite: editValues.sourceWebsite,
          icReferralNumber: "", //TODO
          icVendorContact: "", //TODO
          icTimesheetAccess: editValues.timesheetAccess, //TODO
          icTimesheetAccessYesNO: editValues.timesheetAccess,
          icMedicalBenefitsPortalAccess: editValues.medicalBenefits, //TODO
          icMedicalBenefitsPortalAccessYesNO: editValues.medicalBenefits,

          icCellPhone: editValues.phoneNumber, //TODO
          icWorkPhone: editValues.phoneNumber, //TODO
          icWorkFax: "", //TODO
          icWorkAddress: "", //TODO
          iiWorkCountry: Number(editValues.workCountry),
          iiWorkState: Number(editValues.workState),
          iiWorkCity: Number(editValues.workCity),
          icHomePhone: editValues.phoneNumber,
          icHomeAddress: editValues.homeAddressStreet,
          iiHomeAddressPostalCode: editValues.homeAddressPostalCode,
          iiHomeCountry: Number(editValues.homeAddressCountry),
          iiHomeState: Number(editValues.homeAddressStateOrProvince),
          iiHomeCity: Number(editValues.homeAddressCity),

          iiHiringManager: Number(editValues.hiringManager),
          iiRecruiter: Number(editValues.recruiterName),
          iiSecondaryRecruiter: Number(editValues.secondaryRecruiterName),
          iiTeamLead: Number(editValues.teamLead),
          iiSecondaryTeamLead: 0, //TODO
          iiAccountManager: Number(editValues.accountManagerName),
          iiSecondayAccoountManager: Number(
            editValues.secondaryAccountManagerName
          ),
          iiAssociateAccountManager: Number(
            editValues.associateAccountManagerName
          ),
          iiSecondaryAssociateAccountManager: 0,
          iiSeniorAccountManager: 0, //TODO
          iiSecondarySeniorAccountManager: 0, //TODO
          iiAssociateDirector: 0, //TODO
          iiSecondaryAsscoiateDirector: 0, //TODO
          iiDirector: editValues.deliveryDirectorId, //TODO
          iiSecondaryDirector: 0, //TODO
          iiSharedServiceManager: editValues.sharedServiceManagerName,

          //////////////////////////////////////////////////

          // iiBillRateTypeId: 1,
          // iiBillRateCurrencyType: Number(editValues.billRateCurrency),
          // iiBillRateFrequencyType: Number(editValues.billRateDuration),
          // iiBillRate: Number(editValues.billRate),
          // //12,

          // iiPayRateTypeId: 2,
          // iiPayRateCurrencyType: Number(editValues.payRateCurrency),
          // iiPayRateFrequencyType: Number(editValues.payRateDuration),
          // iiPayRate: Number(editValues.payRate),
          // //12,

          // iiOBillRateTypeId: 3,
          // iiOBillRateCurrencyType: Number(editValues.overtimeBillRateCurrency),
          // iiOBillRateFrequencyType: Number(editValues.overtimeBillRateDuration),
          // iiOBillRate: Number(editValues.overtimeBillRate),

          // iiOPayRateTypeId: 4,
          // iiOPayRateCurrencyType: Number(editValues.overtimePayRateCurrency),
          // iiOPayRateFrequencyType: Number(editValues.overtimePayRateDuration),
          // iiOPayRate: Number(editValues.overtimePayRate),

          // iiDOBillRateTypeId: 5,
          // iiDOBillRateCurrencyType: Number(
          //   editValues.doubleOvertimeBillRateCurrency
          // ),
          // iiDOBillRateFrequencyType: Number(
          //   editValues.doubleOvertimeBillRateDuration
          // ),
          // iiDOBillRate: Number(editValues.doubleOvertimeBillRate),

          // iiDOPayRateTypeId: 6,
          // iiDOPayRateCurrencyType: Number(
          //   editValues.doubleOvertimePayRateCurrency
          // ),
          // iiDOPayRateFrequencyType: Number(
          //   editValues.doubleOvertimePayRateDuration
          // ),
          // iiDOPayRate: Number(editValues.doubleOvertimePayRate),

          // Bill Rate
          iiBillRateTypeId: 1,

          iiBillRateCurrencyType:
            editValues.newBillRateCurrency ??
            Number(editValues.billRateCurrency),

          iiBillRateFrequencyType:
            editValues.newBillRateDuration ??
            Number(editValues.billRateDuration),

          iiBillRate: editValues.newBillRate ?? Number(editValues.billRate),

          // Pay Rate
          iiPayRateTypeId: 2,
          iiPayRateCurrencyType:
            editValues.newPayRateCurrency ?? Number(editValues.payRateCurrency),
          iiPayRateFrequencyType:
            editValues.newPayRateDuration ?? Number(editValues.payRateDuration),
          iiPayRate: editValues.newPayRate ?? Number(editValues.payRate),

          // Overtime Bill Rate
          iiOBillRateTypeId: 3,
          iiOBillRateCurrencyType:
            editValues.newOvertimeBillRateCurrency ??
            Number(editValues.overtimeBillRateCurrency),
          iiOBillRateFrequencyType:
            editValues.newOvertimeBillRateDuration ??
            Number(editValues.overtimeBillRateDuration),
          iiOBillRate:
            editValues.newOvertimeBillRate ??
            Number(editValues.overtimeBillRate),

          // Overtime Pay Rate
          iiOPayRateTypeId: 4,
          iiOPayRateCurrencyType:
            editValues.newOvertimePayRateCurrency ??
            Number(editValues.overtimePayRateCurrency),
          iiOPayRateFrequencyType:
            editValues.newOvertimePayRateDuration ??
            Number(editValues.overtimePayRateDuration),
          iiOPayRate:
            editValues.newOvertimePayRate ?? Number(editValues.overtimePayRate),

          // Double Overtime Bill Rate
          iiDOBillRateTypeId: 5,
          iiDOBillRateCurrencyType:
            editValues.newDoubleOvertimeBillRateCurrency ??
            Number(editValues.doubleOvertimeBillRateCurrency),
          iiDOBillRateFrequencyType:
            editValues.newDoubleOvertimeBillRateDuration ??
            Number(editValues.doubleOvertimeBillRateDuration),
          iiDOBillRate:
            editValues.newDoubleOvertimeBillRate ??
            Number(editValues.doubleOvertimeBillRate),

          // Double Overtime Pay Rate
          iiDOPayRateTypeId: 6,
          iiDOPayRateCurrencyType:
            editValues.newDoubleOvertimePayRateCurrency ??
            Number(editValues.doubleOvertimePayRateCurrency),
          iiDOPayRateFrequencyType:
            editValues.newDoubleOvertimePayRateDuration ??
            Number(editValues.doubleOvertimePayRateDuration),
          iiDOPayRate:
            editValues.newDoubleOvertimePayRate ??
            Number(editValues.doubleOvertimePayRate),

          /////////////////////

          iiPerDiemCostRateTypeId: 7,
          iiPerDiemCostRateCurrencyType: Number(editValues.perDiemCostCurrency),
          iiPerDiemCostRateFrequencyType: Number(
            editValues.perDiemCostDuration
          ),
          iiPerDiemCostRate: Number(editValues.perDiemCost),

          //nonBillableBonusDuration?? 8

          //TODO : Onboarding
          icBackgroundCheckStatus: values.backgroundCheckStatus,
          iiOnboardingSpecialist: Number(values.onboardingSpecialist),

          ibIsActive: true,
          iiCreatedBy: createdBy.id,
          idCreatedDate: dayjs().utc().format("YYYY-MM-DDTHH:mm:ss"),

          ///Edit Values for Edit Form//
          // Benefits
          ibBenefitCostB: editValues.benefitCost === "Yes" ? true : false, //Changed

          ic401KEnrollmentStatus: editValues.enrollmentStatus,
          icEmployeeEngagement: editValues.employeeEngagement,
          id401KEnrollmentDate: editValues.enrollment401kDate
            ? dayjs(editValues.enrollment401kDate).format("YYYY-MM-DDT00:00:00")
            : null,
          idEmployeeEngagementDate: editValues.employeeEngagementDate
            ? dayjs(editValues.employeeEngagementDate).format(
                "YYYY-MM-DDT00:00:00"
              )
            : null,

          // Finance Tab
          iiFinanceSpecialistId: Number(editValues.financeSpecialist), //TODO
          icCreateAddEmployeetoQB: editValues.createAddEmployeeQB,
          icCreateUploadPaylocityFile: editValues.createUploadPaylocityFile,

          ibPaylocityLogInInstructions:
            editValues.paylocityLoginInstructions === "Yes" ? true : false, //Changed

          icVerifyWorkLocationSetup: editValues.verifyWorkLocationSetup,
          icReviewTaxsetuponPaylocity: editValues.reviewTaxSetupPaylocity,
          icReviewSickHourssetuponPaylocity:
            editValues.reviewSickHoursSetupPaylocity,

          // History
          // icHistory: "", //TODO :editValues.history, //Not used in edit form

          // Offboarding
          icOffboardingSpecialist: Number(editValues.offboardingspecialist),
          idDateofTermination: editValues.DateofTermination
            ? dayjs(editValues.DateofTermination).format("YYYY-MM-DDT00:00:00")
            : null,
          icReasonforTermination: editValues.reasonForTermination,
          icSeparationDocument: editValues.separationDocument,
          //AssetReturn: editValues.assetReturn,
          icMedicalBenefitTermination: editValues.medicalBenefitTermination,
          ic401KDistribution: editValues.k401Distribution,
          //icFinalPaycheck: editValues.finalPaycheck,
          idFinalPaycheck: editValues.finalPaycheckDate
            ? dayjs(editValues.finalPaycheckDate).format("YYYY-MM-DDT00:00:00")
            : null,
          icKantolaTrainings: editValues.kantolaTrainings,
          icMoveConsultantFoldertoTerminated: editValues.moveConsultantFolder,

          //New Values for Edit Form
          icIdentityverification: editValues.identityverification,
          icBackgroundCheckPortalInvitation:
            editValues.backgroundCheckPortalInvitation,
          icESConsultantPacket: editValues.eSConsultantPacket,
          icESStateDocuments: editValues.eSStateDocuments,
          icESClientPacket: editValues.eSClientPacket,
          icAdobeSendClientDocuments: editValues.adobeSendClientDocuments,
          icAdobeSend401KPacket: editValues.adobeSend401kPacket,
          icClientPacketUpdatedtoClientPortal:
            editValues.clientPacketupdatedtoClientPortal,
          icKantolaTraining: editValues.kantolaTraining,
          icI9Scheduling: editValues.i9Scheduling,
          icI9VerificationStatus: editValues.i9VerificationStatus,
          icChecklisCreated: editValues.checklistCreated,

          icComments: editValues.comments,
          icWorkLocation: editValues.workLocation,
          icVendorEmailAddress: editValues.vendorEmailAddress,
          icVendorDetails: editValues.vendorNameAndDetails,

          iiNonBillableBonusRateTypeId: 8,
          iiNonBillableBonusCurrencyType: Number(
            editValues.nonBillableBonusCurrency
          ),
          iiNonBillableBonusFrequencyType: Number(
            editValues.nonBillableBonusDuration
          ),
          iiNonBillableBonus: Number(editValues.nonBillableBonus),
          iiOperationManager: Number(editValues.operationsManager),

          //New Pay Rate and Bill Rate Effective Dates
          idPEffectiveDate: editValues.payRateEffectiveDate
            ? dayjs(editValues.payRateEffectiveDate).format(
                "YYYY-MM-DDT00:00:00"
              )
            : today,
          idBEffectiveDate: editValues.billRateEffectiveDate
            ? dayjs(editValues.billRateEffectiveDate).format(
                "YYYY-MM-DDT00:00:00"
              )
            : today,
          idPDEffectiveDate: editValues.perDiemEffectiveDate
            ? dayjs(editValues.perDiemEffectiveDate).format(
                "YYYY-MM-DDT00:00:00"
              )
            : today,
          idNBEffectiveDate: editValues.nonBillableEffectiveDate
            ? dayjs(editValues.nonBillableEffectiveDate).format(
                "YYYY-MM-DDT00:00:00"
              )
            : today,
        };

        payloadToSend = EditPayload;
      } else {
        console.log("create is called");
        // values` as `CreateFormValues | EditFormValues`
        // const createValues = values as CreateFormValues; but union will work as we are taking common and common has all of create
        const clientName = clientOptions.find(
          (d: any) => Number(d.key) === Number(values?.clientName)
        );
        const CreatePayload = {
          iiEmployeeId: 0,
          iiUniqueId: `${clientName?.text}:${clientMsp}:${values?.consultantLastName},${values?.consultantFirstName}`, //TODO Generate a random unique ID
          iiClientId: Number(values.clientName),

          icSuffix: values.suffix,
          icEmployeeName: values.consultantFullName,
          icFirstName: values.consultantFirstName,
          icMiddleName: values.consultantMiddleName,
          icLastName: values.consultantLastName,
          icEmail: values.email,
          icGender: values.consultantGender,
          icMaritalStatus: "",

          iiCityId: null, //TODO We are psssing text need to do something
          iiStateId: Number(values.workState), //TODO some state id should be passed: like consualntt state id
          iiCountryId: 3, //TODO
          iiEmployeeTypeId: 2, //TODO to get from employee status dropdown : --1 Internal, 2 consultant(always pass 2 for now)
          iiEmployeeStatusId: Number(values.employeeStatus),

          iiVendorId: null, //NULL,-- always pass null for now
          icPayType: values.payRateType,
          icPlacementType: values.typeOfPlacement,
          icJobTitle: values.jobTitle,
          icDateofJoining: values.dateOfJoining
            ? dayjs(values.dateOfJoining).format("YYYY-MM-DDT00:00:00")
            : null, //"1900-01-01T00:00:00"
          icDateofTermination: "1900-01-01T00:00:00", //TODO
          icJoiningTermination: null, //TODO
          // iiNonBillableBonus: values.nonBillableBonus, //TODO Where are its duration and currency?
          ibBenefitCost: false, //TODO
          icExemptStatus: values.exemptStatus,
          iiDivisionId: null, //TODO

          icVendorCOIRequired: values.vendorCOIrequired,
          idVendorCOIExpiration: values.vendorCOIexpiration
            ? dayjs(values.vendorCOIexpiration).format("YYYY-MM-DDT00:00:00")
            : null,
          idVendorCOIExpirationCalculatedDateField:
            values.vendorCOIexpirationDateField
              ? dayjs(values.vendorCOIexpirationDateField).format(
                  "YYYY-MM-DDT00:00:00"
                )
              : null,

          icPostJoiningConsultantFollowUp: "False", //Todo
          idPostJoiningConsultantFollowUp: values.postJoiningConsultant
            ? dayjs(values.postJoiningConsultant).format("YYYY-MM-DDT00:00:00")
            : null,

          icClientSubVendor: values.clientSubVendor,
          icJobDuities: values.jobDuties,
          icDivision: values.division,

          iiContactDurationInMonths: Number(values.contractDurationMonths), //TODO Maybe FLOAT need to check
          iiNoofHoursonthisPosition: Number(40.0),

          idTentativeJoiningDate: values.tentativeJoiningDate
            ? dayjs(values.tentativeJoiningDate).format("YYYY-MM-DDT00:00:00")
            : null,
          idProposedEndDate: values.proposedEndDate
            ? dayjs(values.proposedEndDate).format("YYYY-MM-DDT00:00:00")
            : null,

          icPayrollSchedule: values.payrollSchedule,
          icTypeofPlacement: values.typeOfPlacement,
          icTypeofEngagement: values.typeOfEngagement,
          icWorkAuthorizationStatus: values.workAuthorizationStatus,
          icWorkAuthorizationExpirationDate:
            values.workAuthorizationExpirationDate
              ? dayjs(values.workAuthorizationExpirationDate).format(
                  "YYYY-MM-DDT00:00:00"
                )
              : null, //TODO

          icRequirementId: values.requirementID,
          icContingentWorkerId: values.contingentWorkerID, //TODO String or number Not Sure  :
          icDisqualifiedPlacement: "Qualified", //TODO

          iiTenure: 1499, //TODO
          iiTenureLimit: 170.0, //TODO

          icRequirementClassification: values.requirementClassification,
          icSourceWebsite: values.sourceWebsite,
          icReferralNumber: "", //TODO
          icVendorContact: "", //TODO
          icTimesheetAccess: values.timesheetAccess, //TODO
          icTimesheetAccessYesNO: values.timesheetAccess,
          icMedicalBenefitsPortalAccess: values.medicalBenefits, //TODO
          icMedicalBenefitsPortalAccessYesNO: values.medicalBenefits,

          icCellPhone: values.phoneNumber, //TODO
          icWorkPhone: values.phoneNumber, //TODO
          icWorkFax: "", //TODO
          icWorkAddress: "", //TODO
          iiWorkCountry: Number(values.workCountry),
          iiWorkState: Number(values.workState),
          iiWorkCity: Number(values.workCity),
          icHomePhone: values.phoneNumber,
          icHomeAddress: values.homeAddressStreet,
          iiHomeAddressPostalCode: values.homeAddressPostalCode,
          iiHomeCountry: Number(values.homeAddressCountry),
          iiHomeState: Number(values.homeAddressStateOrProvince),
          iiHomeCity: Number(values.homeAddressCity),

          iiHiringManager: Number(values.hiringManager),
          iiRecruiter: Number(values.recruiterName),
          iiSecondaryRecruiter: Number(values.secondaryRecruiterName),
          iiTeamLead: Number(values.teamLead),
          iiSecondaryTeamLead: 0, //TODO
          iiAccountManager: Number(values.accountManagerName),
          iiSecondayAccoountManager: Number(values.secondaryAccountManagerName),
          iiAssociateAccountManager: Number(values.associateAccountManagerName),
          iiSecondaryAssociateAccountManager: 0,
          iiSeniorAccountManager: 0, //TODO
          iiSecondarySeniorAccountManager: 0, //TODO
          iiAssociateDirector: 0, //TODO
          iiSecondaryAsscoiateDirector: 0, //TODO
          iiDirector: values.deliveryDirectorId, //TODO
          iiSecondaryDirector: 0, //TODO
          iiSharedServiceManager: values.sharedServiceManagerName,

          iiBillRateTypeId: 1,
          iiBillRateCurrencyType: Number(values.billRateCurrency),
          iiBillRateFrequencyType: Number(values.billRateDuration),
          iiBillRate: Number(values.billRate),

          iiPayRateTypeId: 2,
          iiPayRateCurrencyType: Number(values.payRateCurrency),
          iiPayRateFrequencyType: Number(values.payRateDuration),
          iiPayRate: Number(values.payRate),

          iiOBillRateTypeId: 3,
          iiOBillRateCurrencyType: Number(values.overtimeBillRateCurrency),
          iiOBillRateFrequencyType: Number(values.overtimeBillRateDuration),
          iiOBillRate: Number(values.overtimeBillRate),

          iiOPayRateTypeId: 4,
          iiOPayRateCurrencyType: Number(values.overtimePayRateCurrency),
          iiOPayRateFrequencyType: Number(values.overtimePayRateDuration),
          iiOPayRate: Number(values.overtimePayRate),

          iiDOBillRateTypeId: 5,
          iiDOBillRateCurrencyType: Number(
            values.doubleOvertimeBillRateCurrency
          ),
          iiDOBillRateFrequencyType: Number(
            values.doubleOvertimeBillRateDuration
          ),
          iiDOBillRate: Number(values.doubleOvertimeBillRate),

          iiDOPayRateTypeId: 6,
          iiDOPayRateCurrencyType: Number(values.doubleOvertimePayRateCurrency),
          iiDOPayRateFrequencyType: Number(
            values.doubleOvertimePayRateDuration
          ),
          iiDOPayRate: Number(values.doubleOvertimePayRate),

          iiPerDiemCostRateTypeId: 7,
          iiPerDiemCostRateCurrencyType: Number(values.perDiemCostCurrency),
          iiPerDiemCostRateFrequencyType: Number(values.perDiemCostDuration),
          iiPerDiemCostRate: Number(values.perDiemCost),

          //nonBillableBonusDuration?? 8
          //Not passing

          //TODO : Onboarding
          icBackgroundCheckStatus: values.backgroundCheckStatus,
          iiOnboardingSpecialist: Number(values.onboardingSpecialist),

          ibIsActive: true,
          iiCreatedBy: createdBy.id,
          idCreatedDate: dayjs().utc().format("YYYY-MM-DDTHH:mm:ss"),

          //New Values for Create Form
          icIdentityverification: values.identityverification,
          icBackgroundCheckPortalInvitation:
            values.backgroundCheckPortalInvitation,
          icESConsultantPacket: values.eSConsultantPacket,
          icESStateDocuments: values.eSStateDocuments,
          icESClientPacket: values.eSClientPacket,
          icAdobeSendClientDocuments: values.adobeSendClientDocuments,
          icAdobeSend401KPacket: values.adobeSend401kPacket,
          icClientPacketUpdatedtoClientPortal:
            values.clientPacketupdatedtoClientPortal,
          icKantolaTraining: values.kantolaTraining,

          icI9Scheduling: values.i9Scheduling,
          icI9VerificationStatus: values.i9VerificationStatus,
          icChecklisCreated: values.checklistCreated,

          icComments: values.comments,
          icWorkLocation: values.workLocation,
          icVendorEmailAddress: values.vendorEmailAddress,
          icVendorDetails: values.vendorNameAndDetails,

          iiNonBillableBonusRateTypeId: 8,
          iiNonBillableBonusCurrencyType: Number(
            values.nonBillableBonusCurrency
          ),
          iiNonBillableBonusFrequencyType: Number(
            values.nonBillableBonusDuration
          ),
          iiNonBillableBonus: Number(values.nonBillableBonus),
          iiOperationManager: Number(values.operationsManager),
          idPEffectiveDate: values.tentativeJoiningDate
            ? dayjs(values.tentativeJoiningDate)
                .subtract(1, "day")
                .format("YYYY-MM-DDT00:00:00")
            : today,

          idBEffectiveDate: values.tentativeJoiningDate
            ? dayjs(values.tentativeJoiningDate)
                .subtract(1, "day")
                .format("YYYY-MM-DDT00:00:00")
            : today,
          idPDEffectiveDate: values.tentativeJoiningDate
            ? dayjs(values.tentativeJoiningDate)
                .subtract(1, "day")
                .format("YYYY-MM-DDT00:00:00")
            : today,

          idNBEffectiveDate: values.tentativeJoiningDate
            ? dayjs(values.tentativeJoiningDate)
                .subtract(1, "day")
                .format("YYYY-MM-DDT00:00:00")
            : today,
          fileAttachment: values.fileAttachment || null,
        };
        console.log("after payload creation");
        payloadToSend = CreatePayload;
      }

      console.log("Final Payload:", payloadToSend);

      // const url = isEdit
      //   ? "https://varfunctiontypescriptcst.azurewebsites.net/api/edit-cst-entry/edit?"
      //   : "https://varfunctiontypescriptcst.azurewebsites.net/api/create-cst-entry/create?";

      // const method = isEdit ? "PUT" : "POST";
      // console.log(method, url);

      // const response = await fetch(url, {
      //   method,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payloadToSend),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to submit form");
      // }

      // const result = await response.json();

      const url = isEdit ? "edit-cst-entry/edit" : "create-cst-entry/create";

      const method = isEdit ? "PUT" : "POST";
      console.log(method, url);

      // ⬇️ Replace fetch() with ApiClient.post / ApiClient.put
      const result = isEdit
        ? await ApiClient.put(url, payloadToSend)
        : await ApiClient.post(url, payloadToSend);

      console.log("Success:", result);

      // Extract the actual ID
      const firstResult = result?.result?.[0];
      const createdEmployeeId = firstResult?.[""] || null;
      console.log("Created Employee ID:", createdEmployeeId);

      //SharePoint List API Integration
      const sharePointListUpdateApiUrl =
        "https://default29dd49b922f44c4797625604e46bd7.d3.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/3120ce183f3f48cb97bba9818140ff4f/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=tgGLs_7VNGdb7gvuDuZbrxDPxPRDUD_vK-ZijdB9owE";
      if (!isEdit) {
        //Create Request Body for Power Automate
        const powerAutomateCreateRequestBody = {
          Value: {
            Employee_Id_PA_After: createdEmployeeId,
            Unique_Id_PA_After: "FRB-IT:Agile1:Valentine,Jerry22",
            Is_Active_PA_After: true,
            Created_By_PA_After: createdBy.email,

            Created_Date_PA_After: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
            First_Name_PA_After: values.consultantFirstName,
            Middle_Name_PA_After: values.consultantMiddleName,
            Last_Name_PA_After: values.consultantLastName,
            Suffix_PA_After: values.suffix,
            Employee_Name_PA_After: values.consultantFullName,
            Gender_PA_After: values.consultantGender,
            Home_Phone_PA_After: values.phoneNumber,
            Email_PA_After: values.email,
            Home_Address_PA_After: values.homeAddressStreet,
            Home_Address_Postal_Code_PA_After: values.homeAddressPostalCode,

            Home_Country_PA_After:
              homeCountries.find(
                (c) => c.key === Number(values.homeAddressCountry)
              )?.text || "",
            Home_State_PA_After:
              homeStates.find(
                (s) => s.key === Number(values.homeAddressStateOrProvince)
              )?.text || "",
            Home_City_PA_After:
              homeCities.find((c) => c.key === Number(values.homeAddressCity))
                ?.text || "",

            Work_Country_PA_After:
              countries.find((c) => c.key === Number(values.workCountry))
                ?.text || "",
            Work_State_PA_After:
              states.find((s) => s.key === Number(values.workState))?.text ||
              "",
            Work_City_PA_After:
              cities.find((c) => c.key === Number(values.workCity))?.text || "",

            Work_Address_PA_After: values.workLocation,
            Exempt_Status_PA_After: values.exemptStatus,
            Typeof_Placement_PA_After: values.typeOfPlacement,
            Employee_Status_PA_After:
              employeeStatusOptions.find(
                (e) => e.key === Number(values.employeeStatus)
              )?.text || "",

            Client_Name_PA_After:
              clientOptions.find((c) => c.key === Number(values.clientName))
                ?.text || "",
            Client_Id_PA_After: Number(values.clientName),
            SP_Client_ID_PA_After:
              clientOptions.find((c) => c.key === Number(values.clientName))
                ?.iVariteClientId || null,

            Client_Sub_Vendor_PA_After: values.clientSubVendor,
            Job_Duities_PA_After: values.jobDuties,
            Division_PA_After: values.division,
            Pay_Type_PA_After: values.payRateType,
            Job_Title_PA_After: values.jobTitle,

            Pay_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) => c.key === Number(values.payRateCurrency)
              )?.text || "",
            Pay_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) => f.key === Number(values.payRateDuration)
              )?.text || "",
            Pay_Rate_PA_After: Number(values.payRate),

            Bill_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) => c.key === Number(values.billRateCurrency)
              )?.text || "",
            Bill_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) => f.key === Number(values.billRateDuration)
              )?.text || "",
            Bill_Rate_PA_After: Number(values.billRate),

            O_Pay_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) => c.key === Number(values.overtimePayRateCurrency)
              )?.text || "",
            O_Pay_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) => f.key === Number(values.overtimePayRateDuration)
              )?.text || "",
            O_Pay_Rate_PA_After: Number(values.overtimePayRate),

            O_Bill_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) => c.key === Number(values.overtimeBillRateCurrency)
              )?.text || "",
            O_Bill_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) => f.key === Number(values.overtimeBillRateDuration)
              )?.text || "",
            O_Bill_Rate_PA_After: Number(values.overtimeBillRate),

            D_O_Pay_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) => c.key === Number(values.doubleOvertimePayRateCurrency)
              )?.text || "",
            D_O_Pay_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) => f.key === Number(values.doubleOvertimePayRateDuration)
              )?.text || "",
            D_O_Pay_Rate_PA_After: Number(values.doubleOvertimePayRate),

            D_O_Bill_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) => c.key === Number(values.doubleOvertimeBillRateCurrency)
              )?.text || "",
            D_O_Bill_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) => f.key === Number(values.doubleOvertimeBillRateDuration)
              )?.text || "",
            D_O_Bill_Rate_PA_After: Number(values.doubleOvertimeBillRate),

            Per_Diem_Cost_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) => c.key === Number(values.perDiemCostCurrency)
              )?.text || "",
            Per_Diem_Cost_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) => f.key === Number(values.perDiemCostDuration)
              )?.text || "",
            Per_Diem_Cost_Rate_PA_After: Number(values.perDiemCost),

            Non_Billable_Bonus_Currency_Type_PA_After:
              currencyOptions.find(
                (c) => c.key === Number(values.nonBillableBonusCurrency)
              )?.text || "",
            Non_Billable_Bonus_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) => f.key === Number(values.nonBillableBonusDuration)
              )?.text || "",
            Non_Billable_Bonus_Rate_PA_After: Number(values.nonBillableBonus),

            Contract_Duration_In_Months_PA_After: values.contractDurationMonths,
            No_of_Hoursonthis_Position_PA_After: values.noOfHoursOnThisPosition,
            Tentative_Joining_Date_PA_After: values.tentativeJoiningDate
              ? dayjs(values.tentativeJoiningDate).format("YYYY-MM-DDT00:00:00")
              : null,
            Proposed_End_Date_PA_After: values.proposedEndDate
              ? dayjs(values.proposedEndDate).format("YYYY-MM-DDT00:00:00")
              : null,
            Payroll_Schedule_PA_After: values.payrollSchedule,
            Typeof_Engagement_PA_After: values.typeOfEngagement,
            Work_Authorization_Status_PA_After: values.workAuthorizationStatus,
            Work_Authorization_Expiration_Date_PA_After:
              values.workAuthorizationExpirationDate
                ? dayjs(values.workAuthorizationExpirationDate).format(
                    "YYYY-MM-DDT00:00:00"
                  )
                : null,
            Requirement_ID_PA_After: values.requirementID,
            Contingent_Worker_ID_PA_After: values.contingentWorkerID,
            Requirement_Classification_PA_After:
              values.requirementClassification,

            Hiring_Manager_PA_After:
              hiringManagerOptions.find(
                (h) => h.key === Number(values.hiringManager)
              )?.text || "",
            Hiring_Manager_Id_PA_After: Number(values.hiringManager),
            SP_Hiring_Manager_ID_PA_After:
              hiringManagerOptions.find(
                (h) => h.key === Number(values.hiringManager)
              )?.iVariteHiringMangerID || null,

            Recruiter_PA_After: recruiterNameEmail || "",
            Secondary_Recruiter_PA_After: secRecruiterNameEmail || "",
            Team_Lead_PA_After: teamLeadNameEmail || "",
            Account_Manager_PA_After: accountManagerNameEmail || "",
            Associate_Account_Manager_PA_After:
              associateAccountManagerNameEmail || "",
            Shared_Service_Manager_PA_After:
              sharedServiceManagerNameEmail || "",
            Seconday_Accoount_Manager_PA_After:
              secAccountManagerNameEmail || "",

            Director_Name_PA_After: values.deliveryDirectorName,
            Director_ID_PA_After: values.deliveryDirectorId,
            Source_Website_PA_After: values.sourceWebsite,
            Vendor_Email_Address_PA_After: values.vendorEmailAddress,
            Vendor_Name_and_Details_PA_After: values.vendorNameAndDetails,
            Vendor_C_O_I_Required_PA_After: values.vendorCOIrequired,
            Vendor_C_O_I_Expiration_PA_After: values.vendorCOIexpiration
              ? dayjs(values.vendorCOIexpiration).format("YYYY-MM-DDT00:00:00")
              : null,
            Onboarding_Specialist_Name_PA_After: onboardingSpeNameEmail || "",
            Operation_Manager_Name_PA_After: operationManagerNameEmail || "",
            Comments: values.comments,
            isCreated: true,
          },
        };

        const requestBodyCreate = JSON.stringify(
          powerAutomateCreateRequestBody
        );

        console.log(
          "Request Body for SharePoint List Update API when Created:",
          requestBodyCreate
        );

        const sharePointListUpdateApiResponse = await fetch(
          sharePointListUpdateApiUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: requestBodyCreate,
          }
        );

        if (!sharePointListUpdateApiResponse.ok) {
          throw new Error("Failed to trigger second API");
        }
      } else {
        //when isEdit is true
        const powerAutomateEditRequestBody = {
          Value: {
            Employee_Id_PA_After: Number(consultantId), // pass from the response.id or from params: Same Thing
            Varite_Employee_ID: variteEmployeeId ?? null,
            Unique_Id_PA_After: "FRB-IT:Agile1:Valentine,Jerry22",
            Is_Active_PA_After: true,
            Created_By_PA_After: createdBy.email,

            Created_Date_PA_After: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
            First_Name_PA_After: values.consultantFirstName,
            Middle_Name_PA_After: values.consultantMiddleName,
            Last_Name_PA_After: values.consultantLastName,
            Suffix_PA_After: values.suffix,
            Employee_Name_PA_After: values.consultantFullName,
            Gender_PA_After: values.consultantGender,
            Home_Phone_PA_After: values.phoneNumber,
            Email_PA_After: values.email,
            Home_Address_PA_After: values.homeAddressStreet,
            Home_Address_Postal_Code_PA_After: values.homeAddressPostalCode,

            Home_Country_PA_After:
              homeCountries.find(
                (c) => c.key === Number(values.homeAddressCountry)
              )?.text || "",
            Home_State_PA_After:
              homeStates.find(
                (s) => s.key === Number(values.homeAddressStateOrProvince)
              )?.text || "",
            Home_City_PA_After:
              homeCities.find((c) => c.key === Number(values.homeAddressCity))
                ?.text || "",

            Work_Country_PA_After:
              countries.find((c) => c.key === Number(values.workCountry))
                ?.text || "",
            Work_State_PA_After:
              states.find((s) => s.key === Number(values.workState))?.text ||
              "",
            Work_City_PA_After:
              cities.find((c) => c.key === Number(values.workCity))?.text || "",

            Work_Address_PA_After: values.workLocation,
            Exempt_Status_PA_After: values.exemptStatus,
            Typeof_Placement_PA_After: values.typeOfPlacement,
            Employee_Status_PA_After:
              employeeStatusOptions.find(
                (e) => e.key === Number(values.employeeStatus)
              )?.text || "",

            Client_Name_PA_After:
              clientOptions.find((c) => c.key === Number(values.clientName))
                ?.text || "",
            Client_Id_PA_After: Number(values.clientName),
            SP_Client_ID_PA_After:
              clientOptions.find((c) => c.key === Number(values.clientName))
                ?.iVariteClientId || null,

            Client_Sub_Vendor_PA_After: values.clientSubVendor,
            Job_Duities_PA_After: values.jobDuties,
            Division_PA_After: values.division,
            Pay_Type_PA_After: values.payRateType,
            Job_Title_PA_After: values.jobTitle,

            Pay_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) =>
                  c.key ===
                  (values.newPayRateCurrency ?? Number(values.payRateCurrency))
              )?.text || "",

            Pay_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) =>
                  f.key ===
                  (values.newPayRateDuration ?? Number(values.payRateDuration))
              )?.text || "",

            Pay_Rate_PA_After: values.newPayRate ?? Number(values.payRate),

            Bill_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) =>
                  c.key ===
                  (values.newBillRateCurrency ??
                    Number(values.billRateCurrency))
              )?.text || "",

            Bill_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) =>
                  f.key ===
                  (values.newBillRateDuration ??
                    Number(values.billRateDuration))
              )?.text || "",

            Bill_Rate_PA_After: values.newBillRate ?? Number(values.billRate),

            O_Pay_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) =>
                  c.key ===
                  (values.newOvertimePayRateCurrency ??
                    Number(values.overtimePayRateCurrency))
              )?.text || "",

            O_Pay_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) =>
                  f.key ===
                  (values.newOvertimePayRateDuration ??
                    Number(values.overtimePayRateDuration))
              )?.text || "",

            O_Pay_Rate_PA_After:
              values.newOvertimePayRate ?? Number(values.overtimePayRate),

            O_Bill_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) =>
                  c.key ===
                  (values.newOvertimeBillRateCurrency ??
                    Number(values.overtimeBillRateCurrency))
              )?.text || "",

            O_Bill_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) =>
                  f.key ===
                  (values.newOvertimeBillRateDuration ??
                    Number(values.overtimeBillRateDuration))
              )?.text || "",

            O_Bill_Rate_PA_After:
              values.newOvertimeBillRate ?? Number(values.overtimeBillRate),

            D_O_Pay_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) =>
                  c.key ===
                  (values.newDoubleOvertimePayRateCurrency ??
                    Number(values.doubleOvertimePayRateCurrency))
              )?.text || "",

            D_O_Pay_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) =>
                  f.key ===
                  (values.newDoubleOvertimePayRateDuration ??
                    Number(values.doubleOvertimePayRateDuration))
              )?.text || "",

            D_O_Pay_Rate_PA_After:
              values.newDoubleOvertimePayRate ??
              Number(values.doubleOvertimePayRate),

            D_O_Bill_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) =>
                  c.key ===
                  (values.newDoubleOvertimeBillRateCurrency ??
                    Number(values.doubleOvertimeBillRateCurrency))
              )?.text || "",

            D_O_Bill_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) =>
                  f.key ===
                  (values.newDoubleOvertimeBillRateDuration ??
                    Number(values.doubleOvertimeBillRateDuration))
              )?.text || "",

            D_O_Bill_Rate_PA_After:
              values.newDoubleOvertimeBillRate ??
              Number(values.doubleOvertimeBillRate),

            Per_Diem_Cost_Rate_Currency_Type_PA_After:
              currencyOptions.find(
                (c) => c.key === Number(values.perDiemCostCurrency)
              )?.text || "",
            Per_Diem_Cost_Rate_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) => f.key === Number(values.perDiemCostDuration)
              )?.text || "",
            Per_Diem_Cost_Rate_PA_After: Number(values.perDiemCost),

            Non_Billable_Bonus_Currency_Type_PA_After:
              currencyOptions.find(
                (c) => c.key === Number(values.nonBillableBonusCurrency)
              )?.text || "",
            Non_Billable_Bonus_Frequency_Type_PA_After:
              rateFrequencyOptions.find(
                (f) => f.key === Number(values.nonBillableBonusDuration)
              )?.text || "",
            Non_Billable_Bonus_Rate_PA_After: Number(values.nonBillableBonus),

            Contract_Duration_In_Months_PA_After: values.contractDurationMonths,
            No_of_Hoursonthis_Position_PA_After: values.noOfHoursOnThisPosition,
            Tentative_Joining_Date_PA_After: values.tentativeJoiningDate
              ? dayjs(values.tentativeJoiningDate).format("YYYY-MM-DDT00:00:00")
              : null,
            Proposed_End_Date_PA_After: values.proposedEndDate
              ? dayjs(values.proposedEndDate).format("YYYY-MM-DDT00:00:00")
              : null,
            Payroll_Schedule_PA_After: values.payrollSchedule,
            Typeof_Engagement_PA_After: values.typeOfEngagement,
            Work_Authorization_Status_PA_After: values.workAuthorizationStatus,
            Work_Authorization_Expiration_Date_PA_After:
              values.workAuthorizationExpirationDate
                ? dayjs(values.workAuthorizationExpirationDate).format(
                    "YYYY-MM-DDT00:00:00"
                  )
                : null,
            Requirement_ID_PA_After: values.requirementID,
            Contingent_Worker_ID_PA_After: values.contingentWorkerID,
            Requirement_Classification_PA_After:
              values.requirementClassification,

            Hiring_Manager_PA_After:
              hiringManagerOptions.find(
                (h) => h.key === Number(values.hiringManager)
              )?.text || "",
            Hiring_Manager_Id_PA_After: Number(values.hiringManager),
            SP_Hiring_Manager_ID_PA_After:
              hiringManagerOptions.find(
                (h) => h.key === Number(values.hiringManager)
              )?.iVariteHiringMangerID || null,

            Recruiter_PA_After: recruiterNameEmail || "",
            Secondary_Recruiter_PA_After: secRecruiterNameEmail || "",
            Team_Lead_PA_After: teamLeadNameEmail || "",
            Account_Manager_PA_After: accountManagerNameEmail || "",
            Associate_Account_Manager_PA_After:
              associateAccountManagerNameEmail || "",
            Shared_Service_Manager_PA_After:
              sharedServiceManagerNameEmail || "",
            Seconday_Accoount_Manager_PA_After:
              secAccountManagerNameEmail || "",

            Director_Name_PA_After: values.deliveryDirectorName,
            Director_ID_PA_After: values.deliveryDirectorId,
            Source_Website_PA_After: values.sourceWebsite,
            Vendor_Email_Address_PA_After: values.vendorEmailAddress,
            Vendor_Name_and_Details_PA_After: values.vendorNameAndDetails,
            Date_of_Joining_PA_After: values.dateOfJoining
              ? dayjs(values.dateOfJoining).format("YYYY-MM-DDT00:00:00")
              : null,
            Vendor_C_O_I_Required_PA_After: values.vendorCOIrequired,
            Vendor_C_O_I_Expiration_PA_After: values.vendorCOIexpiration
              ? dayjs(values.vendorCOIexpiration).format("YYYY-MM-DDT00:00:00")
              : null,
            Vendor_C_O_I_Calculated_Date_PA_After:
              values.vendorCOIexpirationDateField
                ? dayjs(values.vendorCOIexpirationDateField).format(
                    "YYYY-MM-DDT00:00:00"
                  )
                : null,
            Post_Joining_Follow_up_PA_After: values.postJoiningConsultant
              ? dayjs(values.postJoiningConsultant).format(
                  "YYYY-MM-DDT00:00:00"
                )
              : null,
            Onboarding_Specialist_Name_PA_After: onboardingSpeNameEmail || "",
            Operation_Manager_Name_PA_After: operationManagerNameEmail || "",
            Comments: values.comments,

            isPayRateBillRate_Changed: values.payRateBillRateChange,

            isPay_Rate_Updated: values.payRateEffectiveDate ? true : false,
            isBill_Rate_Updated: values.billRateEffectiveDate ? true : false,

            idPEffectiveDate: values.payRateEffectiveDate
              ? dayjs(values.payRateEffectiveDate).format("YYYY-MM-DDT00:00:00")
              : today,
            idBEffectiveDate: values.billRateEffectiveDate
              ? dayjs(values.billRateEffectiveDate).format(
                  "YYYY-MM-DDT00:00:00"
                )
              : today,

            Benefit_Cost_After: values.benefitCost,
            Enrollment_Status_After: values.enrollmentStatus,
            Employee_Engagement_After: values.employeeEngagement,
            Enrollment_401k_Date_After: values.enrollment401kDate
              ? dayjs(values.enrollment401kDate).format("YYYY-MM-DDT00:00:00")
              : null,
            Employee_Engagement_Date_After: values.employeeEngagementDate
              ? dayjs(values.employeeEngagementDate).format(
                  "YYYY-MM-DDT00:00:00"
                )
              : null,
            Finance_Specialist_After: financeSpecialistNameEmail || "",
            Create_Add_Employee_QB_After: values.createAddEmployeeQB,
            Create_Upload_Paylocity_File_After:
              values.createUploadPaylocityFile,
            Paylocity_Login_Instructions_After:
              values.paylocityLoginInstructions,
            Verify_Work_Location_Setup_After: values.verifyWorkLocationSetup,
            Review_Tax_Setup_Paylocity_After: values.reviewTaxSetupPaylocity,
            Review_Sick_Hours_Setup_Paylocity_After:
              values.reviewSickHoursSetupPaylocity,
            Offboarding_Specialist_After: offboardignSpeNameEmail || "",
            Date_of_Termination_After: values.DateofTermination
              ? dayjs(values.DateofTermination).format("YYYY-MM-DDT00:00:00")
              : null,
            Reason_For_Termination_After: values.reasonForTermination,
            Separation_Document_After: values.separationDocument,
            Asset_Return_After: values.assetReturn,
            Medical_Benefit_Termination_After: values.medicalBenefitTermination,
            K401_Distribution_After: values.k401Distribution,
            Final_Paycheck_After: values.finalPaycheck,
            Final_Paycheck_Date_After: values.finalPaycheckDate
              ? dayjs(values.finalPaycheckDate).format("YYYY-MM-DDT00:00:00")
              : null,
            Kantola_Trainings_After: values.kantolaTrainings,
            Move_Consultant_Folder_After: values.moveConsultantFolder,

            //////////////////////////////// Edit Values:
            Edit_History: buildChangeLogString({
              isEditMode: isEdit,
              prevValues: EditFormInitialValues as EditFormValues,
              currValues: values as EditFormValues,
            }),
            First_Name_PA_Before: EditFormInitialValues?.consultantFirstName,
            Middle_Name_PA_Before: EditFormInitialValues?.consultantMiddleName,
            Last_Name_PA_Before: EditFormInitialValues?.consultantLastName,
            Suffix_PA_Before: EditFormInitialValues?.suffix,
            Employee_Name_PA_Before: EditFormInitialValues?.consultantFullName,
            Gender_PA_Before: EditFormInitialValues?.consultantGender,
            Home_Phone_PA_Before: EditFormInitialValues?.phoneNumber,
            Email_PA_Before: EditFormInitialValues?.email,
            Home_Address_PA_Before: EditFormInitialValues?.homeAddressStreet,
            Home_Address_Postal_Code_PA_Before:
              EditFormInitialValues?.homeAddressPostalCode,

            Home_Country_PA_Before:
              homeCountries.find(
                (c) =>
                  c.key === Number(EditFormInitialValues?.homeAddressCountry)
              )?.text || "",
            Home_State_PA_Before:
              homeStates.find(
                (s) =>
                  s.key ===
                  Number(EditFormInitialValues?.homeAddressStateOrProvince)
              )?.text || "",
            Home_City_PA_Before:
              homeCities.find(
                (c) => c.key === Number(EditFormInitialValues?.homeAddressCity)
              )?.text || "",

            Work_Country_PA_Before:
              countries.find(
                (c) => c.key === Number(EditFormInitialValues?.workCountry)
              )?.text || "",
            Work_State_PA_Before:
              states.find(
                (s) => s.key === Number(EditFormInitialValues?.workState)
              )?.text || "",
            Work_City_PA_Before:
              cities.find(
                (c) => c.key === Number(EditFormInitialValues?.workCity)
              )?.text || "",

            Work_Address_PA_Before: EditFormInitialValues?.workLocation,
            Exempt_Status_PA_Before: EditFormInitialValues?.exemptStatus,
            Typeof_Placement_PA_Before: EditFormInitialValues?.typeOfPlacement,
            Employee_Status_PA_Before:
              employeeStatusOptions.find(
                (e) => e.key === Number(EditFormInitialValues?.employeeStatus)
              )?.text || "",

            Client_Name_PA_Before:
              clientOptions.find(
                (c) => c.key === Number(EditFormInitialValues?.clientName)
              )?.text || "",
            Client_Id_PA_Before: Number(EditFormInitialValues?.clientName),
            SP_Client_ID_PA_Before:
              clientOptions.find(
                (c) => c.key === Number(EditFormInitialValues?.clientName)
              )?.iVariteClientId || null,

            Client_Sub_Vendor_PA_Before: EditFormInitialValues?.clientSubVendor,
            Job_Duities_PA_Before: EditFormInitialValues?.jobDuties,
            Division_PA_Before: EditFormInitialValues?.division,
            Pay_Type_PA_Before: EditFormInitialValues?.payRateType,
            Job_Title_PA_Before: EditFormInitialValues?.jobTitle,

            Pay_Rate_Currency_Type_PA_Before:
              currencyOptions.find(
                (c) => c.key === Number(EditFormInitialValues?.payRateCurrency)
              )?.text || "",
            Pay_Rate_Frequency_Type_PA_Before:
              rateFrequencyOptions.find(
                (f) => f.key === Number(EditFormInitialValues?.payRateDuration)
              )?.text || "",
            Pay_Rate_PA_Before: Number(EditFormInitialValues?.payRate),

            Bill_Rate_Currency_Type_PA_Before:
              currencyOptions.find(
                (c) => c.key === Number(EditFormInitialValues?.billRateCurrency)
              )?.text || "",
            Bill_Rate_Frequency_Type_PA_Before:
              rateFrequencyOptions.find(
                (f) => f.key === Number(EditFormInitialValues?.billRateDuration)
              )?.text || "",
            Bill_Rate_PA_Before: Number(EditFormInitialValues?.billRate),

            O_Pay_Rate_Currency_Type_PA_Before:
              currencyOptions.find(
                (c) =>
                  c.key ===
                  Number(EditFormInitialValues?.overtimePayRateCurrency)
              )?.text || "",
            O_Pay_Rate_Frequency_Type_PA_Before:
              rateFrequencyOptions.find(
                (f) =>
                  f.key ===
                  Number(EditFormInitialValues?.overtimePayRateDuration)
              )?.text || "",
            O_Pay_Rate_PA_Before: Number(
              EditFormInitialValues?.overtimePayRate
            ),

            O_Bill_Rate_Currency_Type_PA_Before:
              currencyOptions.find(
                (c) =>
                  c.key ===
                  Number(EditFormInitialValues?.overtimeBillRateCurrency)
              )?.text || "",
            O_Bill_Rate_Frequency_Type_PA_Before:
              rateFrequencyOptions.find(
                (f) =>
                  f.key ===
                  Number(EditFormInitialValues?.overtimeBillRateDuration)
              )?.text || "",
            O_Bill_Rate_PA_Before: Number(
              EditFormInitialValues?.overtimeBillRate
            ),

            D_O_Pay_Rate_Currency_Type_PA_Before:
              currencyOptions.find(
                (c) =>
                  c.key ===
                  Number(EditFormInitialValues?.doubleOvertimePayRateCurrency)
              )?.text || "",
            D_O_Pay_Rate_Frequency_Type_PA_Before:
              rateFrequencyOptions.find(
                (f) =>
                  f.key ===
                  Number(EditFormInitialValues?.doubleOvertimePayRateDuration)
              )?.text || "",
            D_O_Pay_Rate_PA_Before: Number(
              EditFormInitialValues?.doubleOvertimePayRate
            ),

            D_O_Bill_Rate_Currency_Type_PA_Before:
              currencyOptions.find(
                (c) =>
                  c.key ===
                  Number(EditFormInitialValues?.doubleOvertimeBillRateCurrency)
              )?.text || "",
            D_O_Bill_Rate_Frequency_Type_PA_Before:
              rateFrequencyOptions.find(
                (f) =>
                  f.key ===
                  Number(EditFormInitialValues?.doubleOvertimeBillRateDuration)
              )?.text || "",
            D_O_Bill_Rate_PA_Before: Number(
              EditFormInitialValues?.doubleOvertimeBillRate
            ),

            Per_Diem_Cost_Rate_Currency_Type_PA_Before:
              currencyOptions.find(
                (c) =>
                  c.key === Number(EditFormInitialValues?.perDiemCostCurrency)
              )?.text || "",
            Per_Diem_Cost_Rate_Frequency_Type_PA_Before:
              rateFrequencyOptions.find(
                (f) =>
                  f.key === Number(EditFormInitialValues?.perDiemCostDuration)
              )?.text || "",
            Per_Diem_Cost_Rate_PA_Before: Number(
              EditFormInitialValues?.perDiemCost
            ),

            Non_Billable_Bonus_Currency_Type_PA_Before:
              currencyOptions.find(
                (c) =>
                  c.key ===
                  Number(EditFormInitialValues?.nonBillableBonusCurrency)
              )?.text || "",
            Non_Billable_Bonus_Frequency_Type_PA_Before:
              rateFrequencyOptions.find(
                (f) =>
                  f.key ===
                  Number(EditFormInitialValues?.nonBillableBonusDuration)
              )?.text || "",
            Non_Billable_Bonus_Rate_PA_Before: Number(
              EditFormInitialValues?.nonBillableBonus
            ),

            Contract_Duration_In_Months_PA_Before:
              EditFormInitialValues?.contractDurationMonths,
            No_of_Hoursonthis_Position_PA_Before:
              EditFormInitialValues?.noOfHoursOnThisPosition,
            Tentative_Joining_Date_PA_Before:
              EditFormInitialValues?.tentativeJoiningDate
                ? dayjs(EditFormInitialValues?.tentativeJoiningDate).format(
                    "YYYY-MM-DDT00:00:00"
                  )
                : null,
            Proposed_End_Date_PA_Before: EditFormInitialValues?.proposedEndDate
              ? dayjs(EditFormInitialValues?.proposedEndDate).format(
                  "YYYY-MM-DDT00:00:00"
                )
              : "",
            Payroll_Schedule_PA_Before: EditFormInitialValues?.payrollSchedule,
            Typeof_Engagement_PA_Before:
              EditFormInitialValues?.typeOfEngagement,
            Work_Authorization_Status_PA_Before:
              EditFormInitialValues?.workAuthorizationStatus,
            Work_Authorization_Expiration_Date_PA_Before:
              EditFormInitialValues?.workAuthorizationExpirationDate
                ? dayjs(
                    EditFormInitialValues?.workAuthorizationExpirationDate
                  ).format("YYYY-MM-DDT00:00:00")
                : null,
            Requirement_ID_PA_Before: EditFormInitialValues?.requirementID,
            Contingent_Worker_ID_PA_Before:
              EditFormInitialValues?.contingentWorkerID,
            Requirement_Classification_PA_Before:
              EditFormInitialValues?.requirementClassification,

            Hiring_Manager_PA_Before:
              hiringManagerOptions.find(
                (h) => h.key === Number(EditFormInitialValues?.hiringManager)
              )?.text || "",
            Hiring_Manager_Id_PA_Before: Number(
              EditFormInitialValues?.hiringManager
            ),
            SP_Hiring_Manager_ID_PA_Before:
              hiringManagerOptions.find(
                (h) => h.key === Number(EditFormInitialValues?.hiringManager)
              )?.iVariteHiringMangerID || null,

            Recruiter_PA_Before: beforeRecruiterName || "",
            Secondary_Recruiter_PA_Before: beforeSecondaryRecruiterName || "",
            Team_Lead_PA_Before: beforeTeamLead || "",
            Account_Manager_PA_Before: beforeAccountManagerName || "",
            Associate_Account_Manager_PA_Before:
              beforeAssociateAccountManagerName || "",
            Shared_Service_Manager_PA_Before:
              beforeSharedServiceManagerName || "",
            Seconday_Accoount_Manager_PA_Before:
              beforeSecondaryAccountManagerName || "",

            Director_Name_PA_Before:
              EditFormInitialValues?.deliveryDirectorName,
            Director_ID_PA_Before: EditFormInitialValues?.deliveryDirectorId,
            Source_Website_PA_Before: EditFormInitialValues?.sourceWebsite,
            Vendor_Email_Address_PA_Before:
              EditFormInitialValues?.vendorEmailAddress,
            Vendor_Name_and_Details_PA_Before:
              EditFormInitialValues?.vendorNameAndDetails,
            Date_of_Joining_PA_Before: EditFormInitialValues?.dateOfJoining
              ? dayjs(EditFormInitialValues.dateOfJoining).format(
                  "YYYY-MM-DDT00:00:00"
                )
              : null,
            Vendor_C_O_I_Required_PA_Before:
              EditFormInitialValues?.vendorCOIrequired,
            Vendor_C_O_I_Expiration_PA_Before:
              EditFormInitialValues?.vendorCOIexpiration
                ? dayjs(EditFormInitialValues?.vendorCOIexpiration).format(
                    "YYYY-MM-DDT00:00:00"
                  )
                : null,
            Vendor_C_O_I_Calculated_Date_PA_Before:
              EditFormInitialValues?.vendorCOIexpirationDateField
                ? dayjs(
                    EditFormInitialValues?.vendorCOIexpirationDateField
                  ).format("YYYY-MM-DDT00:00:00")
                : null,
            Post_Joining_Follow_up_PA_Before:
              EditFormInitialValues?.postJoiningConsultant
                ? dayjs(EditFormInitialValues?.postJoiningConsultant).format(
                    "YYYY-MM-DDT00:00:00"
                  )
                : null,
            Onboarding_Specialist_Name_PA_Before: beforeOnboardingSpe || "",
            // Onboarding_Specialist_Name_PA_Before:
            //   EditFormInitialValues?.onboardingSpecialist || "",

            // Operation_Manager_Name_PA_Before: operationManagerNameEmail || "",
            Operation_Manager_Name_PA_Before: beforeOperationsMan || "",
            Comments_Before: EditFormInitialValues?.comments || "",

            Benefit_Cost_Before: EditFormInitialValues?.benefitCost,
            Enrollment_Status_Before: EditFormInitialValues?.enrollmentStatus,
            Employee_Engagement_Before:
              EditFormInitialValues?.employeeEngagement,
            Enrollment_401k_Date_Before:
              EditFormInitialValues?.enrollment401kDate
                ? dayjs(EditFormInitialValues.enrollment401kDate).format(
                    "YYYY-MM-DDT00:00:00"
                  )
                : null,
            Employee_Engagement_Date_Before:
              EditFormInitialValues?.employeeEngagementDate
                ? dayjs(EditFormInitialValues.employeeEngagementDate).format(
                    "YYYY-MM-DDT00:00:00"
                  )
                : null,
            Finance_Specialist_Before: beforeFinanceSpe || "",
            // Finance_Specialist_Before:
            //   EditFormInitialValues?.financeSpecialist || "",

            Create_Add_Employee_QB_Before:
              EditFormInitialValues?.createAddEmployeeQB,
            Create_Upload_Paylocity_File_Before:
              EditFormInitialValues?.createUploadPaylocityFile,
            Paylocity_Login_Instructions_Before:
              EditFormInitialValues?.paylocityLoginInstructions,
            Verify_Work_Location_Setup_Before:
              EditFormInitialValues?.verifyWorkLocationSetup,
            Review_Tax_Setup_Paylocity_Before:
              EditFormInitialValues?.reviewTaxSetupPaylocity,
            Review_Sick_Hours_Setup_Paylocity_Before:
              EditFormInitialValues?.reviewSickHoursSetupPaylocity,
            Offboarding_Specialist_Before: beforeOffboardingSpe || "",
            // Offboarding_Specialist_Before:
            //   EditFormInitialValues?.offboardingspecialist || "",

            Date_of_Termination_Before: EditFormInitialValues?.DateofTermination
              ? dayjs(EditFormInitialValues.DateofTermination).format(
                  "YYYY-MM-DDT00:00:00"
                )
              : null,
            Reason_For_Termination_Before:
              EditFormInitialValues?.reasonForTermination,
            Separation_Document_Before:
              EditFormInitialValues?.separationDocument,
            Asset_Return_Before: EditFormInitialValues?.assetReturn,
            Medical_Benefit_Termination_Before:
              EditFormInitialValues?.medicalBenefitTermination,
            K401_Distribution_Before: EditFormInitialValues?.k401Distribution,
            Final_Paycheck_Before: EditFormInitialValues?.finalPaycheck,
            Final_Paycheck_Date_Before: EditFormInitialValues?.finalPaycheckDate
              ? dayjs(EditFormInitialValues.finalPaycheckDate).format(
                  "YYYY-MM-DDT00:00:00"
                )
              : null,
            Kantola_Trainings_Before: EditFormInitialValues?.kantolaTrainings,
            Move_Consultant_Folder_Before:
              EditFormInitialValues?.moveConsultantFolder,

            isEdited: true,
          },
        };

        const requestBodyEdit = JSON.stringify(powerAutomateEditRequestBody);

        console.log(
          "Request Body for SharePoint List Update API - Edited :",
          requestBodyEdit
        );

        const sharePointListUpdateApiResponse = await fetch(
          sharePointListUpdateApiUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: requestBodyEdit,
          }
        );

        if (!sharePointListUpdateApiResponse.ok) {
          throw new Error("Failed to trigger second API");
        }
      }

      alert(
        isEdit
          ? "Updated successfully!"
          : `Entry created successfully and has been sent for approval to ${values?.accountManagerFirstName} ${values?.accountManagerLastName}`
      );
      actions.setSubmitting(false);
      navigate(-1);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        isEdit
          ? "Update failed. Please try again."
          : "Submission failed. Please try again."
      );
      actions.setSubmitting(false);
    }
  };

  const fetchCountries = async () => {
    console.log("Fetching countries");
    try {
      // const response = await fetch(
      //   // `http://localhost:7071/api/countryStatesCities/list`
      //   `https://varfunctiontypescriptcst.azurewebsites.net/api/countryStatesCities/list?`
      // );
      // const data: Country[] = await response.json();
      const data: Country[] = await ApiClient.get("countryStatesCities/list");
      setCountries(
        data.map((c: Country) => ({
          key: c.iCountryId, // Store ID
          text: c.cCountryName, // Display Name
        }))
      );
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (countryId: number) => {
    console.log("Fetching states for countryId:", countryId);
    try {
      // const response = await fetch(
      //   // `http://localhost:7071/api/countryStatesCities/list/${countryId}`
      //   `https://varfunctiontypescriptcst.azurewebsites.net/api/countryStatesCities/list/${countryId}?`
      // );

      // const data: State[] = await response.json();

      const data: State[] = await ApiClient.get(
        `countryStatesCities/list/${countryId}`
      );

      setStates(
        data.map((s) => ({
          key: s.iStateId, // Store ID
          text: s.cStateName, // Display Name
        }))
      );

      console.log("Fetched States:", data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (countryId: number, stateId: number) => {
    console.log(
      "Fetching cities for countryId:",
      countryId,
      "stateId:",
      stateId
    );
    try {
      // const response = await fetch(
      //   // `http://localhost:7071/api/countryStatesCities/list/${countryId}/${stateId}`
      //   `https://varfunctiontypescriptcst.azurewebsites.net/api/countryStatesCities/list/${countryId}/${stateId}?`
      // );

      // const data: City[] = await response.json();
      const data: City[] = await ApiClient.get(
        `countryStatesCities/list/${countryId}/${stateId}?`
      );
      setCities(
        data.map((c) => ({
          key: c.iCityid, // Store ID
          text: c.cCityName, // Display Name
        }))
      );

      console.log("Fetched Cities:", data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchHomeCountries = async () => {
    try {
      // const response = await fetch(
      //   // `http://localhost:7071/api/countryStatesCities/list`
      //   `https://varfunctiontypescriptcst.azurewebsites.net/api/countryStatesCities/list?`
      // );
      // const data: Country[] = await response.json();
      const data: Country[] = await ApiClient.get("countryStatesCities/list?");

      setHomeCountries(
        data.map((c: Country) => ({
          key: c.iCountryId, // Store ID
          text: c.cCountryName, // Display Name
        }))
      );
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchHomeStates = async (countryId: number) => {
    try {
      // const response = await fetch(
      //   // `http://localhost:7071/api/countryStatesCities/list/${countryId}`
      //   `https://varfunctiontypescriptcst.azurewebsites.net/api/countryStatesCities/list/${countryId}?`
      // );

      // const data: State[] = await response.json();

      const data: State[] = await ApiClient.get(
        `countryStatesCities/list/${countryId}?`
      );

      setHomeStates(
        data.map((s) => ({
          key: s.iStateId, // Store ID
          text: s.cStateName, // Display Name
        }))
      );

      console.log("Fetched States:", data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchHomeCities = async (countryId: number, stateId: number) => {
    try {
      // const response = await fetch(
      //   // `http://localhost:7071/api/countryStatesCities/list/${countryId}/${stateId}`
      //   `https://varfunctiontypescriptcst.azurewebsites.net/api/countryStatesCities/list/${countryId}/${stateId}?`
      // );

      // const data: City[] = await response.json();

      const data: City[] = await ApiClient.get(
        `countryStatesCities/list/${countryId}/${stateId}?`
      );

      setHomeCities(
        data.map((c) => ({
          key: c.iCityid, // Store ID
          text: c.cCityName, // Display Name
        }))
      );

      console.log("Fetched Cities:", data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const subHeaders: SubHeaderItem[] = [
    {
      id: "candidateDetails",
      label: "Candidate Details",
      content: (
        <CandidateDetails
          isViewMode={isViewMode}
          countries={countries}
          setCountries={setCountries}
          states={states}
          setStates={setStates}
          cities={cities}
          setCities={setCities}
          fetchStates={fetchStates}
          fetchCities={fetchCities}
          homeCountries={homeCountries}
          setHomeCountries={setHomeCountries}
          homeStates={homeStates}
          setHomeStates={setHomeStates}
          homeCities={homeCities}
          setHomeCities={setHomeCities}
          fetchHomeStates={fetchHomeStates}
          fetchHomeCities={fetchHomeCities}
        />
      ),
    },
    {
      id: "jobDetails",
      label: "Job Details",
      content: (
        <JobDetails
          currencyOptions={currencyOptions}
          clientOptions={clientOptions}
          employeeStatusOptions={employeeStatusOptions}
          rateFrequencyOptions={rateFrequencyOptions}
          EditFormInitialValues={EditFormInitialValues}
          isViewMode={isViewMode}
          clientMsp={clientMsp}
          setClientMsp={setClientMsp}
        />
      ),
    },
    {
      id: "recruiterDetails",
      label: "Recruiter Details",
      content: (
        <RecruiterDetails
          context={context}
          hiringManagerOptions={hiringManagerOptions}
          EditFormInitialValues={EditFormInitialValues}
          isViewMode={isViewMode}
          recruiterNameEmail={recruiterNameEmail}
          setRecruiterNameEmail={setRecruiterNameEmail}
          secRecruiterNameEmail={secRecruiterNameEmail}
          setSecRecruiterNameEmail={setSecRecruiterNameEmail}
          teamLeadNameEmail={teamLeadNameEmail}
          setTeamLeadNameEmail={setTeamLeadNameEmail}
          accountManagerNameEmail={accountManagerNameEmail}
          setAccountManagerNameEmail={setAccountManagerNameEmail}
          associateAccountManagerNameEmail={associateAccountManagerNameEmail}
          setAssociateAccountManagerNameEmail={
            setAssociateAccountManagerNameEmail
          }
          sharedServiceManagerNameEmail={sharedServiceManagerNameEmail}
          setSharedServiceManagerNameEmail={setSharedServiceManagerNameEmail}
          secAccountManagerNameEmail={secAccountManagerNameEmail}
          setSecAccountManagerNameEmail={setSecAccountManagerNameEmail}
        />
      ),
    },
    {
      id: "joiningDetails",
      label: "Joining Details",
      content: (
        <JoiningDetails
          EditFormInitialValues={EditFormInitialValues}
          isViewMode={isViewMode}
        />
      ),
    },
    {
      id: "onboarding",
      label: "Onboarding Details",
      content: (
        <Onboarding
          context={context}
          EditFormInitialValues={EditFormInitialValues}
          isViewMode={isViewMode}
          createdBy={createdBy.id}
          onboardingSpeNameEmail={onboardingSpeNameEmail}
          setOnboardingSpeNameEmail={setOnboardingSpeNameEmail}
          operationManagerNameEmail={operationManagerNameEmail}
          setOperationManagerNameEmail={setOperationManagerNameEmail}
          sendAppointmentLetter={sendAppointmentLetter}
          sendInitialEmail={sendInitialEmail}
          showActionButtons={showActionButtons}
        />
      ),
    },
    ...(consultantId
      ? // Edit mode + View Mode(ConsltantId is present + View Mode is true) :
        // consulantId check condition can only work here as it is
        // present in both view + edit ( but also we can add || viewMode)
        [
          {
            id: "benefits",
            label: "Consultant Benefits",
            content: (
              <Benefits
                EditFormInitialValues={EditFormInitialValues}
                isViewMode={isViewMode}
              />
            ),
          },
          {
            id: "financeCheckList",
            label: "Finance Checklist",
            content: (
              <FinanceChecklist
                context={context}
                EditFormInitialValues={EditFormInitialValues}
                isViewMode={isViewMode}
                financeSpecialistNameEmail={financeSpecialistNameEmail}
                setFinanceSpecialistNameEmail={setFinanceSpecialistNameEmail}
              />
            ),
          },
          {
            id: "offBoarding",
            label: "Offboarding Details",
            content: (
              <Offboarding
                context={context}
                EditFormInitialValues={EditFormInitialValues}
                isViewMode={isViewMode}
                offboardignSpeNameEmail={offboardignSpeNameEmail}
                setOffboardignSpeNameEmail={setOffboardignSpeNameEmail}
              />
            ),
          },
          {
            id: "comments",
            label: "Comments Section",
            content: (
              <Comments
                EditFormInitialValues={EditFormInitialValues}
                isViewMode={isViewMode}
              />
            ),
          },
          {
            id: "history",
            label: "Consultant History",
            content: <History consultantId={consultantId} />,
          },

          // {
          //   id: "otherStatuses",
          //   label: "OTHER STATUSES",
          //   content: <OtherStatuses isViewMode={isViewMode} />,
          // },
        ]
      : []),
  ];

  async function fetchTasksFromLists(
    id: string,
    listNames: string[]
  ): Promise<any[]> {
    let tasksData: any[] = [];

    try {
      // 🔹 Fetch all lists in parallel
      const responses = await Promise.all(
        listNames.map((listName) =>
          fetch(
            `https://varite.sharepoint.com/usa/USOnboarding/_api/web/lists/getbytitle('${listName}')/items?$filter=FID eq '${id}'`,
            {
              method: "GET",
              headers: {
                Accept: "application/json;odata=verbose",
              },
            }
          )
        )
      );

      // 🔹 Convert all responses to JSON
      const results = await Promise.all(responses.map((res) => res.json()));

      // 🔹 Merge results from all lists without flatMap
      results.forEach((data) => {
        const items = data?.d?.results || [];
        tasksData = tasksData.concat(items);
      });

      // debugger;
      console.log("✅ Combined Tasks Data:", tasksData);
    } catch (error) {
      console.error("❌ Error fetching tasks from multiple lists:", error);
      throw error;
    }

    return tasksData;
  }

  useEffect(() => {
    const loadData = async () => {
      console.log("Loading data for form");
      await fetchCountries(); // Ensure countries are fetched before proceeding
      await fetchHomeCountries(); // Ensure home countries are fetched before proceeding
      if (consultantId) {
        try {
          // const response = await fetch(
          //   `https://varfunctiontypescriptcst.azurewebsites.net/api/view-client-info/view?consultantId=${consultantId}&consultantType=0&history=0`
          // );

          // const data = await response.json();

          const data = await ApiClient.get(
            `view-client-info/view?consultantId=${consultantId}&consultantType=0&history=0`
          );
          const result = data?.result;

          console.log("Fetched client info:", result);

          if (Array.isArray(result) && result.length > 0) {
            const [
              personalInfo = [{}],
              rateInfo = [],
              reportingInfo = [{}],
              offboardingInfo = [{}],
              onboardingInfo = [{}],
              financeInfo = [{}],
              benefitsInfo = [{}],
            ] = result;

            const emailOnboardingBefore = await fetchUserById(
              onboardingInfo[0]?.iOnboardingSpecialist
            );
            setbeforeOnboardingSpe(emailOnboardingBefore);

            const emailFinanceBefore = await fetchUserById(
              financeInfo[0]?.iFinanceSpecialistId
            );
            setbeforeFinanceSpe(emailFinanceBefore);

            const emailOperationMan = await fetchUserById(
              onboardingInfo[0]?.iOperationManager
            );
            setbeforeOperationsMan(emailOperationMan);

            const emailOffboardingBefore = await fetchUserById(
              offboardingInfo[0]?.cOffboardingSpecialist
            );
            setbeforOffboardingSpe(emailOffboardingBefore);

            // Recruiter Name
            const emailRecruiterBefore = await fetchUserById(
              reportingInfo[0]?.iRecruiterId
            );
            setBeforeRecruiterName(emailRecruiterBefore);

            // Secondary Recruiter Name
            const emailSecondaryRecruiterBefore = await fetchUserById(
              reportingInfo[0]?.iSecondaryRecruiterId
            );
            setBeforeSecondaryRecruiterName(emailSecondaryRecruiterBefore);

            // Team Lead
            const emailTeamLeadBefore = await fetchUserById(
              reportingInfo[0]?.iTeamLeadId
            );
            setBeforeTeamLead(emailTeamLeadBefore);

            // Account Manager Name
            const emailAccountManagerBefore = await fetchUserById(
              reportingInfo[0]?.iAccountManagerId
            );
            setBeforeAccountManagerName(emailAccountManagerBefore);

            // Associate Account Manager Name
            const emailAssociateAccountManagerBefore = await fetchUserById(
              reportingInfo[0]?.iAssociateAccountManagerId
            );
            setBeforeAssociateAccountManagerName(
              emailAssociateAccountManagerBefore
            );

            // Shared Service Manager Name
            const emailSharedServiceManagerBefore = await fetchUserById(
              reportingInfo[0]?.iSharedServiceManagerId
            );
            setBeforeSharedServiceManagerName(emailSharedServiceManagerBefore);

            // Secondary Account Manager Name
            const emailSecondaryAccountManagerBefore = await fetchUserById(
              reportingInfo[0]?.iSecondaryAccountManagerId
            );
            setBeforeSecondaryAccountManagerName(
              emailSecondaryAccountManagerBefore
            );

            console.log(offboardingInfo);
            console.log(financeInfo);
            const id = personalInfo[0]?.iVariteEmployeeId ?? null;
            setVariteEmployeeId(id); // ✅ store for later

            const listNames = [
              "Candidate Status Tasks",
              "Finance Tasks",
              "Offboarding Tasks",
            ];

            const data = await fetchTasksFromLists(id, listNames);

            const task = data || {};
            console.log("First Task:", task);

            const getRateDetails = (typeId: number) =>
              rateInfo.find((r: any) => r.iRateTypeId === typeId) || {};

            const billRateData = getRateDetails(1);
            const payRateData = getRateDetails(2);
            const overtimeBillRateData = getRateDetails(3);
            const overtimePayRateData = getRateDetails(4);
            const doubleOvertimeBillRateData = getRateDetails(5);
            const doubleOvertimePayRateData = getRateDetails(6);
            const perDiemCostData = getRateDetails(7);
            const nonBillableBonusData = getRateDetails(8);

            console.log(
              "billRateData:",
              billRateData,
              "payRateData:",
              payRateData,
              "overtimeBillRateData:",
              overtimeBillRateData
            );

            const deliveryDirectorId = reportingInfo[0]?.iDirector ?? null;
            let deliveryDirectorName = "";
            if (deliveryDirectorId) {
              console.log(
                "Fetching delivery director name for ID:",
                deliveryDirectorId
              );
              try {
                const userInfoRes = await fetch(
                  `https://varite.sharepoint.com/_api/web/siteuserinfolist/items?$filter=ID eq '${deliveryDirectorId}'`,
                  {
                    headers: {
                      Accept: "application/json;odata=verbose",
                    },
                  }
                );
                const userInfoData = await userInfoRes.json();
                console.log("User Info Data:", userInfoData);
                deliveryDirectorName =
                  userInfoData?.d?.results?.[0]?.Title ?? "";
                console.log(
                  "Delivery Director Name from UserInfo:",
                  deliveryDirectorName
                );
              } catch (error) {
                console.error("Error fetching delivery director name:", error);
              }
            }

            console.log("Delivery Director Name:", deliveryDirectorName);

            const workCountry = personalInfo[0]?.iWorkCountry ?? null;
            const workState = personalInfo[0]?.iWorkState ?? null;
            const workCity = personalInfo[0]?.iWorkCity ?? null;
            console.log("Pre-setting values Work:", {
              workCountry,
              workState,
              workCity,
            });

            const homeCountry = personalInfo[0]?.iHomeCountry ?? null;
            const homeState = personalInfo[0]?.iHomeState ?? null;
            const homeCity = personalInfo[0]?.iHomeCity ?? null;
            console.log("Pre-setting values Home :", {
              homeCountry,
              homeState,
              homeCity,
            });

            //Work

            // Step 1: Set country
            if (workCountry) {
              await fetchStates(workCountry); // populates 'states'
            }
            // Step 2: Set state
            if (workCountry && workState) {
              await fetchCities(workCountry, workState); // populates 'cities'
            }

            //Home

            // Step 1: Set country
            if (homeCountry) {
              await fetchHomeStates(homeCountry); // populates 'states'
            }
            // Step 2: Set state
            if (homeCountry && homeState) {
              await fetchHomeCities(homeCountry, homeState); // populates 'cities'
            }

            // let tasksData: any[] = [];
            // try {
            //   const response = await fetch(
            //     `https://varite.sharepoint.com/usa/USOnboarding/_api/web/lists/getbytitle('Candidate Status Tasks')/items?$filter=FID eq '${id}'`,

            //     {
            //       method: "GET",
            //       headers: {
            //         Accept: "application/json;odata=verbose",
            //       },
            //     }
            //   );

            //   const data = await response.json();
            //   // console.log("Status Tasks API Response: Data", data);

            //   tasksData = data?.d?.results || [];
            //   debugger;

            //   // console.log("✅ Status Tasks Data:", tasksData);
            // } catch (error) {
            //   console.error("❌ Error fetching Status Tasks API:", error);
            //   throw error;
            // }

            // const task = tasksData[0] || {};
            // console.log("First Task:", task);

            const mappedValues: EditFormValues = {
              employeeId: personalInfo[0]?.iEmployeeId,
              consultantFirstName: personalInfo[0]?.cFirstName,
              consultantMiddleName: personalInfo[0]?.cMiddleName,
              consultantLastName: personalInfo[0]?.cLastName,
              suffix: personalInfo[0]?.cSuffix ?? "",
              consultantFullName: personalInfo[0]?.cEmployeeName ?? "",
              consultantGender: personalInfo[0]?.cGender ?? "",
              phoneNumber: personalInfo[0]?.cHomePhone ?? "",
              email: personalInfo[0]?.cEmail ?? "",
              homeAddressStreet: personalInfo[0]?.cHomeAddress ?? "",

              homeAddressCity: personalInfo[0]?.iHomeCity ?? null,
              homeAddressStateOrProvince: personalInfo[0]?.iHomeState ?? null,
              homeAddressCountry: personalInfo[0]?.iHomeCountry ?? null,

              homeAddressPostalCode: personalInfo[0]?.iHomeAddressPostalCode,
              workCity: personalInfo[0]?.iWorkCity ?? null,
              workLocation: personalInfo[0]?.cWorkLocation ?? "",
              workState: personalInfo[0]?.iWorkState ?? null,
              workCountry: personalInfo[0]?.iWorkCountry ?? null,

              comments: personalInfo[0]?.cComments ?? "",

              hiringManager: Number(reportingInfo[0]?.iHiringManager) ?? null,
              recruiterName: reportingInfo[0]?.iRecruiter ?? null,
              secondaryRecruiterName:
                reportingInfo[0]?.iSecondaryRecruiter ?? null,
              teamLead: reportingInfo[0]?.iTeamLead ?? null,
              accountManagerName: reportingInfo[0]?.iAccountManager ?? null,
              associateAccountManagerName:
                reportingInfo[0]?.iAssociateAccountManager ?? null,
              sharedServiceManagerName:
                reportingInfo[0]?.iSharedServiceManager ?? null,
              secondaryAccountManagerName:
                reportingInfo[0]?.iSecondayAccoountManager ?? null,
              deliveryDirectorName: deliveryDirectorName,
              deliveryDirectorId: reportingInfo[0]?.iDirector ?? null,
              sourceWebsite: personalInfo[0]?.cSourceWebsite ?? null,
              vendorEmailAddress: personalInfo[0]?.cVendorEmailAddress ?? "",
              vendorNameAndDetails: personalInfo[0]?.cVendorDetails ?? "",
              accountManagerFirstName: "",
              accountManagerLastName: "",

              exemptStatus: personalInfo[0]?.cExemptStatus ?? "",
              typeOfPlacement: personalInfo[0]?.cTypeofPlacement ?? "",
              employeeStatus: personalInfo[0]?.iEmployeeStatusId ?? null,
              clientName: personalInfo[0]?.iClientId ?? null,
              jobTitle: personalInfo[0]?.cJobTitle ?? "",
              clientSubVendor: personalInfo[0]?.cClientSubVendor ?? "",
              jobDuties: personalInfo[0]?.cJobDuities ?? "",
              division: personalInfo[0]?.cDivision ?? "",
              payRateType: personalInfo[0]?.cPayType ?? "",

              contractDurationMonths:
                personalInfo[0]?.iContactDurationInMonths ?? null,
              noOfHoursOnThisPosition:
                personalInfo[0]?.iNoofHoursonthisPosition ?? null,
              tentativeJoiningDate: personalInfo[0]?.dTentativeJoiningDate
                ? new Date(personalInfo[0]?.dTentativeJoiningDate)
                : null,
              proposedEndDate: personalInfo[0]?.dProposedEndDate
                ? new Date(personalInfo[0]?.dProposedEndDate)
                : null,
              payrollSchedule: personalInfo[0]?.cPayrollSchedule ?? "",
              typeOfEngagement: personalInfo[0]?.cTypeofEngagement ?? "",

              workAuthorizationStatus:
                personalInfo[0]?.cWorkAuthorizationStatus ?? "",
              workAuthorizationExpirationDate: personalInfo[0]
                ?.cWorkAuthorizationExpirationDate
                ? new Date(personalInfo[0]?.cWorkAuthorizationExpirationDate)
                : null,

              requirementID: personalInfo[0]?.cRequirementId ?? "",
              contingentWorkerID: personalInfo[0]?.cContingentWorkerId ?? "",
              requirementClassification:
                personalInfo[0]?.cRequirementClassification ?? "",

              payRate: payRateData.iRate ?? null,
              payRateDuration: payRateData.iRateFrequencyType ?? null,
              payRateCurrency: payRateData.iRateCurrencyType ?? null,

              billRate: billRateData.iRate ?? null,
              billRateDuration: billRateData.iRateFrequencyType ?? null,
              billRateCurrency: billRateData.iRateCurrencyType ?? null,

              overtimeBillRate: overtimeBillRateData.iRate ?? null,
              overtimeBillRateDuration:
                overtimeBillRateData.iRateFrequencyType ?? null,
              overtimeBillRateCurrency:
                overtimeBillRateData.iRateCurrencyType ?? null,

              overtimePayRate: overtimePayRateData.iRate ?? null,
              overtimePayRateDuration:
                overtimePayRateData.iRateFrequencyType ?? null,
              overtimePayRateCurrency:
                overtimePayRateData.iRateCurrencyType ?? null,

              doubleOvertimeBillRate: doubleOvertimeBillRateData.iRate ?? null,
              doubleOvertimeBillRateDuration:
                doubleOvertimeBillRateData.iRateFrequencyType ?? null,
              doubleOvertimeBillRateCurrency:
                doubleOvertimeBillRateData.iRateCurrencyType ?? null,

              doubleOvertimePayRate: doubleOvertimePayRateData.iRate ?? null,
              doubleOvertimePayRateDuration:
                doubleOvertimePayRateData.iRateFrequencyType ?? null,
              doubleOvertimePayRateCurrency:
                doubleOvertimePayRateData.iRateCurrencyType ?? null,

              perDiemCost: perDiemCostData.iRate ?? null,
              perDiemCostDuration: perDiemCostData.iRateFrequencyType ?? null,
              perDiemCostCurrency: perDiemCostData.iRateCurrencyType ?? null,

              nonBillableBonus: nonBillableBonusData.iRate ?? null,
              nonBillableBonusDuration:
                nonBillableBonusData.iRateFrequencyType ?? null,
              nonBillableBonusCurrency:
                nonBillableBonusData.iRateCurrencyType ?? null,

              dateOfJoining: personalInfo[0]?.cDateofJoining
                ? new Date(personalInfo[0]?.cDateofJoining)
                : null,
              timesheetAccess: personalInfo[0]?.cTimesheetAccess ?? "",
              medicalBenefits:
                personalInfo[0]?.cMedicalBenefitsPortalAccess ?? "",

              vendorCOIrequired: personalInfo[0]?.cVendorCOIRequired ?? "",
              vendorCOIexpiration: personalInfo[0]?.dVendorCOIExpiration
                ? new Date(personalInfo[0]?.dVendorCOIExpiration)
                : null,
              vendorCOIexpirationDateField: personalInfo[0]
                ?.dVendorCOIExpirationCalculatedDateField
                ? new Date(
                    personalInfo[0]?.dVendorCOIExpirationCalculatedDateField
                  )
                : null,

              postJoiningConsultant: personalInfo[0]
                ?.dPostJoiningConsultantFollowUp
                ? new Date(personalInfo[0]?.dPostJoiningConsultantFollowUp)
                : null,

              onboardingSpecialist:
                onboardingInfo[0]?.iOnboardingSpecialist ?? null,
              // onboardingSpecialist:
              //   task.Consultant_x0020_Full_x0020_Name ?? null,

              operationsManager: onboardingInfo[0]?.iOperationManager ?? null,
              //operationsManager: task.Consultant_x0020_Name ?? null,

              // identityverification: onboardingInfo[0]?.cIdentityverification ?? "",
              identityverification:
                task.length > 0 ? task[0]?.Identity_x0020_verification : "",

              // backgroundCheckPortalInvitation: onboardingInfo[0]?.cBackgroundCheckPortalInvitation ?? "",
              backgroundCheckPortalInvitation:
                task.length > 0
                  ? task[0]?.Background_x0020_Check_x0020_Por
                  : "",

              // backgroundCheckStatus: onboardingInfo[0]?.cBackgroundCheckStatus ?? "",
              backgroundCheckStatus:
                task.length > 0
                  ? task[0]?.Background_x0020_Check_x0020_Sta
                  : "",

              variteAssetAssigned:
                task.length > 0
                  ? task[0]?.VARITE_x0020_Assets_x0020_Assign
                  : "",

              // eSConsultantPacket: onboardingInfo[0]?.cESConsultantPacket ?? "",
              eSConsultantPacket:
                task.length > 0
                  ? task[0]?.ES_x0020__x002d__x0020_Consultan
                  : "",

              // eSStateDocuments: onboardingInfo[0]?.cESStateDocuments ?? "",
              eSStateDocuments:
                task.length > 0
                  ? task[0]?.ES_x0020__x002d__x0020_State_x00
                  : "",

              // eSClientPacket: onboardingInfo[0]?.cESClientPacket ?? "",
              eSClientPacket:
                task.length > 0
                  ? task[0]?.ES_x0020__x002d__x0020_Client_x0
                  : "",

              // adobeSendClientDocuments: onboardingInfo[0]?.cAdobeSendClientDocuments ?? "",
              adobeSendClientDocuments:
                task.length > 0
                  ? task[0]?.Adobe_x0020_Send_x0020__x0028_Cl
                  : "",

              // adobeSend401kPacket: onboardingInfo[0]?.cAdobeSend401KPacket ?? "",
              adobeSend401kPacket:
                task.length > 0
                  ? task[0]?.On_x0020_Adobe_x0020_Send_x0020_0
                  : "",

              // clientPacketupdatedtoClientPortal: onboardingInfo[0]?.cClientPacketUpdatedtoClientPortal ?? "",
              clientPacketupdatedtoClientPortal:
                task.length > 0
                  ? task[0]?.Client_x0020_Packet_x0020_update
                  : "",

              // kantolaTraining: onboardingInfo[0]?.cKantolaTraining ?? "",
              kantolaTraining:
                task.length > 0 ? task[0]?.Kantola_x0020_Training : "",

              // i9Scheduling: onboardingInfo[0]?.cI9Scheduling ?? "",
              i9Scheduling: task.length > 0 ? task[0]?.I9_x0020_Scheduling : "",

              // i9VerificationStatus: onboardingInfo[0]?.cI9VerificationStatus ?? "",
              i9VerificationStatus:
                task.length > 0
                  ? task[0]?.I9_x0020_Verification_x0020_Stat
                  : "",

              // checklistCreated: onboardingInfo[0]?.cChecklisCreated ?? "",
              checklistCreated:
                task.length > 0 ? task[0]?.Document_x0020_Printed : "",

              // firstDayInstructions: onboardingInfo[0]?.bFirstDayInstructionAccessBadges ? "Yes" : "No",
              firstDayInstructions:
                task.length > 0
                  ? task[0]?.On_x0020_First_x0020_Day_x0020_I
                    ? "Yes"
                    : "No"
                  : "",

              benefitCost: benefitsInfo[0]?.bBenefitCost ? "Yes" : "No",
              enrollmentStatus: benefitsInfo[0]?.c401KEnrollmentStatus ?? "",
              employeeEngagement: benefitsInfo[0]?.cEmployeeEngagement ?? "",
              enrollment401kDate: benefitsInfo[0]?.d401KEnrollmentDate
                ? new Date(benefitsInfo[0]?.d401KEnrollmentDate)
                : null,
              employeeEngagementDate: benefitsInfo[0]?.dEmployeeEngagementDate
                ? new Date(benefitsInfo[0]?.dEmployeeEngagementDate)
                : null,

              financeSpecialist: financeInfo[0]?.iFinanceSpecialistId ?? null, // ❌ old
              //financeSpecialist: task.Finance_x0020_Specialist ?? null, // ✅ SharePoint value

              // createAddEmployeeQB: financeInfo[0]?.cCreateAddEmployeetoQB ?? "", // ❌ old
              createAddEmployeeQB:
                task.length > 0
                  ? task[1]?.Create_x0020_Add_x0020_Employee_x0020_QB
                  : "",

              // createUploadPaylocityFile: financeInfo[0]?.cCreateUploadPaylocityFile ?? "",
              createUploadPaylocityFile:
                task.length > 0
                  ? task[1]?.Create_x0020_Upload_x0020_Paylocity_x0020_File
                  : "",

              // paylocityLoginInstructions: financeInfo[0]?.bPaylocityLogInInstructions ? "Yes" : "No",
              paylocityLoginInstructions:
                task.length > 0
                  ? task[1]?.Paylocity_x0020_Login_x0020_Instructions
                    ? "Yes"
                    : "No"
                  : "",

              // verifyWorkLocationSetup: financeInfo[0]?.cVerifyWorkLocationSetup ?? "",
              verifyWorkLocationSetup:
                task.length > 0
                  ? task[1]?.Verify_x0020_Work_x0020_Location_x0020_Setup
                  : "",

              // reviewTaxSetupPaylocity: financeInfo[0]?.cReviewTaxsetuponPaylocity ?? "",
              reviewTaxSetupPaylocity:
                task.length > 0
                  ? task[1]?.Review_x0020_Tax_x0020_Setup_x0020_Paylocity
                  : "",

              // reviewSickHoursSetupPaylocity: financeInfo[0]?.cReviewSickHourssetuponPaylocity ?? "",
              reviewSickHoursSetupPaylocity:
                task.length > 0
                  ? task[1]
                      ?.Review_x0020_Sick_x0020_Hours_x0020_Setup_x0020_Paylocity
                  : "",

              // history: "", // Not in API

              offboardingspecialist:
                offboardingInfo[0]?.cOffboardingSpecialist ?? "",
              //offboardingspecialist: task?.iOffboardingSpecialistId ?? null,

              DateofTermination: offboardingInfo[0]?.dDateofTermination,
              // DateofTermination: task?.dDateOfTermination
              //   ? new Date(task?.dDateOfTermination)
              //   : null,

              reasonForTermination:
                offboardingInfo[0]?.cReasonforTermination ?? "",
              //reasonForTermination: task?.cReasonForTermination ?? "",

              // Old: offboardingInfo[0]?.cSeparationDocument ?? ""
              separationDocument:
                task.length > 0 ? task[2]?.Separation_x0020_Document : "",

              // Old: offboardingInfo[0]?.cClientPropertyReturn ?? ""
              assetReturn:
                task.length > 0
                  ? task[2]?.Client_x0020_Property_x0020_Retu
                  : "",

              // Old: offboardingInfo[0]?.cMedicalBenefitTermination ?? ""
              medicalBenefitTermination:
                task.length > 0
                  ? task[2]?.Medical_x0020_Benefit_x0020_Term
                  : "",

              // Old: offboardingInfo[0]?.c401KDistribution ?? ""
              k401Distribution:
                task.length > 0 ? task[2]?._x0034_01K_x0020_Distribution : "",

              // Old: offboardingInfo[0]?.bFinalPaycheck ? "Yes" : "No"
              finalPaycheck:
                task.length > 0
                  ? task[2]?.Final_x0020_Paycheck
                    ? "Yes"
                    : "No"
                  : "",

              // Old: offboardingInfo[0]?.dFinalPaycheck
              finalPaycheckDate:
                task.length > 0
                  ? task[2]?.Final_x0020_Paycheck_x0020_Date
                    ? new Date(task[2]?.Final_x0020_Paycheck_x0020_Date)
                    : null
                  : null,

              // Old: offboardingInfo[0]?.cKantolaTrainings ?? ""
              kantolaTrainings:
                task.length > 0 ? task[2]?.Kantola_x0020_trainings : "",

              // Old: offboardingInfo[0]?.cMoveConsultantFoldertoTerminated ?? ""
              moveConsultantFolder:
                task.length > 0
                  ? task[2]?.Move_x0020_Consultant_x0020_Fold
                  : "",

              //New Fields On Edit Mode
              payRateBillRateChange: "",
              payRateEffectiveDate: null,
              billRateEffectiveDate: null,
              perDiemEffectiveDate: null,
              nonBillableEffectiveDate: null,

              newPayRateDuration: null,
              newPayRateCurrency: null,
              newPayRate: null,

              newOvertimePayRateDuration: null,
              newOvertimePayRateCurrency: null,
              newOvertimePayRate: null,
              newDoubleOvertimePayRateDuration: null,
              newDoubleOvertimePayRateCurrency: null,
              newDoubleOvertimePayRate: null,

              newBillRateDuration: null,
              newBillRateCurrency: null,
              newBillRate: null,

              newOvertimeBillRateDuration: null,
              newOvertimeBillRateCurrency: null,
              newOvertimeBillRate: null,

              newDoubleOvertimeBillRateDuration: null,
              newDoubleOvertimeBillRateCurrency: null,
              newDoubleOvertimeBillRate: null,
              fileAttachment: [],
            };

            console.log("Mapped values:", mappedValues);

            setEditFormInitialValues(mappedValues);
          }
        } catch (error) {
          console.error("Error fetching view-client-info:", error);
        }
      }
    };

    loadData();
  }, [consultantId]);

  if (consultantId && !EditFormInitialValues) {
    return (
      <div className="flex justify-center items-center mt-6">
        {/* <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-pink-600 border-solid"></div> */}
        <Loader size={56} />
      </div>
    );
  }
  console.log(
    `Home component rendered latest updated ${dayjs().format("Do MMMM HH:mm")}`
  );

  console.log("Render Mode new");
  type CstFormikValues = CreateFormValues & Partial<EditFormValues>;
  const initialValues = consultantId
    ? EditFormInitialValues ?? CreateFormInitialValues
    : CreateFormInitialValues;

  return (
    <Formik<CstFormikValues>
      initialValues={initialValues as CstFormikValues}
      validationSchema={
        consultantId ? EditFormValidationSchema : CreateFormValidationSchema
      }
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        setFieldValue,
        isSubmitting,
        // errors,
        validateForm,
        handleSubmit,
        setTouched,
      }: FormikProps<CreateFormValues>) => {
        const [saveClicked, setSaveClicked] = React.useState(false);
        console.log(saveClicked);

        const handleSave = async () => {
          setSaveClicked(true);
          const errs = await validateForm();
          const errKeys = Object.keys(errs);

          if (errKeys.length > 0) {
            setTouched(
              errKeys.reduce((acc, key) => {
                acc[key] = true;
                return acc;
              }, {} as Record<string, boolean>),
              true
            );

            const totalErrors = errKeys.length;
            const firstFive = errKeys
              .slice(0, 5)
              .map((key) => `• ${errs[key as keyof typeof errs]}`);

            const message = `
There are ${totalErrors} validation errors.
Please fix the following:
${firstFive.join("\n")}
${totalErrors > 5 ? "\n...and more." : ""}
    `;

            alert(message);

            return;
          }

          handleSubmit();
        };

        return (
          <Form>
            <FormikEffect
              onChange={(
                values: EditFormValues | CreateFormValues,
                prev?: EditFormValues | CreateFormValues
              ) => {
                const {
                  consultantFirstName,
                  consultantMiddleName,
                  consultantLastName,
                  suffix,
                  consultantFullName,
                  clientName,
                  workCountry,
                } = values;

                const updatedFullName = [
                  consultantFirstName,
                  consultantMiddleName,
                  consultantLastName,
                  suffix,
                ]
                  .filter(Boolean)
                  .join(" ");

                const anyPartFilled = [
                  consultantFirstName,
                  consultantMiddleName,
                  consultantLastName,
                  suffix,
                ].some(Boolean);

                if (anyPartFilled && updatedFullName !== consultantFullName) {
                  setFieldValue("consultantFullName", updatedFullName, false);
                }

                if (clientName) {
                  const selectedClient = clientOptions.find(
                    (c) => c.key === clientName
                  );
                  if (selectedClient) {
                    setFieldValue(
                      "deliveryDirectorName",
                      selectedClient.iDeliveryDirectorName || "",
                      false
                    );
                    setFieldValue(
                      "deliveryDirectorId",
                      selectedClient.iDeliveryDirectorId ?? null,
                      false
                    );
                  }
                } else {
                  setFieldValue("deliveryDirectorName", "", false);
                  setFieldValue("deliveryDirectorId", null, false);
                }

                // if (prev?.workCountry === workCountry || !workCountry) return;

                const workCountryChanged = prev?.workCountry !== workCountry;
                const changeTypeChanged =
                  prev?.payRateBillRateChange !== values.payRateBillRateChange;

                if (!workCountry) return;
                if (!workCountryChanged && !changeTypeChanged) return;

                let currencyId = 1; // default USD
                if (workCountry === 1) currencyId = 2; // Canada -> CAD
                else if (workCountry === 2) currencyId = 4; // UK -> GBP
                else if (workCountry === 3) currencyId = 1; // USA -> USD

                const allCurrencyFields = [
                  "payRateCurrency",
                  "billRateCurrency",
                  "overtimeBillRateCurrency",
                  "overtimePayRateCurrency",
                  "doubleOvertimePayRateCurrency",
                  "doubleOvertimeBillRateCurrency",
                  "perDiemCostCurrency",
                  "nonBillableBonusCurrency",
                  // "newPayRateCurrency",
                  // "newOvertimePayRateCurrency",
                  // "newDoubleOvertimePayRateCurrency",
                  // "newBillRateCurrency",
                  // "newOvertimeBillRateCurrency",
                  // "newDoubleOvertimeBillRateCurrency",
                ] as const;

                const editOnlyCurrencyFields = [
                  "newPayRateCurrency",
                  "newOvertimePayRateCurrency",
                  "newDoubleOvertimePayRateCurrency",
                  "newBillRateCurrency",
                  "newOvertimeBillRateCurrency",
                  "newDoubleOvertimeBillRateCurrency",
                ] as const;

                const isEdit = !!consultantId;
                // const fieldsToSet = isEdit
                //   ? editOnlyCurrencyFields
                //   : allCurrencyFields;
                if (isEdit && values.payRateBillRateChange !== "") {
                  editOnlyCurrencyFields.forEach((f) =>
                    setFieldValue(f, currencyId, false)
                  );
                } else {
                  allCurrencyFields.forEach((f) =>
                    setFieldValue(f, currencyId, false)
                  );
                }

                // --- pay rate type defaults by country ---
                const payRateTypeByCountry: Record<number, string> = {
                  3: "W2", // USA
                  1: "Canada T4", // Canada
                  2: "UK - Agency Worker", // UK
                };
                const defaultPayRateType = payRateTypeByCountry[workCountry];
                if (defaultPayRateType)
                  setFieldValue("payRateType", defaultPayRateType, false);
              }}
            />

            <section>
              <div className="grid grid-cols-3 p-4">
                <div className="mr-4 items-center justify-start flex">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="p-2 rounded border-0 bg-transparent hover:bg-pink-100"
                    title="Go to Home"
                  >
                    <HomeFilled className="w-6 h-6 text-pink-800" />
                  </button>
                </div>
                <div className="text-center">
                  <h1 className="text-3xl  font-sans font-bold text-pink-800 px-4">
                    Candidate Status Tracker
                  </h1>
                </div>

                <div className="justify-end flex items-center text-center">
                  <span
                    className={`text-sm font-bold  px-4 ${
                      values.employeeStatus === 1
                        ? "text-green-600"
                        : values.employeeStatus === 6
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {values.employeeStatus
                      ? `${
                          employeeStatusOptions.find(
                            (status) => status.key === values.employeeStatus
                          )?.text
                        }`
                      : ""}
                  </span>
                </div>
              </div>

              <div className=" ">
                <div className="flex justify-center text-center gap-4 px-6">
                  {subHeaders.map((tab) => (
                    <h5
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
    cursor-pointer
    px-4 py-1
    rounded-full
    text-xs md:text-base
    font-semibold
    transition-all duration-200
    ${
      activeTab === tab.id
        ? "bg-pink-800 text-white shadow border border-pink-800"
        : "border-solid border-pink-800 text-gray-700 hover:bg-pink-50"
    }
  `}
                    >
                      {tab.label}
                    </h5>
                  ))}
                </div>

                {/* <div className="mt-6 p-4 border rounded shadow bg-gray-200">
                {subHeaders.find((tab) => tab.id === activeTab)?.content}
              </div> */}
                <div className="mt-4 p-4 border rounded shadow bg-gray-200">
                  {subHeaders.map((tab) => (
                    <div
                      key={tab.id}
                      style={{
                        display: activeTab === tab.id ? "block" : "none",
                      }}
                    >
                      {tab.content}
                    </div>
                  ))}
                </div>
                {!isViewMode && (
                  <div className="mt-4 text-center">
                    <PrimaryButton
                      type="button"
                      onClick={handleSave}
                      className={`mt-3 rounded-lg flex items-center mx-auto justify-center px-4 py-2 bg-pink-800 text-white ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 mr-2 text-pink-900"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                          <span className="text-pink-900">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Save20Regular className="mr-2" />
                          Save
                        </>
                      )}
                    </PrimaryButton>
                  </div>
                )}
              </div>
            </section>
          </Form>
        );
      }}
    </Formik>
  );
};
