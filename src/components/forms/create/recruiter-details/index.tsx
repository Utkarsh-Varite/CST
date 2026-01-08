import { ErrorMessage, useFormikContext } from "formik";
import React, { useEffect } from "react";
import { sourceDropDownOptions } from "./utils";
import { Label, TextField, Dropdown } from "@fluentui/react";

import { PeoplePicker } from "@microsoft/mgt-react";

import type { StandaloneContext } from "../../../CandidateStatusTracker";
import type { IHiringManagerOption } from "../../../cst-view/utils/create-utils";
import type { EditFormValues } from "../../../cst-view/utils/edit-utils";
import { Tooltip as ReactTooltip } from "react-tooltip";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import Groups3OutlinedIcon from "@mui/icons-material/Groups3Outlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export const RecruiterDetails = ({
  context,
  hiringManagerOptions,
  EditFormInitialValues,
  isViewMode,
  recruiterNameEmail,
  setRecruiterNameEmail,
  secRecruiterNameEmail,
  setSecRecruiterNameEmail,
  teamLeadNameEmail,
  setTeamLeadNameEmail,
  accountManagerNameEmail,
  setAccountManagerNameEmail,
  associateAccountManagerNameEmail,
  setAssociateAccountManagerNameEmail,
  sharedServiceManagerNameEmail,
  setSharedServiceManagerNameEmail,
  secAccountManagerNameEmail,
  setSecAccountManagerNameEmail,
}: {
  context: StandaloneContext;
  hiringManagerOptions: IHiringManagerOption[];
  EditFormInitialValues: EditFormValues | null;
  isViewMode: boolean;
  recruiterNameEmail: string | null;
  setRecruiterNameEmail: React.Dispatch<React.SetStateAction<string | null>>;
  secRecruiterNameEmail: string | null;
  setSecRecruiterNameEmail: React.Dispatch<React.SetStateAction<string | null>>;
  teamLeadNameEmail: string | null;
  setTeamLeadNameEmail: React.Dispatch<React.SetStateAction<string | null>>;
  accountManagerNameEmail: string | null;
  setAccountManagerNameEmail: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  associateAccountManagerNameEmail: string | null;
  setAssociateAccountManagerNameEmail: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  sharedServiceManagerNameEmail: string | null;
  setSharedServiceManagerNameEmail: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  secAccountManagerNameEmail: string | null;
  setSecAccountManagerNameEmail: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}) => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
        .CanvasComponent.LCS .grid:before,
        .CanvasComponent.LCS .grid:after {
          content: none;
          display: none;
        }
      `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const _setPeoplePickerUser = async (
    email: string,
    fieldName:
      | "recruiterName"
      | "secondaryRecruiterName"
      | "teamLead"
      | "accountManagerName"
      | "associateAccountManagerName"
      | "sharedServiceManagerName"
      | "secondaryAccountManagerName",
    setFieldValue: (field: string, value: any) => void
  ) => {
    // ✅ helper to set/clear the matching email state
    const setEmailForField = (value: string) => {
      switch (fieldName) {
        case "recruiterName":
          setRecruiterNameEmail(value);
          break;
        case "secondaryRecruiterName":
          setSecRecruiterNameEmail(value);
          break;
        case "teamLead":
          setTeamLeadNameEmail(value);
          break;
        case "accountManagerName":
          setAccountManagerNameEmail(value);
          break;
        case "associateAccountManagerName":
          setAssociateAccountManagerNameEmail(value);
          break;
        case "sharedServiceManagerName":
          setSharedServiceManagerNameEmail(value);
          break;
        case "secondaryAccountManagerName":
          setSecAccountManagerNameEmail(value);
          break;
      }
    };

    // ✅ if cleared selection
    if (!email) {
      setFieldValue(fieldName, "");
      setEmailForField("");
      return;
    }

    try {
      const escapedEmail = email.toLowerCase().replace(/'/g, "''"); // OData-safe
      const url =
        `https://varite.sharepoint.com/_api/web/siteuserinfolist/items` +
        `?$select=ID,EMail,UserName&$filter=EMail eq '${escapedEmail}'`;

      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        credentials: "include", // important if using SharePoint cookies
      });

      if (!response.ok) {
        throw new Error(
          `API call failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const user = data?.d?.results?.[0];

      if (user?.ID) {
        setFieldValue(fieldName, user.ID); // ✅ store SP user ID
        setEmailForField(email); // ✅ store email for display/default
      } else {
        console.warn("User not found in SharePoint for email:", email);
        setFieldValue(fieldName, "");
        setEmailForField("");
      }
    } catch (error) {
      console.error("Error fetching SharePoint user:", error);
      setFieldValue(fieldName, "");
      setEmailForField("");
    }
  };
  const getEmailFromMgtEvent = (e: any): string => {
    const selected = e?.detail?.selectedPeople ?? e?.detail ?? [];
    const person = Array.isArray(selected) ? selected[0] : selected;

    return (
      person?.mail ||
      person?.userPrincipalName ||
      person?.scoredEmailAddresses?.[0]?.address ||
      ""
    );
  };

  // Create the required context for PeoplePicker

  const { values, setFieldValue } = useFormikContext<any>();

  // if (fetchedData.iServicesManagerId) { need to do this to show email in view + edit mode ig
  //   //we getting email to can set directly **
  //   const email = await fetchEmailFromId(fetchedData.iServicesManagerId);
  //   setClientServiceManagerEmail(email);
  // }

  const fetchEmailFromId = async (id: string | number, index: number) => {
    try {
      const res = await fetch(
        `https://varite.sharepoint.com/_api/web/siteuserinfolist/items?$filter=ID eq '${id}'`,
        {
          method: "GET",
          headers: {
            Accept: "application/json;odata=verbose",
          },
        }
      );
      const data = await res.json();
      if (index === 3) {
        setFieldValue(
          "accountManagerFirstName",
          data?.d?.results?.[0]?.FirstName
        );
        setFieldValue(
          "accountManagerLastName",
          data?.d?.results?.[0]?.LastName
        );
      }

      return data?.d?.results?.[0]?.UserName || "";
    } catch (error) {
      console.error(`Error fetching email for ID ${id}:`, error);
      return "";
    }
  };

  const idList = [
    { id: values.recruiterName, setter: setRecruiterNameEmail },
    { id: values.secondaryRecruiterName, setter: setSecRecruiterNameEmail },
    { id: values.teamLead, setter: setTeamLeadNameEmail },
    { id: values.accountManagerName, setter: setAccountManagerNameEmail },
    {
      id: values.associateAccountManagerName,
      setter: setAssociateAccountManagerNameEmail,
    },
    {
      id: values.sharedServiceManagerName,
      setter: setSharedServiceManagerNameEmail,
    },
    {
      id: values.secondaryAccountManagerName,
      setter: setSecAccountManagerNameEmail,
    },
  ];

  useEffect(() => {
    const getEmails = async () => {
      await Promise.all(
        idList.map(async (item, index) => {
          if (item.id) {
            const email = await fetchEmailFromId(item.id, index);
            item.setter(email);
          } else {
            item.setter(null);
          }
        })
      );
    };

    getEmails();
  }, [
    values.recruiterName,
    values.secondaryRecruiterName,
    values.teamLead,
    values.accountManagerName,
    values.associateAccountManagerName,
    values.sharedServiceManagerName,
    values.secondaryAccountManagerName,
  ]);

  return (
    <section>
      <div className="bg-gray-200 p-2">
        <div>
          <div className="px-4 py-6 bg-white">
            <div>
              <div className="grid grid-cols-2 gap-3">
                {/* Hiring Manager Dropdown */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <SupervisorAccountOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="People"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="hiring-manager-tooltip"
                    />{" "} */}
                    Hiring Manager
                  </Label>

                  <ReactTooltip
                    id="hiring-manager-tooltip"
                    place="top"
                    content="Please enter the name of the hiring manager for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {hiringManagerOptions.find(
                        (opt) => opt.key === values.hiringManager
                      )?.text || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.hiringManager || ""}
                        placeholder="Select Hiring Manager"
                        options={hiringManagerOptions}
                        onChange={(e, option) =>
                          setFieldValue("hiringManager", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="hiringManager"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Recruiter Name TextField */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <SupportAgentOutlinedIcon />{" "}
                    {/* <Icon
                          iconName="Contact"
                          className="mr-1 font-bold text-xs"
                          data-tooltip-id="recruiter-name-tooltip"
                        />{" "} */}
                    Recruiter Name
                  </Label>

                  <ReactTooltip
                    id="recruiter-name-tooltip"
                    place="top"
                    content="Please enter the name of the recruiter handling the candidate"
                  />
                  {isViewMode ? (
                    <>
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {recruiterNameEmail || "-"}
                      </div>
                    </>
                  ) : (
                    <>
                      <PeoplePicker
                        selectionMode="single"
                        placeholder="Enter Recruiter Name"
                        showMax={1}
                        defaultSelectedUserIds={
                          recruiterNameEmail ? [recruiterNameEmail] : []
                        }
                        selectionChanged={(e: any) => {
                          const email = getEmailFromMgtEvent(e);
                          _setPeoplePickerUser(
                            email,
                            "recruiterName",
                            setFieldValue
                          );
                        }}
                      />

                      <ErrorMessage
                        name="recruiterName"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Secondary Recruiter's Name TextField */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <SupportAgentOutlinedIcon />{" "}
                    {/* <Icon
                          iconName="Contact"
                          className="mr-1 font-bold text-xs"
                          data-tooltip-id="secondary-recruiter-name-tooltip"
                        />{" "} */}
                    Secondary Recruiter's Name
                  </Label>

                  <ReactTooltip
                    id="secondary-recruiter-name-tooltip"
                    place="top"
                    content="Please enter the name of the secondary recruiter handling the candidate"
                  />
                  {isViewMode ? (
                    <>
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {secRecruiterNameEmail || "-"}
                      </div>
                    </>
                  ) : (
                    <>
                      <PeoplePicker
                        selectionMode="single"
                        placeholder="Enter Secondary Recruiter's Name"
                        showMax={1}
                        defaultSelectedUserIds={
                          secRecruiterNameEmail ? [secRecruiterNameEmail] : []
                        }
                        selectionChanged={(e: any) => {
                          const email = getEmailFromMgtEvent(e);
                          _setPeoplePickerUser(
                            email,
                            "secondaryRecruiterName",
                            setFieldValue
                          );
                        }}
                      />

                      <ErrorMessage
                        name="secondaryRecruiterName"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Team Lead TextField */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <Groups3OutlinedIcon />{" "}
                    {/* <Icon
                          iconName="Contact"
                          className="mr-1 font-bold text-xs"
                          data-tooltip-id="team-lead-tooltip"
                        />{" "} */}
                    Team Lead
                  </Label>

                  <ReactTooltip
                    id="team-lead-tooltip"
                    place="top"
                    content="Please enter the name of the team lead for the candidate"
                  />
                  {isViewMode ? (
                    <>
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {teamLeadNameEmail || "-"}
                      </div>
                    </>
                  ) : (
                    <>
                      <PeoplePicker
                        selectionMode="single"
                        placeholder="Enter Team Lead"
                        showMax={1}
                        defaultSelectedUserIds={
                          teamLeadNameEmail ? [teamLeadNameEmail] : []
                        }
                        selectionChanged={(e: any) => {
                          const email = getEmailFromMgtEvent(e);
                          _setPeoplePickerUser(
                            email,
                            "teamLead",
                            setFieldValue
                          );
                        }}
                      />

                      <ErrorMessage
                        name="teamLead"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Account Manager's Name Dropdown */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <ManageAccountsOutlinedIcon />{" "}
                    {/* <Icon
                          iconName="Contact"
                          className="mr-1 font-bold text-xs"
                          data-tooltip-id="account-manager-name-tooltip"
                        />{" "} */}
                    Account Manager's Name
                  </Label>

                  <ReactTooltip
                    id="account-manager-name-tooltip"
                    place="top"
                    content="Please enter the name of the account manager for the candidate"
                  />
                  {isViewMode ? (
                    <>
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {accountManagerNameEmail || "-"}
                      </div>
                    </>
                  ) : (
                    <>
                      <PeoplePicker
                        selectionMode="single"
                        placeholder="Select Account Manager's Name"
                        showMax={1}
                        defaultSelectedUserIds={
                          accountManagerNameEmail
                            ? [accountManagerNameEmail]
                            : []
                        }
                        selectionChanged={(e: any) => {
                          const email = getEmailFromMgtEvent(e);
                          _setPeoplePickerUser(
                            email,
                            "accountManagerName",
                            setFieldValue
                          );
                        }}
                      />

                      <ErrorMessage
                        name="accountManagerName"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Associate Account Manager's Name Dropdown */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <ManageAccountsOutlinedIcon />{" "}
                    {/* <Icon
                          iconName="ContactInfo"
                          className="mr-1 font-bold text-xs"
                          data-tooltip-id="associate-account-manager-name-tooltip"
                        />{" "} */}
                    Associate Account Manager's Name
                  </Label>

                  <ReactTooltip
                    id="associate-account-manager-name-tooltip"
                    place="top"
                    content="Please enter the name of the associate account manager for the candidate"
                  />
                  {isViewMode ? (
                    <>
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {associateAccountManagerNameEmail || "-"}
                      </div>
                    </>
                  ) : (
                    <>
                      <PeoplePicker
                        selectionMode="single"
                        placeholder="Select Associate Account Manager's Name"
                        showMax={1}
                        defaultSelectedUserIds={
                          associateAccountManagerNameEmail
                            ? [associateAccountManagerNameEmail]
                            : []
                        }
                        selectionChanged={(e: any) => {
                          const email = getEmailFromMgtEvent(e);
                          _setPeoplePickerUser(
                            email,
                            "associateAccountManagerName",
                            setFieldValue
                          );
                        }}
                      />

                      <ErrorMessage
                        name="associateAccountManagerName"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Shared Service Manager's Name Dropdown */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <SupervisorAccountOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Contact"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="shared-service-manager-name-tooltip"
                    />{" "} */}
                    Shared Service Manager's Name
                  </Label>

                  <ReactTooltip
                    id="shared-service-manager-name-tooltip"
                    place="top"
                    content="Please enter the name of the shared service manager for the candidate"
                  />
                  {isViewMode ? (
                    <>
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {sharedServiceManagerNameEmail || "-"}
                      </div>
                    </>
                  ) : (
                    <>
                      <PeoplePicker
                        selectionMode="single"
                        placeholder="Select Shared Service Manager's Name"
                        showMax={1}
                        defaultSelectedUserIds={
                          sharedServiceManagerNameEmail
                            ? [sharedServiceManagerNameEmail]
                            : []
                        }
                        selectionChanged={(e: any) => {
                          const email = getEmailFromMgtEvent(e);
                          _setPeoplePickerUser(
                            email,
                            "sharedServiceManagerName",
                            setFieldValue
                          );
                        }}
                      />

                      <ErrorMessage
                        name="sharedServiceManagerName"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Secondary Account Manager's Name TextField */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <ManageAccountsOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Contact"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="secondary-account-manager-name-tooltip"
                    />{" "} */}
                    Secondary Account Manager's Name
                  </Label>

                  <ReactTooltip
                    id="secondary-account-manager-name-tooltip"
                    place="top"
                    content="Please enter the name of the secondary account manager for the candidate"
                  />
                  {isViewMode ? (
                    <>
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {secAccountManagerNameEmail || "-"}
                      </div>
                    </>
                  ) : (
                    <>
                      <PeoplePicker
                        selectionMode="single"
                        placeholder="Enter Secondary Account Manager's Name"
                        showMax={1}
                        defaultSelectedUserIds={
                          secAccountManagerNameEmail
                            ? [secAccountManagerNameEmail]
                            : []
                        }
                        selectionChanged={(e: any) => {
                          const email = getEmailFromMgtEvent(e);
                          _setPeoplePickerUser(
                            email,
                            "secondaryAccountManagerName",
                            setFieldValue
                          );
                        }}
                      />

                      <ErrorMessage
                        name="secondaryAccountManagerName"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* //// */}

                {/* Delivery Director Name TextField */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <LeaderboardOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="DeliveryOptimization"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="delivery-director-name-tooltip"
                    />{" "} */}
                    Delivery Director Name
                  </Label>

                  <ReactTooltip
                    id="delivery-director-name-tooltip"
                    place="top"
                    content="It Will be auto populated based on the Client Name Selection"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.deliveryDirectorName || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        disabled
                        value={values.deliveryDirectorName || ""}
                        placeholder="Enter Delivery Director Name"
                        onChange={(e, value) =>
                          setFieldValue("deliveryDirectorName", value || "")
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="deliveryDirectorName"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Delivery Director ID TextField */}
                {/* <div className="w-full">
                  <Label>
                    <Icon
                      iconName="IDBadge"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="delivery-director-id-tooltip"
                    />{" "}
                    Delivery Director ID
                  </Label>

                  <ReactTooltip
                    id="delivery-director-id-tooltip"
                    place="top"
                    content="It Will be auto populated based on the Client Name Selection"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.deliveryDirectorId ?? "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        disabled
                        value={values.deliveryDirectorId || ""}
                        placeholder="Enter Delivery Director ID"
                        onChange={(e, value) =>
                          setFieldValue(
                            "deliveryDirectorId",
                            value ? Number(value) : null
                          )
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="deliveryDirectorId"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div> */}

                {/* Source Website Dropdown */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <LanguageOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="source-website-tooltip"
                    />{" "} */}
                    Source Website
                  </Label>

                  <ReactTooltip
                    id="source-website-tooltip"
                    place="top"
                    content="Please enter the name of the source website where the candidate was found"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.sourceWebsite || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        placeholder="Select Source Website"
                        options={sourceDropDownOptions}
                        onChange={(e, option) =>
                          setFieldValue("sourceWebsite", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        selectedKey={values.sourceWebsite || ""}
                      />
                      <ErrorMessage
                        name="sourceWebsite"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Vendor Email Address TextField */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <AlternateEmailOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Mail"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="vendor-email-address-tooltip"
                    />{" "} */}
                    Vendor Email Address
                  </Label>

                  <ReactTooltip
                    id="vendor-email-address-tooltip"
                    place="top"
                    content="Please enter the email address of the vendor for communication"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.vendorEmailAddress || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.vendorEmailAddress || ""}
                        placeholder="Enter Vendor Email Address"
                        onChange={(e, value) =>
                          setFieldValue("vendorEmailAddress", value || "")
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="vendorEmailAddress"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/*Blank Div */}
                <div />

                {/* Vendor Name and Details TextField */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <PersonOutlineOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Info"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="vendor-name-details-tooltip"
                    />{" "} */}
                    Vendor Name and Details
                  </Label>

                  <ReactTooltip
                    id="vendor-name-details-tooltip"
                    place="top"
                    content="Please enter the vendor's name and any relevant details for this candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.vendorNameAndDetails || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.vendorNameAndDetails || ""}
                        placeholder="Enter Vendor Name and Details"
                        onChange={(e, value) =>
                          setFieldValue("vendorNameAndDetails", value || "")
                        }
                        multiline
                        rows={5}
                        styles={{
                          fieldGroup: {
                            border: "2px solid #d1d5db",
                            width: "100%",
                            minHeight: "150px",
                          },
                          root: {
                            maxWidth: "100%",
                          },
                        }}
                      />
                      <ErrorMessage
                        name="vendorNameAndDetails"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
