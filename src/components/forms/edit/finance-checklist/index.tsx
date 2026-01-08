import { ErrorMessage, useFormikContext } from "formik";
import React, { useEffect } from "react";

import { Label, Dropdown } from "@fluentui/react";

import { PeoplePicker } from "@microsoft/mgt-react";

import { Tooltip as ReactTooltip } from "react-tooltip";

import { pendingDoneOptions, pendingVerifiedOptions, yesNo } from "./utils";
import type { StandaloneContext } from "../../../CandidateStatusTracker";
import type { EditFormValues } from "../../../cst-view/utils/edit-utils";
import { fetchVariteId, taskViewer } from "../../../commons/helpers";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";

export const FinanceChecklist = ({
  // context,
  // EditFormInitialValues,
  isViewMode,
  financeSpecialistNameEmail,
  setFinanceSpecialistNameEmail,
}: {
  context: StandaloneContext;
  EditFormInitialValues: EditFormValues | null;
  isViewMode: boolean;
  financeSpecialistNameEmail: string | null;
  setFinanceSpecialistNameEmail: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}) => {
  const { setFieldValue, values } = useFormikContext<any>();
  const [variteId, setVariteId] = React.useState<string>("");

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

  useEffect(() => {
    fetchVariteId(values?.employeeId, setVariteId);
  }, []);
  const setSpUserIdFromEmail = async (email: string, fieldName: string) => {
    if (!email) return;

    try {
      const escapedEmail = email.toLowerCase().replace(/'/g, "''");
      const url =
        `https://varite.sharepoint.com/_api/web/siteuserinfolist/items` +
        `?$select=ID,EMail,UserName&$filter=EMail eq '${escapedEmail}'`;

      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        credentials: "include", // important if using SharePoint cookies
      });

      if (!response.ok)
        throw new Error(`API call failed: ${response.statusText}`);

      const data = await response.json();
      const user = data?.d?.results?.[0];

      if (user?.ID) {
        setFieldValue(fieldName, user.ID);
        if (fieldName === "financeSpecialist")
          setFinanceSpecialistNameEmail(email);
      } else {
        setFieldValue(fieldName, "");
        if (fieldName === "financeSpecialist")
          setFinanceSpecialistNameEmail("");
      }
    } catch (err) {
      console.error("Error fetching SharePoint user:", err);
    }
  };

  const fetchEmailFromId = async (id: string | number) => {
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
      return data?.d?.results?.[0]?.UserName || "";
    } catch (error) {
      console.error(`Error fetching email for ID ${id}:`, error);
      return "";
    }
  };

  const idList = [
    { id: values.financeSpecialist, setter: setFinanceSpecialistNameEmail },
  ];

  useEffect(() => {
    const getEmails = async () => {
      await Promise.all(
        idList.map(async (item) => {
          if (item.id) {
            const email = await fetchEmailFromId(item.id);
            item.setter(email);
          } else {
            item.setter(null);
          }
        })
      );
    };

    getEmails();
  }, [values.financeSpecialist]);

  return (
    <section>
      <div className="bg-gray-200 p-2">
        <div>
          <div className="px-4 py-6 bg-white">
            <div>
              <div className="items-center text-center mb-5 w-full">
                <span
                  className="underline text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                  onClick={() => taskViewer("finance", variteId)}
                >
                  Link to finance tasks
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Finance Specialist */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <SupportAgentOutlinedIcon />{" "}
                    {/* <Icon
                          iconName="Tag"
                          className="mr-1 font-bold text-xs"
                          data-tooltip-id="finance-specialist-tooltip"
                        />{" "} */}
                    Finance Specialist
                  </Label>

                  <ReactTooltip
                    id="finance-specialist-tooltip"
                    place="top"
                    content="Please enter the name of the finance specialist for the candidate"
                  />
                  {isViewMode ? (
                    <>
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {financeSpecialistNameEmail || "-"}
                      </div>
                    </>
                  ) : (
                    <>
                      <PeoplePicker
                        selectionMode="single"
                        placeholder="Enter Finance Specialist"
                        selectionChanged={(e: any) => {
                          const selected =
                            e?.detail?.selectedPeople ?? e?.detail ?? [];
                          const person = Array.isArray(selected)
                            ? selected[0]
                            : selected;

                          const email =
                            person?.mail ||
                            person?.userPrincipalName ||
                            person?.scoredEmailAddresses?.[0]?.address ||
                            "";

                          if (!email) return;

                          // keep email for display
                          setFinanceSpecialistNameEmail(email);

                          // store SP ID in form
                          setSpUserIdFromEmail(email, "financeSpecialist");
                        }}
                      />

                      <ErrorMessage
                        name="financeSpecialist"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Create/Add Employee to QB */}
                {[
                  {
                    name: "createAddEmployeeQB",
                    label: "Create/Add Employee to QB",
                    options: pendingDoneOptions,
                    tooltip:
                      "Please select the status for creating or adding an employee to QB",
                  },
                  {
                    name: "createUploadPaylocityFile",
                    label: "Create/Upload Paylocity File",
                    options: pendingDoneOptions,
                    tooltip:
                      "Please select the status for creating or uploading the Paylocity file",
                  },
                  {
                    name: "paylocityLoginInstructions",
                    label: "Paylocity LogIn Instructions (Yes/No)",
                    options: yesNo,
                    tooltip:
                      "Please indicate if Paylocity login instructions are provided",
                  },
                  {
                    name: "verifyWorkLocationSetup",
                    label: "Verify Work Location Setup",
                    options: pendingVerifiedOptions,
                    tooltip:
                      "Please select the status for verifying the work location setup",
                  },
                  {
                    name: "reviewTaxSetupPaylocity",
                    label: "Review Tax Setup on Paylocity",
                    options: pendingVerifiedOptions,
                    tooltip:
                      "Please select the status for reviewing tax setup on Paylocity",
                  },
                  {
                    name: "reviewSickHoursSetupPaylocity",
                    label: "Review Sick Hours Setup on Paylocity",
                    options: pendingVerifiedOptions,
                    tooltip:
                      "Please select the status for reviewing sick hours setup on Paylocity",
                  },
                ].map(({ name, label, options, tooltip }) => (
                  <div className="w-full" key={name}>
                    <Label className="flex gap-1 items-center">
                      {/* <Icon
                        iconName="Tag"
                        className="mr-1 font-bold text-xs"
                        data-tooltip-id={`${name}-tooltip`}
                      />{" "} */}
                      {name === "createAddEmployeeQB" && (
                        <>
                          {" "}
                          <PersonAddAlt1OutlinedIcon />{" "}
                        </>
                      )}
                      {name === "createUploadPaylocityFile" && (
                        <>
                          {" "}
                          <CloudUploadOutlinedIcon />{" "}
                        </>
                      )}
                      {name === "paylocityLoginInstructions" && (
                        <>
                          {" "}
                          <LoginOutlinedIcon />{" "}
                        </>
                      )}
                      {name === "verifyWorkLocationSetup" && (
                        <>
                          {" "}
                          <FactCheckOutlinedIcon />
                          {""}
                        </>
                      )}
                      {name === "reviewTaxSetupPaylocity" && (
                        <>
                          {" "}
                          <GavelOutlinedIcon />{" "}
                        </>
                      )}
                      {name === "reviewSickHoursSetupPaylocity" && (
                        <>
                          {" "}
                          <HealingOutlinedIcon />{" "}
                        </>
                      )}
                      {label}
                    </Label>

                    <ReactTooltip
                      id={`${name}-tooltip`}
                      place="top"
                      content={tooltip}
                    />

                    {isViewMode ? (
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {values.name || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          placeholder={`Select ${label}`}
                          options={options}
                          selectedKey={values[name] || ""}
                          onChange={(e, option) =>
                            setFieldValue(name, option?.key || "")
                          }
                          styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                          disabled
                        />
                        <ErrorMessage
                          name={name}
                          component="div"
                          className="text-red-500"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
