import { ErrorMessage, useFormikContext } from "formik";
import React, { useEffect } from "react";
import { Label, Dropdown, DatePicker } from "@fluentui/react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { PeoplePicker } from "@microsoft/mgt-react";

// import {
//   IPeoplePickerContext,
//   PeoplePicker,
//   PrincipalType,
// } from "@pnp/spfx-controls-react/lib/PeoplePicker";

import {
  moveFolderOptions,
  kantolaTrainingsOptions,
  k401DistributionOptions,
  yesNo,
  separationDocumentOptions,
  reasonForTerminationOptions,
  assetReturnOptions,
} from "./utils";
import type { StandaloneContext } from "../../../CandidateStatusTracker";
import type { EditFormValues } from "../../../cst-view/utils/edit-utils";
import { fetchVariteId, taskViewer } from "../../../commons/helpers";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import DriveFileMoveRtlOutlinedIcon from "@mui/icons-material/DriveFileMoveRtlOutlined";

export const Offboarding = ({
  context,
  EditFormInitialValues,
  isViewMode,
  offboardignSpeNameEmail,
  setOffboardignSpeNameEmail,
}: {
  context: StandaloneContext;
  EditFormInitialValues: EditFormValues | null;
  isViewMode: boolean;
  offboardignSpeNameEmail: string | null;
  setOffboardignSpeNameEmail: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}) => {
  const { setFieldValue, values } = useFormikContext<any>();
  const [variteId, setVariteId] = React.useState<string>("");

  useEffect(() => {
    fetchVariteId(values?.employeeId, setVariteId);
  }, []);
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

  const setSpUserIdFromEmail = async (
    email: string,
    fieldName: string,
    setFieldValue: (field: string, value: any) => void,
    setEmail?: (email: string) => void
  ) => {
    if (!email) return;

    try {
      // OData-safe (don't URL-encode inside the quoted string)
      const escapedEmail = email.toLowerCase().replace(/'/g, "''");

      const url =
        `https://varite.sharepoint.com/_api/web/siteuserinfolist/items` +
        `?$select=ID,EMail,UserName&$filter=EMail eq '${escapedEmail}'`;

      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        credentials: "include", // important when using SharePoint cookies
      });

      if (!response.ok) {
        throw new Error(
          `API call failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const user = data?.d?.results?.[0];

      if (user?.ID) {
        setFieldValue(fieldName, user.ID);
        setEmail?.(email);
      } else {
        console.warn("User not found in SharePoint for email:", email);
        setFieldValue(fieldName, "");
        setEmail?.("");
      }
    } catch (error) {
      console.error("Error fetching SharePoint user:", error);
      setFieldValue(fieldName, "");
      setEmail?.("");
    }
  };

  // Create the required context for PeoplePicker

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
    { id: values.offboardingspecialist, setter: setOffboardignSpeNameEmail },
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
  }, [values.offboardingspecialist]);

  return (
    <section>
      <div className="bg-gray-200 p-2">
        <div>
          <div className="px-4 py-6 bg-white">
            <div>
              <div className="items-center text-center mb-5 w-full">
                <span
                  className="underline text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                  onClick={() => taskViewer("offboarding", variteId)}
                >
                  Link to offboarding tasks
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Off-Boarding Specialist */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <SupportAgentOutlinedIcon />{" "}
                    {/* <Icon
                          iconName="Contact"
                          className="mr-1 font-bold text-xs"
                          data-tooltip-id="off-boarding-specialist-tooltip"
                        />{" "} */}
                    Off-Boarding Specialist
                  </Label>

                  <ReactTooltip
                    id="off-boarding-specialist-tooltip"
                    place="top"
                    content="Please enter the name of the off-boarding specialist for the candidate"
                  />
                  {isViewMode ? (
                    <>
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {offboardignSpeNameEmail || "-"}
                      </div>
                    </>
                  ) : (
                    <>
                      <PeoplePicker
                        selectionMode="single"
                        placeholder="Enter Off-Boarding Specialist"
                        showMax={1}
                        defaultSelectedUserIds={
                          offboardignSpeNameEmail
                            ? [offboardignSpeNameEmail]
                            : []
                        }
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

                          if (!email) {
                            console.warn("No email found for selected person.");
                            setFieldValue("offboardingspecialist", "");
                            setOffboardignSpeNameEmail("");
                            return;
                          }

                          // keep for display / defaultSelected
                          setOffboardignSpeNameEmail(email);

                          // store SP User ID in form
                          setSpUserIdFromEmail(
                            email,
                            "offboardingspecialist",
                            setFieldValue,
                            setOffboardignSpeNameEmail
                          );
                        }}
                      />

                      <ErrorMessage
                        name="offboardingspecialist"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Date of Termination */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <EventBusyOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Calendar"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="date-of-termination-tooltip"
                    />{" "} */}
                    Date of Termination
                  </Label>

                  <ReactTooltip
                    id="date-of-termination-tooltip"
                    place="top"
                    content="Please select the termination date of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.DateofTermination &&
                      values.DateofTermination !== "1900-01-01T00:00:00.000Z"
                        ? new Date(
                            values.DateofTermination
                          ).toLocaleDateString()
                        : "-"}
                    </div>
                  ) : (
                    <>
                      <DatePicker
                        value={
                          values.DateofTermination &&
                          values.DateofTermination !==
                            "1900-01-01T00:00:00.000Z"
                            ? new Date(values.DateofTermination)
                            : undefined
                        }
                        placeholder="Select Date of Termination"
                        onSelectDate={(date) =>
                          setFieldValue("DateofTermination", date ?? "")
                        }
                      />
                      <ErrorMessage
                        name="DateofTermination"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Reason for Termination */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <HelpOutlineOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="reason-for-termination-tooltip"
                    />{" "} */}
                    Reason for Termination
                  </Label>

                  <ReactTooltip
                    id="reason-for-termination-tooltip"
                    place="top"
                    content="Please provide the reason for the candidate's termination"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.reasonForTermination || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.reasonForTermination || ""}
                        placeholder="Select Reason for Termination"
                        options={reasonForTerminationOptions}
                        onChange={(e, option) =>
                          setFieldValue(
                            "reasonForTermination",
                            option?.key || ""
                          )
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="reasonForTermination"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Separation Document */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <DescriptionOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="separation-document-tooltip"
                    />{" "} */}
                    Separation Document
                  </Label>

                  <ReactTooltip
                    id="separation-document-tooltip"
                    place="top"
                    content="Please upload or provide the separation document for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.separationDocument || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.separationDocument || ""}
                        placeholder="Select Separation Document status"
                        options={separationDocumentOptions}
                        onChange={(e, option) =>
                          setFieldValue("separationDocument", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        disabled
                      />
                      <ErrorMessage
                        name="separationDocument"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Asset Return */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <Inventory2OutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="asset-return-tooltip"
                    />{" "} */}
                    Asset Return
                  </Label>

                  <ReactTooltip
                    id="asset-return-tooltip"
                    place="top"
                    content="Please indicate the status of asset return for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.assetReturn || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.assetReturn || ""}
                        placeholder="Select Asset Return"
                        options={assetReturnOptions}
                        onChange={(e, option) =>
                          setFieldValue("assetReturn", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        disabled
                      />
                      <ErrorMessage
                        name="assetReturn"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Medical Benefit Termination */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <HealingOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="medical-benefit-termination-cobra-tooltip"
                    />{" "} */}
                    Medical Benefit Termination (COBRA)
                  </Label>

                  <ReactTooltip
                    id="medical-benefit-termination-cobra-tooltip"
                    place="top"
                    content="Please specify the status of medical benefit termination (COBRA) for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.medicalBenefitTermination || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.medicalBenefitTermination || ""}
                        placeholder="Select Medical Benefit Termination"
                        options={yesNo}
                        onChange={(e, option) =>
                          setFieldValue(
                            "medicalBenefitTermination",
                            option?.key || ""
                          )
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        disabled
                      />
                      <ErrorMessage
                        name="medicalBenefitTermination"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* 401K Distribution */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <SavingsOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="401k-distribution-tooltip"
                    />{" "} */}
                    401K Distribution
                  </Label>

                  <ReactTooltip
                    id="401k-distribution-tooltip"
                    place="top"
                    content="Please provide details about the 401K distribution for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.k401Distribution || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.k401Distribution || ""}
                        placeholder="Select 401K Distribution status"
                        options={k401DistributionOptions}
                        onChange={(e, option) =>
                          setFieldValue("k401Distribution", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        disabled
                      />
                      <ErrorMessage
                        name="k401Distribution"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Final Paycheck with Conditional Date */}
                <div className="w-full ">
                  <Label className="flex gap-1 items-center">
                    <PaymentsOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="final-paycheck-tooltip"
                    />{" "} */}
                    Final Paycheck
                  </Label>

                  <ReactTooltip
                    id="final-paycheck-tooltip"
                    place="top"
                    content="Please provide details about the final paycheck for the candidate"
                  />

                  {isViewMode ? (
                    <div className="flex flex-col md:flex-row gap-2">
                      <div className="w-full md:w-1/2 py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {values.finalPaycheck || "-"}
                      </div>
                      <div className="w-full md:w-1/2 py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {values.finalPaycheckDate
                          ? new Date(
                              values.finalPaycheckDate
                            ).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-2">
                      <div className="w-full md:w-1/2">
                        <Dropdown
                          selectedKey={values.finalPaycheck || ""}
                          placeholder="Select Final Paycheck status"
                          options={yesNo}
                          onChange={(e, option) =>
                            setFieldValue("finalPaycheck", option?.key || "")
                          }
                          styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                          disabled
                        />
                        <ErrorMessage
                          name="finalPaycheck"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="w-full md:w-1/2">
                        <DatePicker
                          value={
                            values.finalPaycheckDate
                              ? new Date(values.finalPaycheckDate)
                              : undefined
                          }
                          placeholder="Select Final Paycheck Date"
                          onSelectDate={(date) =>
                            setFieldValue("finalPaycheckDate", date)
                          }
                          styles={{ root: { border: "2px solid #d1d5db" } }}
                          disabled
                        />
                        <ErrorMessage
                          name="finalPaycheckDate"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Kantola Trainings */}
                <div className="w-full mt-4">
                  <Label className="flex gap-1 items-center">
                    <SchoolOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="kantola-trainings-tooltip"
                    />{" "} */}
                    Kantola trainings
                  </Label>

                  <ReactTooltip
                    id="kantola-trainings-tooltip"
                    place="top"
                    content="Please specify the status of Kantola trainings for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.kantolaTrainings || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.kantolaTrainings || ""}
                        placeholder="Select Kantola trainings status"
                        options={kantolaTrainingsOptions}
                        onChange={(e, option) =>
                          setFieldValue("kantolaTrainings", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        disabled
                      />
                      <ErrorMessage
                        name="kantolaTrainings"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Move Consultant Folder */}
                <div className="w-full mt-4">
                  <Label className="flex gap-1 items-center">
                    <DriveFileMoveRtlOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="move-consultant-folder-tooltip"
                    />{" "} */}
                    Move Consultant Folder to Terminated
                  </Label>

                  <ReactTooltip
                    id="move-consultant-folder-tooltip"
                    place="top"
                    content="Indicate if the consultant's folder has been moved to the terminated section"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.moveConsultantFolder || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.moveConsultantFolder || ""}
                        placeholder="Select status"
                        options={moveFolderOptions}
                        onChange={(e, option) =>
                          setFieldValue(
                            "moveConsultantFolder",
                            option?.key || ""
                          )
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        disabled
                      />
                      <ErrorMessage
                        name="moveConsultantFolder"
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
