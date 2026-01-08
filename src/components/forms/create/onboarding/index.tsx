import { ErrorMessage, useFormikContext } from "formik";
import React, { useEffect } from "react";
import {
  Label,
  TextField,
  Dropdown,
  PrimaryButton,
  //DatePicker,
  //IDropdownOption,
} from "@fluentui/react";

import { PeoplePicker } from "@microsoft/mgt-react";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MarkAsUnreadOutlinedIcon from "@mui/icons-material/MarkAsUnreadOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";

import {
  backgroundCheckPortalInvitationOptions,
  backgroundCheckStatusOptions,
  sentAdobeKitOptions,
  clientPacketUpdatedOptions,
  kantolaTrainingOptions,
  variteAssetOptions,
  //i9OriginalsOptions,
  i9SchedulingOptions,
  i9VerificationStatusOptions,
  documentPrintedOptions,
  identityverificationOptions,
} from "./utils";
import type { StandaloneContext } from "../../../CandidateStatusTracker";
import type { EditFormValues } from "../../../cst-view/utils/edit-utils";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useSearchParams } from "react-router-dom";
import { fetchVariteId, taskViewer } from "../../../commons/helpers";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import WhereToVoteOutlinedIcon from "@mui/icons-material/WhereToVoteOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AddToHomeScreenOutlinedIcon from "@mui/icons-material/AddToHomeScreenOutlined";

// const [showActionButtons, setShowActionButtons] = useState(false);
// console.log(showActionButtons);

export const Onboarding = ({
  context,
  EditFormInitialValues,
  isViewMode,
  createdBy,
  showActionButtons,
  onboardingSpeNameEmail,
  setOnboardingSpeNameEmail,
  operationManagerNameEmail,
  setOperationManagerNameEmail,
  sendAppointmentLetter,
  sendInitialEmail,
}: {
  context: StandaloneContext;
  EditFormInitialValues: EditFormValues | null;
  isViewMode: boolean;
  createdBy: number | null;
  showActionButtons: boolean;
  onboardingSpeNameEmail: string | null;
  setOnboardingSpeNameEmail: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  operationManagerNameEmail: string | null;
  setOperationManagerNameEmail: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  sendAppointmentLetter: () => Promise<void>;
  sendInitialEmail: () => Promise<void>;
}) => {
  const [searchParams] = useSearchParams();
  const consultantId = searchParams.get("consultantId");
  const isCreateMode = !consultantId;
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

  const [isUserInGroup, setIsUserInGroup] = React.useState<boolean>(false);
  console.log("user is group exit or not ", isUserInGroup);
  React.useEffect(() => {
    handleSetCreatedBy();
  }, []);

  const handleSetCreatedBy = async () => {
    try {
      const groupId = 2766;

      const res = await fetch(
        `https://varite.sharepoint.com/_api/web/GetUserById(${createdBy})/Groups?$filter=Id eq ${groupId}`,
        {
          headers: { Accept: "application/json;odata=verbose" },
        }
      );

      const data = await res.json();
      if (data?.d?.results?.length > 0) {
        setIsUserInGroup(true);
      } else {
        setIsUserInGroup(false);
      }
    } catch (error) {
      console.error("Error checking user group", error);
      setIsUserInGroup(false);
    }
  };

  const setSpUserIdFromEmail = async (
    email: string,
    fieldName: string,
    setFieldValue: (field: string, value: any) => void,
    setEmail?: (email: string) => void
  ) => {
    try {
      // ✅ clear
      if (!email) {
        setFieldValue(fieldName, "");
        setEmail?.("");
        return;
      }

      const escapedEmail = email.toLowerCase().replace(/'/g, "''"); // OData-safe
      const url =
        `https://varite.sharepoint.com/_api/web/siteuserinfolist/items` +
        `?$select=ID,EMail,UserName&$filter=EMail eq '${escapedEmail}'`;

      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        credentials: "include", // important if SharePoint cookie auth
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
    { id: values.onboardingSpecialist, setter: setOnboardingSpeNameEmail },
    { id: values.operationsManager, setter: setOperationManagerNameEmail },
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
  }, [values.onboardingSpecialist, values.operationsManager]);

  console.log("Mode check", {
    isCreateMode,
    isViewMode,
    showActionButtons,
    shouldShowButtons: !isCreateMode && !isViewMode && showActionButtons,
  });

  return (
    <section>
      <div className="bg-gray-200 p-2">
        <div>
          <div className="px-4 py-6 bg-white">
            <div>
              {values?.employeeId && (
                <div className="items-center text-center mb-5 w-full ">
                  <span
                    className="underline text-blue-600 hover:text-blue-800 font-bold cursor-pointer "
                    onClick={() => taskViewer("onboarding", variteId)}
                  >
                    Link to onboarding tasks
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {/* Onboarding Specialist  TextField */}
                {/* //need to change this and operations manager */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <HowToRegOutlinedIcon />{" "}
                    {/* <Icon
                          iconName="Contact"
                          className="mr-1 font-bold text-xs"
                          data-tooltip-id="onboarding-specialist-tooltip"
                        />{" "} */}
                    Onboarding Specialist
                  </Label>

                  <ReactTooltip
                    id="onboarding-specialist-tooltip"
                    place="top"
                    content="Please enter the name of the onboarding specialist for the candidate"
                  />
                  {isViewMode ? (
                    <>
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {onboardingSpeNameEmail || "-"}
                      </div>
                    </>
                  ) : (
                    <>
                      <PeoplePicker
                        selectionMode="single"
                        placeholder="Enter Onboarding Specialist"
                        showMax={1}
                        defaultSelectedUserIds={
                          onboardingSpeNameEmail ? [onboardingSpeNameEmail] : []
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

                          // ✅ if cleared
                          if (!email) {
                            setFieldValue("onboardingSpecialist", "");
                            setOnboardingSpeNameEmail("");
                            return;
                          }

                          // keep email for display
                          setOnboardingSpeNameEmail(email);

                          // store SP user ID in form
                          setSpUserIdFromEmail(
                            email,
                            "onboardingSpecialist",
                            setFieldValue,
                            setOnboardingSpeNameEmail
                          );
                        }}
                      />

                      <ErrorMessage
                        name="onboardingSpecialist"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <SettingsOutlinedIcon />{" "}
                    {/* <Icon
                          iconName="Contact"
                          className="mr-1 font-bold text-xs"
                          data-tooltip-id="operations-manager-tooltip"
                        />{" "} */}
                    Operations Manager
                  </Label>

                  <ReactTooltip
                    id="operations-manager-tooltip"
                    place="top"
                    content="Please enter the name of the operations manager for the candidate"
                  />

                  {isViewMode ? (
                    <>
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {operationManagerNameEmail || "-"}
                      </div>
                    </>
                  ) : (
                    <>
                      <PeoplePicker
                        selectionMode="single"
                        placeholder="Enter Operations Manager"
                        showMax={1}
                        defaultSelectedUserIds={
                          operationManagerNameEmail
                            ? [operationManagerNameEmail]
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

                          // ✅ if cleared
                          if (!email) {
                            setFieldValue("operationsManager", "");
                            setOperationManagerNameEmail("");
                            return;
                          }

                          // keep email for display
                          setOperationManagerNameEmail(email);

                          // store SP user ID in form
                          setSpUserIdFromEmail(
                            email,
                            "operationsManager",
                            setFieldValue,
                            setOperationManagerNameEmail
                          );
                        }}
                      />

                      <ErrorMessage
                        name="operationsManager"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {!isCreateMode &&
                  !isViewMode &&
                  showActionButtons &&
                  isUserInGroup && (
                    <div className="mt-3 flex items-center space-x-3">
                      <PrimaryButton
                        type="button"
                        text="Send Adobe Kit"
                        className="rounded-lg px-4 py-2"
                        onClick={() => {
                          sendAppointmentLetter();
                          console.log("Send Adobe Kit clicked!");
                        }}
                      />

                      <PrimaryButton
                        type="button"
                        text="Send Initial Email"
                        className="rounded-lg px-4 py-2"
                        onClick={() => {
                          sendInitialEmail();
                          console.log("Send Initial Email clicked!");
                        }}
                      />
                    </div>
                  )}

                {/* identityverification */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <FingerprintOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Shield"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="identity-verification-tooltip"
                    />{" "} */}
                    Identity Verification
                  </Label>

                  <ReactTooltip
                    id="identity-verification-tooltip"
                    place="top"
                    content="Please indicate if identity verification has been completed for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.identityverification || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.identityverification || ""}
                        placeholder="Select Identity Verification"
                        options={identityverificationOptions}
                        onChange={(e, option) =>
                          setFieldValue("identityverification", option?.key)
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="identityverification"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* backgroundCheckPortalInvitation */}
                <div className="w-full">
                  <Label>
                    <AddToHomeScreenOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="SecurityGroup"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="background-check-portal-invitation-tooltip"
                    />{" "} */}
                    Background Check Portal Invitation
                  </Label>

                  <ReactTooltip
                    id="background-check-portal-invitation-tooltip"
                    place="top"
                    content="Please indicate if a background check portal invitation has been sent to the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.backgroundCheckPortalInvitation || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={
                          values.backgroundCheckPortalInvitation || ""
                        }
                        placeholder="Select Background Check Portal Invitation"
                        options={backgroundCheckPortalInvitationOptions}
                        onChange={(e, option) =>
                          setFieldValue(
                            "backgroundCheckPortalInvitation",
                            option?.key
                          )
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="backgroundCheckPortalInvitation"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* backgroundCheckStatus */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <WhereToVoteOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="ShieldAlert"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="background-check-status-tooltip"
                    />{" "} */}
                    Background Check Status
                  </Label>

                  <ReactTooltip
                    id="background-check-status-tooltip"
                    place="top"
                    content="Please select the background check status of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.backgroundCheckStatus || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.backgroundCheckStatus || ""}
                        placeholder="Select Background Check Status"
                        options={backgroundCheckStatusOptions}
                        onChange={(e, option) =>
                          setFieldValue("backgroundCheckStatus", option?.key)
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="backgroundCheckStatus"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <DevicesOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="ShieldAlert"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="background-check-status-tooltip"
                    />{" "} */}
                    VARITE Assets Assigned
                  </Label>

                  <ReactTooltip
                    id="background-check-status-tooltip"
                    place="top"
                    content="Please select the VARITE Assets Assigned of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.variteAssetAssigned || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.variteAssetAssigned || ""}
                        placeholder="Select Varite Asset Assigned"
                        options={variteAssetOptions}
                        onChange={(e, option) =>
                          setFieldValue("variteAssetAssigned", option?.key)
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="variteAssetAssigned"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* eSConsultantPacket */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <DescriptionOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Document"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="es-consultant-packet-tooltip"
                    />{" "} */}
                    eS Consultant Packet
                  </Label>

                  <ReactTooltip
                    id="es-consultant-packet-tooltip"
                    place="top"
                    content="Please indicate if the eS consultant packet has been completed"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.eSConsultantPacket || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.eSConsultantPacket || ""}
                        placeholder="Enter eS Consultant Packet"
                        onChange={(e, value) =>
                          setFieldValue("eSConsultantPacket", value || "")
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="eSConsultantPacket"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* eSStateDocuments */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <DescriptionOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="DocumentSet"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="es-state-documents-tooltip"
                    />{" "} */}
                    eS State Documents
                  </Label>

                  <ReactTooltip
                    id="es-state-documents-tooltip"
                    place="top"
                    content="Please indicate if the eS state documents have been submitted"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.eSStateDocuments || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.eSStateDocuments || ""}
                        placeholder="Enter eS State Documents"
                        onChange={(e, value) =>
                          setFieldValue("eSStateDocuments", value || "")
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="eSStateDocuments"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* eSClientPacket */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <MarkAsUnreadOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Page"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="es-client-packet-tooltip"
                    />{" "} */}
                    eS Client Packet
                  </Label>

                  <ReactTooltip
                    id="es-client-packet-tooltip"
                    place="top"
                    content="Please indicate if the eS client packet has been completed"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.eSClientPacket || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.eSClientPacket || ""}
                        placeholder="Enter eS Client Packet"
                        onChange={(e, value) =>
                          setFieldValue("eSClientPacket", value || "")
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="eSClientPacket"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* adobeSendClientDocuments */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <PictureAsPdfOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Send"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="adobe-send-client-documents-tooltip"
                    />{" "} */}
                    Adobe Send Client Documents
                  </Label>

                  <ReactTooltip
                    id="adobe-send-client-documents-tooltip"
                    place="top"
                    content="Please indicate if the Adobe client documents have been sent"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.adobeSendClientDocuments || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.adobeSendClientDocuments || ""}
                        placeholder="Enter Adobe Send Client Documents"
                        onChange={(e, value) =>
                          setFieldValue("adobeSendClientDocuments", value || "")
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="adobeSendClientDocuments"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* adobeSend401kPacket */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <AddToHomeScreenOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Send"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="adobe-send-401k-packet-tooltip"
                    />{" "} */}
                    Adobe Send 401k Packet
                  </Label>

                  <ReactTooltip
                    id="adobe-send-401k-packet-tooltip"
                    place="top"
                    content="Please indicate if the Adobe 401k packet has been sent"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.adobeSend401kPacket || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.adobeSend401kPacket || ""}
                        placeholder="Select Adobe Send 401k Packet"
                        options={sentAdobeKitOptions}
                        onChange={(e, option) =>
                          setFieldValue("adobeSend401kPacket", option?.key)
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="adobeSend401kPacket"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* clientPacketupdatedtoClientPortal */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <DescriptionOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Upload"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="client-packet-updated-tooltip"
                    />{" "} */}
                    Client Packet Updated to Client Portal
                  </Label>

                  <ReactTooltip
                    id="client-packet-updated-tooltip"
                    place="top"
                    content="Please indicate if the client packet has been updated to the client portal"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.clientPacketupdatedtoClientPortal || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={
                          values.clientPacketupdatedtoClientPortal || ""
                        }
                        placeholder="Select Client Packet Update"
                        options={clientPacketUpdatedOptions}
                        onChange={(e, option) =>
                          setFieldValue(
                            "clientPacketupdatedtoClientPortal",
                            option?.key
                          )
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="clientPacketupdatedtoClientPortal"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* kantolaTraining */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <SchoolOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Education"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="kantola-training-tooltip"
                    />{" "} */}
                    Kantola Training
                  </Label>

                  <ReactTooltip
                    id="kantola-training-tooltip"
                    place="top"
                    content="Please indicate if the candidate has completed Kantola Training"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.kantolaTraining || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.kantolaTraining || ""}
                        placeholder="Select Kantola Training"
                        options={kantolaTrainingOptions}
                        onChange={(e, option) =>
                          setFieldValue("kantolaTraining", option?.key)
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="kantolaTraining"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* i9Scheduling */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <FactCheckOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Calendar"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="i9-scheduling-tooltip"
                    />{" "} */}
                    I-9 Scheduling
                  </Label>

                  <ReactTooltip
                    id="i9-scheduling-tooltip"
                    place="top"
                    content="Please indicate if I-9 scheduling has been completed for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.i9Scheduling || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.i9Scheduling || ""}
                        placeholder="Select I-9 Scheduling"
                        options={i9SchedulingOptions}
                        onChange={(e, option) =>
                          setFieldValue("i9Scheduling", option?.key)
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="i9Scheduling"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* i9VerificationStatus */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <FactCheckOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="CheckboxComposite"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="i9-verification-status-tooltip"
                    />{" "} */}
                    I-9 Verification Status
                  </Label>

                  <ReactTooltip
                    id="i9-verification-status-tooltip"
                    place="top"
                    content="Please indicate the I-9 verification status of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.i9VerificationStatus || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.i9VerificationStatus || ""}
                        placeholder="Select I-9 Verification Status"
                        options={i9VerificationStatusOptions}
                        onChange={(e, option) =>
                          setFieldValue("i9VerificationStatus", option?.key)
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="i9VerificationStatus"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* checklistCreated */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <ChecklistOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Checklist"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="checklist-created-tooltip"
                    />{" "} */}
                    Checklist Created
                  </Label>

                  <ReactTooltip
                    id="checklist-created-tooltip"
                    place="top"
                    content="Please indicate if the checklist has been created for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.checklistCreated || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.checklistCreated || ""}
                        placeholder="Select Checklist Created"
                        options={documentPrintedOptions}
                        onChange={(e, option) =>
                          setFieldValue("checklistCreated", option?.key)
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="checklistCreated"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* firstDayInstructions */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <AssignmentTurnedInOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="ClipboardList"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="first-day-instructions-tooltip"
                    />{" "} */}
                    First Day Instructions
                  </Label>

                  <ReactTooltip
                    id="first-day-instructions-tooltip"
                    place="top"
                    content="Please enter first day instructions for the candidate"
                  />

                  {isViewMode ? (
                    // have to check what is correct value mapped to this field
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700 whitespace-pre-wrap">
                      {values.firstDayInstructions || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.firstDayInstructions || ""}
                        placeholder="Enter First Day Instructions"
                        onChange={(e, value) =>
                          setFieldValue("firstDayInstructions", value || "")
                        }
                        styles={{ fieldGroup: { border: "2px solid #d1d5db" } }}
                        //disabled={isCreateMode}
                        disabled
                      />
                      <ErrorMessage
                        name="firstDayInstructions"
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
