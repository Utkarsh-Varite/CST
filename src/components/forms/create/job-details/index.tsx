import { ErrorMessage, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { Label, TextField, Dropdown, DatePicker } from "@fluentui/react";
import dayjs from "dayjs";
import {
  exemptStatusOptions,
  typeOfPlacementOptions,
  clientSubVendorOptions,
  payRateTypeOptions,
  noOfHoursOnThisPositionOptions,
  payrollScheduleOptions,
  typeOfEngagementOptions,
  workAuthorizationStatusOptions,
  requirementClassificationOptions,
  divisionOptions,
  payRateBillRateChangeOptions,
  nonExpiryWorkAuthorisationOptions,
} from "./utils";
import type {
  IClientOption,
  ICurrencyOption,
  IEmployeeStatusOption,
  IRateFrequencyOption,
} from "../../../cst-view/utils/create-utils";
import type { EditFormValues } from "../../../cst-view/utils/edit-utils";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useSearchParams } from "react-router-dom";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import GroupWorkOutlinedIcon from "@mui/icons-material/GroupWorkOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import RedeemOutlinedIcon from "@mui/icons-material/RedeemOutlined";
import TimelapseOutlinedIcon from "@mui/icons-material/TimelapseOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import DomainVerificationOutlinedIcon from "@mui/icons-material/DomainVerificationOutlined";
import AdfScannerOutlinedIcon from "@mui/icons-material/AdfScannerOutlined";

export const JobDetails = ({
  currencyOptions,
  clientOptions,
  employeeStatusOptions,
  rateFrequencyOptions,
  EditFormInitialValues,
  isViewMode,
  clientMsp,
  setClientMsp,
}: {
  currencyOptions: ICurrencyOption[];
  clientOptions: IClientOption[];
  employeeStatusOptions: IEmployeeStatusOption[];
  rateFrequencyOptions: IRateFrequencyOption[];
  EditFormInitialValues: EditFormValues | null;
  isViewMode: boolean;
  clientMsp: string;
  setClientMsp: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [searchParams] = useSearchParams();
  const consultantId = searchParams.get("consultantId");
  const isEditMode = consultantId && !isViewMode;
  const [rateDisabled, setRateDisabled] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<
    IEmployeeStatusOption[]
  >([]);
  //Utkarsh's code
  useEffect(() => {
    if (!isEditMode) {
      const found = employeeStatusOptions.find(
        (o) => o.text?.toLowerCase() === "on-boarding"
      );
      setFilteredOptions(found ? [found] : []);
    } else {
      setFilteredOptions(employeeStatusOptions);
    }
  }, [isEditMode, employeeStatusOptions]);

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
  const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();
  useEffect(() => {
    const isExempt = values.exemptStatus === "Exempt";
    const isPermanent = values.typeOfPlacement === "Permanent";

    if (isExempt) {
      setRateDisabled(true);
      setFieldValue("overtimePayRate", 0);
      setFieldValue("doubleOvertimePayRate", 0);
      setFieldValue("overtimeBillRate", 0);
      setFieldValue("doubleOvertimeBillRate", 0);
    } else if (!isExempt && isPermanent) {
      setRateDisabled(true);
      setFieldValue("overtimePayRate", 0);
      setFieldValue("doubleOvertimePayRate", 0);
      setFieldValue("overtimeBillRate", 0);
      setFieldValue("doubleOvertimeBillRate", 0);
    } else {
      setRateDisabled(false);
    }
  }, [values.exemptStatus, values.typeOfPlacement]);

  useEffect(() => {
    const isExempt = values.exemptStatus === "Exempt";
    const isPermanent = values.typeOfPlacement === "Permanent";

    if (!isExempt && !isPermanent) {
      setFieldValue(
        "overtimePayRate",
        values.payRate > 0 ? values.payRate * 1.5 : 0
      );
      setFieldValue(
        "doubleOvertimePayRate",
        values.payRate > 0 ? values.payRate * 2 : 0
      );
    } else {
      setFieldValue("overtimePayRate", 0);
      setFieldValue("doubleOvertimePayRate", 0);
      setFieldValue("overtimeBillRate", 0);
      setFieldValue("doubleOvertimeBillRate", 0);
    }
  }, [values.payRate, values.exemptStatus, values.typeOfPlacement]);

  useEffect(() => {
    if (values.payRateBillRateChange?.length > 0) {
      const isExempt = values.exemptStatus === "Exempt";
      const isPermanent = values.typeOfPlacement === "Permanent";
      if (!isExempt && !isPermanent && values.exemptStatus) {
        setFieldValue(
          "newOvertimePayRate",
          values.newPayRate > 0 ? values.newPayRate * 1.5 : 0
        );
        setFieldValue(
          "newDoubleOvertimePayRate",
          values.newPayRate > 0 ? values.newPayRate * 2 : 0
        );
      } else {
        setFieldValue("newOvertimePayRate", 0);
        setFieldValue("newDoubleOvertimePayRate", 0);
        setFieldValue("newOvertimeBillRate", 0);
        setFieldValue("newDoubleOvertimeBillRate", 0);
      }
    }
  }, [
    values.newPayRate,
    values.exemptStatus,
    values.typeOfPlacement,
    values.payRateBillRateChange,
  ]);

  useEffect(() => {
    setFieldValue("overtimePayRateDuration", values.payRateDuration);
    setFieldValue("overtimePayRateCurrency", values.payRateCurrency);
    setFieldValue("doubleOvertimePayRateDuration", values.payRateDuration);
    setFieldValue("doubleOvertimePayRateCurrency", values.payRateCurrency);

    setFieldValue("overtimeBillRateDuration", values.billRateDuration);
    setFieldValue("overtimeBillRateCurrency", values.billRateCurrency);
    setFieldValue("doubleOvertimeBillRateDuration", values.billRateDuration);
    setFieldValue("doubleOvertimeBillRateCurrency", values.billRateCurrency);

    setFieldValue("newOvertimePayRateDuration", values.newPayRateDuration);
    setFieldValue("newOvertimePayRateCurrency", values.newPayRateCurrency);
    setFieldValue(
      "newDoubleOvertimePayRateDuration",
      values.newPayRateDuration
    );
    setFieldValue(
      "newDoubleOvertimePayRateCurrency",
      values.newPayRateCurrency
    );

    setFieldValue("newOvertimeBillRateDuration", values.newBillRateDuration);
    setFieldValue("newOvertimeBillRateCurrency", values.newBillRateCurrency);
    setFieldValue(
      "newDoubleOvertimeBillRateDuration",
      values.newBillRateDuration
    );
    setFieldValue(
      "newDoubleOvertimeBillRateCurrency",
      values.newBillRateCurrency
    );
    setFieldValue("nonBillableBonus", values.nonBillableBonus);
    setFieldValue("perDiemCost", values.perDiemCost);
  }, [
    values.payRateDuration,
    values.payRateCurrency,
    values.newPayRateDuration,
    values.newPayRateCurrency,
    values.billRateDuration,
    values.billRateCurrency,
    values.newBillRateDuration,
    values.newBillRateCurrency,
    values.nonBillableBonus,
    values.perDiemCost,
  ]);

  const fetchClientMsp = async () => {
    if (values.clientName) {
      const baseUrl = `https://varfunctiontypescript.azurewebsites.net/api/client/active?ClientId=30&code=Dv1M7W5_-9gG-Q4ufjkLOqK0uQyQOV3WPvAyOMCGKcHGAzFuxdpvxQ%3D%3D`;
      try {
        const res = await fetch(baseUrl);
        const data = await res.json();
        const selectedId = Number(values.clientName);
        const selectedClientMsp = data.find(
          (d: any) => Number(d.iClientId) === selectedId
        );
        setClientMsp(selectedClientMsp.cMSPName || "N/A");
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    fetchClientMsp();
  }, [values.clientName]);
  return (
    <section>
      <div className="bg-gray-200 p-2">
        <div>
          <div className="px-4 py-6 bg-white">
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <GavelOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="exempt-status-tooltip"
                    />{" "} */}
                    Exempt Status
                  </Label>

                  <ReactTooltip
                    id="exempt-status-tooltip"
                    place="top"
                    content="Please select the exempt status of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.exemptStatus || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.exemptStatus || ""}
                        placeholder="Select Exempt Status"
                        options={exemptStatusOptions}
                        onChange={(e, option) =>
                          setFieldValue("exemptStatus", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="exemptStatus"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <AssignmentOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="type-of-placement-tooltip"
                    />{" "} */}
                    Type Of Placement
                  </Label>

                  <ReactTooltip
                    id="type-of-placement-tooltip"
                    place="top"
                    content="Please select the type of placement for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.typeOfPlacement || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.typeOfPlacement || ""}
                        placeholder="Select Type Of Placement"
                        options={typeOfPlacementOptions}
                        onChange={(e, option) =>
                          setFieldValue("typeOfPlacement", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="typeOfPlacement"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <WorkOutlineOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="employee-status-tooltip"
                    />{" "} */}
                    Employee Status
                  </Label>

                  <ReactTooltip
                    id="employee-status-tooltip"
                    place="top"
                    content="Please select the employee status of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {filteredOptions.find(
                        (opt) => opt.key === values.employeeStatus
                      )?.text || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.employeeStatus || ""}
                        placeholder="Select Employee Status"
                        options={filteredOptions}
                        onChange={(e, option) =>
                          setFieldValue("employeeStatus", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="employeeStatus"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <BusinessCenterOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="client-name-tooltip"
                    />{" "} */}
                    Client Name
                  </Label>

                  <ReactTooltip
                    id="client-name-tooltip"
                    place="top"
                    content="Please enter the name of the client"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {clientOptions.find(
                        (opt) => opt.key === values.clientName
                      )?.text || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.clientName || ""}
                        placeholder="Select Client Name"
                        options={clientOptions}
                        onChange={(e, option) =>
                          setFieldValue("clientName", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="clientName"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <HubOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="msp-tooltip"
                    />{" "} */}
                    MSP
                  </Label>

                  <ReactTooltip
                    id="msp-tooltip"
                    place="top"
                    content="Please enter the MSP (Managed Service Provider) name"
                  />

                  <div className="border-2 border-gray-300 rounded px-3 py-2 bg-gray-100">
                    {clientMsp
                      ? clientMsp
                      : "This will be picked automatically from CRT based on client after saving the entry."}
                  </div>
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <GroupWorkOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="client-sub-vendor-tooltip"
                    />{" "} */}
                    Client Sub Vendor
                  </Label>

                  <ReactTooltip
                    id="client-sub-vendor-tooltip"
                    place="top"
                    content="Please enter the name of the client sub vendor"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.clientSubVendor || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.clientSubVendor || ""}
                        placeholder="Select Client Sub Vendor"
                        options={clientSubVendorOptions}
                        onChange={(e, option) =>
                          setFieldValue("clientSubVendor", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="clientSubVendor"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <ListAltOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="job-duties-tooltip"
                    />{" "} */}
                    Job Duties
                  </Label>

                  <ReactTooltip
                    id="job-duties-tooltip"
                    place="top"
                    content="Please enter the job duties of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.jobDuties?.trim() || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.jobDuties || ""}
                        placeholder="Enter Job Duties"
                        onChange={(e, value) => {
                          setFieldValue("jobDuties", value || "", true); // validate now
                        }}
                        onBlur={() => setFieldTouched("jobDuties", true, true)}
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="jobDuties"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <AccountTreeOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="division-tooltip"
                    />{" "} */}
                    Division
                  </Label>

                  <ReactTooltip
                    id="division-tooltip"
                    place="top"
                    content="Please enter the division of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.division || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.division || ""}
                        placeholder="Select Division"
                        options={divisionOptions}
                        onChange={(e, option) =>
                          setFieldValue("division", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="division"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <PaidOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="pay-rate-type-tooltip"
                    />{" "} */}
                    Pay Rate Type
                  </Label>

                  <ReactTooltip
                    id="pay-rate-type-tooltip"
                    place="top"
                    content="Please select the pay rate type for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.payRateType || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.payRateType || ""}
                        placeholder="Select Pay Rate Type"
                        options={payRateTypeOptions}
                        onChange={(e, option) =>
                          setFieldValue("payRateType", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="payRateType"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <BadgeOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="job-title-tooltip"
                    />{" "} */}
                    Job Title
                  </Label>

                  <ReactTooltip
                    id="job-title-tooltip"
                    place="top"
                    content="Please enter the job title of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.jobTitle?.trim() || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.jobTitle || ""}
                        placeholder="Enter Job Title"
                        onChange={(e, value) => {
                          setFieldValue("jobTitle", value || "", true); // validate now
                        }}
                        onBlur={() => setFieldTouched("jobTitle", true, true)}
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="jobTitle"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="mb-4 px-2 mt-2">
                <Label required className="flex gap-1 items-center">
                  <PaidOutlinedIcon />{" "}
                  {/* <Icon
                    iconName="Money"
                    className="mr-1 font-bold text-xs"
                    data-tooltip-id="pay-rate-tooltip"
                  />{" "} */}
                  Pay Rate
                </Label>

                <ReactTooltip
                  id="pay-rate-tooltip"
                  place="top"
                  content="Please enter the pay rate for the candidate"
                />

                <div className="grid grid-cols-3 gap-3 items-start w-full">
                  {/* Col 1: Duration */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {rateFrequencyOptions.find(
                          (opt) => opt.key === values.payRateDuration
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={values.payRateDuration || ""}
                          placeholder="Select Duration"
                          options={rateFrequencyOptions}
                          onChange={(e, option) =>
                            setFieldValue("payRateDuration", option?.key)
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                          disabled={!!isEditMode}
                        />
                        {/* fixed-height error slot prevents layout jump */}
                        <div className=" mt-1">
                          <ErrorMessage
                            name="payRateDuration"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 2: Currency */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {currencyOptions.find(
                          (opt) => opt.key === values.payRateCurrency
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={values.payRateCurrency || ""}
                          placeholder="Select Currency"
                          options={currencyOptions}
                          onChange={(e, option) =>
                            setFieldValue("payRateCurrency", option?.key)
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                          disabled={!!isEditMode}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="payRateCurrency"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 3: Amount */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {values.payRate !== null && values.payRate !== ""
                          ? `$${values.payRate}`
                          : "-"}
                      </div>
                    ) : (
                      <>
                        <TextField
                          value={values.payRate}
                          name="payRate"
                          onChange={(e, value) => {
                            setFieldValue("payRate", value, true); // validate now
                          }}
                          onBlur={() => setFieldTouched("payRate", true, true)}
                          styles={{
                            root: { width: "100%" },
                            fieldGroup: { border: "2px solid #d1d5db" },
                          }}
                          disabled={!!isEditMode}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="payRate"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 px-2">
                <Label required className="flex gap-1 items-center">
                  <PaidOutlinedIcon />{" "}
                  {/* <Icon
                    iconName="Money"
                    className="mr-1 font-bold text-xs"
                    data-tooltip-id="bill-rate-tooltip"
                  />{" "} */}
                  Bill Rate
                </Label>

                <ReactTooltip
                  id="bill-rate-tooltip"
                  place="top"
                  content="Please enter the bill rate for the candidate"
                />

                <div className="grid grid-cols-3 gap-3 items-start w-full">
                  {/* Col 1: Duration */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {rateFrequencyOptions.find(
                          (opt) => opt.key === values.billRateDuration
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={values.billRateDuration || ""}
                          placeholder="Select Duration"
                          options={rateFrequencyOptions}
                          onChange={(e, option) =>
                            setFieldValue("billRateDuration", option?.key)
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                          disabled={!!isEditMode}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="billRateDuration"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 2: Currency */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {currencyOptions.find(
                          (opt) => opt.key === values.billRateCurrency
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={values.billRateCurrency || ""}
                          placeholder="Select Currency"
                          options={currencyOptions}
                          onChange={(e, option) =>
                            setFieldValue("billRateCurrency", option?.key)
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                          disabled={!!isEditMode}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="billRateCurrency"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 3: Amount */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {typeof values.billRate === "number" &&
                        !isNaN(values.billRate)
                          ? `$${values.billRate}`
                          : "-"}
                      </div>
                    ) : (
                      <>
                        <TextField
                          value={values.billRate}
                          name="billRate"
                          onChange={(e, value) => {
                            setFieldValue("billRate", value, true); // validate now
                          }}
                          onBlur={() => setFieldTouched("billRate", true, true)}
                          styles={{
                            root: { width: "100%" },
                            fieldGroup: { border: "2px solid #d1d5db" },
                          }}
                          disabled={!!isEditMode}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="billRate"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 px-2">
                <Label required className="flex gap-1 items-center">
                  <PaymentsOutlinedIcon />{" "}
                  {/* <Icon
                    iconName="Money"
                    className="mr-1 font-bold text-xs"
                    data-tooltip-id="overtime-pay-rate-tooltip"
                  />{" "} */}
                  Overtime Pay Rate
                </Label>
                <ReactTooltip
                  id="overtime-pay-rate-tooltip"
                  place="top"
                  content="Please enter the overtime pay rate for the candidate"
                />

                <div className="grid grid-cols-3 gap-3 items-start w-full">
                  {/* Col 1 */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {rateFrequencyOptions.find(
                          (o) => o.key === values.overtimePayRateDuration
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={values.overtimePayRateDuration || ""}
                          placeholder="Select Duration"
                          options={rateFrequencyOptions}
                          onChange={(e, option) =>
                            setFieldValue(
                              "overtimePayRateDuration",
                              option?.key
                            )
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                          disabled={
                            !!isEditMode ||
                            rateDisabled ||
                            (values.exemptStatus !== "Exempt" &&
                              values.typeOfPlacement !== "Permanent")
                          }
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="overtimePayRateDuration"
                            className="text-red-500 text-xs leading-4"
                            component="div"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 2 */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {currencyOptions.find(
                          (o) => o.key === values.overtimePayRateCurrency
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={values.overtimePayRateCurrency || ""}
                          placeholder="Select Currency"
                          options={currencyOptions}
                          onChange={(e, option) =>
                            setFieldValue(
                              "overtimePayRateCurrency",
                              option?.key
                            )
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                          disabled={
                            !!isEditMode ||
                            rateDisabled ||
                            (values.exemptStatus !== "Exempt" &&
                              values.typeOfPlacement !== "Permanent")
                          }
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="overtimePayRateCurrency"
                            className="text-red-500 text-xs leading-4"
                            component="div"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 3 */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {typeof values.overtimePayRate === "number" &&
                        !isNaN(values.overtimePayRate)
                          ? `$${values.overtimePayRate}`
                          : "-"}
                      </div>
                    ) : (
                      <>
                        <TextField
                          value={values.overtimePayRate}
                          name="overtimePayRate"
                          onChange={(e, value) => {
                            setFieldValue("overtimePayRate", value, true); // validate now
                          }}
                          onBlur={() =>
                            setFieldTouched("overtimePayRate", true, true)
                          }
                          styles={{
                            root: { width: "100%" },
                            fieldGroup: { border: "2px solid #d1d5db" },
                          }}
                          disabled={
                            !!isEditMode ||
                            rateDisabled ||
                            (values.exemptStatus !== "Exempt" &&
                              values.typeOfPlacement !== "Permanent")
                          }
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="overtimePayRate"
                            className="text-red-500 text-xs leading-4"
                            component="div"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 px-2">
                <Label required className="flex gap-1 items-center">
                  <PaymentsOutlinedIcon />{" "}
                  {/* <Icon
                    iconName="Money"
                    className="mr-1 font-bold text-xs"
                    data-tooltip-id="overtime-bill-rate-tooltip"
                  />{" "} */}
                  Overtime Bill Rate
                </Label>

                <ReactTooltip
                  id="overtime-bill-rate-tooltip"
                  place="top"
                  content="Please enter the overtime bill rate for the candidate"
                />

                <div className="grid grid-cols-3 gap-3 items-start w-full">
                  {/* Col 1: Duration */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {rateFrequencyOptions.find(
                          (opt) => opt.key === values.overtimeBillRateDuration
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={values.overtimeBillRateDuration || ""}
                          placeholder="Select Duration"
                          options={rateFrequencyOptions}
                          onChange={(e, option) =>
                            setFieldValue(
                              "overtimeBillRateDuration",
                              option?.key
                            )
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                          disabled={!!isEditMode || rateDisabled}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="overtimeBillRateDuration"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 2: Currency */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {currencyOptions.find(
                          (opt) => opt.key === values.overtimeBillRateCurrency
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={values.overtimeBillRateCurrency || ""}
                          placeholder="Select Currency"
                          options={currencyOptions}
                          onChange={(e, option) =>
                            setFieldValue(
                              "overtimeBillRateCurrency",
                              option?.key
                            )
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                          disabled={!!isEditMode || rateDisabled}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="overtimeBillRateCurrency"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 3: Amount */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {typeof values.overtimeBillRate === "number" &&
                        !isNaN(values.overtimeBillRate)
                          ? `$${values.overtimeBillRate}`
                          : "-"}
                      </div>
                    ) : (
                      <>
                        <TextField
                          value={values.overtimeBillRate}
                          name="overtimeBillRate"
                          onChange={(e, value) => {
                            setFieldValue("overtimeBillRate", value, true); // validate now
                          }}
                          onBlur={() =>
                            setFieldTouched("overtimeBillRate", true, true)
                          }
                          styles={{
                            root: { width: "100%" },
                            fieldGroup: { border: "2px solid #d1d5db" },
                          }}
                          disabled={!!isEditMode || rateDisabled}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="overtimeBillRate"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 px-2">
                <Label required className="flex gap-1 items-center">
                  <CurrencyExchangeOutlinedIcon />{" "}
                  {/* <Icon
                    iconName="Money"
                    className="mr-1 font-bold text-xs"
                    data-tooltip-id="double-overtime-pay-rate-tooltip"
                  />{" "} */}
                  Double Overtime Pay Rate
                </Label>

                <ReactTooltip
                  id="double-overtime-pay-rate-tooltip"
                  place="top"
                  content="Please enter the double overtime pay rate for the candidate"
                />

                <div className="grid grid-cols-3 gap-3 items-start w-full">
                  {/* Col 1: Duration */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {rateFrequencyOptions.find(
                          (opt) =>
                            opt.key === values.doubleOvertimePayRateDuration
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={
                            values.doubleOvertimePayRateDuration || ""
                          }
                          placeholder="Select Duration"
                          options={rateFrequencyOptions}
                          onChange={(e, option) =>
                            setFieldValue(
                              "doubleOvertimePayRateDuration",
                              option?.key
                            )
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                          disabled={
                            !!isEditMode ||
                            rateDisabled ||
                            (values.exemptStatus !== "Exempt" &&
                              values.typeOfPlacement !== "Permanent")
                          }
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="doubleOvertimePayRateDuration"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 2: Currency */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {currencyOptions.find(
                          (opt) =>
                            opt.key === values.doubleOvertimePayRateCurrency
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={
                            values.doubleOvertimePayRateCurrency || ""
                          }
                          placeholder="Select Currency"
                          options={currencyOptions}
                          onChange={(e, option) =>
                            setFieldValue(
                              "doubleOvertimePayRateCurrency",
                              option?.key
                            )
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                          disabled={
                            !!isEditMode ||
                            rateDisabled ||
                            (values.exemptStatus !== "Exempt" &&
                              values.typeOfPlacement !== "Permanent")
                          }
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="doubleOvertimePayRateCurrency"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 3: Amount */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {typeof values.doubleOvertimePayRate === "number" &&
                        !isNaN(values.doubleOvertimePayRate)
                          ? `$${values.doubleOvertimePayRate}`
                          : "-"}
                      </div>
                    ) : (
                      <>
                        <TextField
                          value={values.doubleOvertimePayRate}
                          name="doubleOvertimePayRate"
                          onChange={(e, value) => {
                            setFieldValue("doubleOvertimePayRate", value, true); // validate now
                          }}
                          onBlur={() =>
                            setFieldTouched("doubleOvertimePayRate", true, true)
                          }
                          styles={{
                            root: { width: "100%" },
                            fieldGroup: { border: "2px solid #d1d5db" },
                          }}
                          disabled={
                            !!isEditMode ||
                            rateDisabled ||
                            (values.exemptStatus !== "Exempt" &&
                              values.typeOfPlacement !== "Permanent")
                          }
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="doubleOvertimePayRate"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 px-2">
                <Label required className="flex gap-1 items-center">
                  <CurrencyExchangeOutlinedIcon />{" "}
                  {/* <Icon
                    iconName="Money"
                    className="mr-1 font-bold text-xs"
                    data-tooltip-id="double-overtime-bill-rate-tooltip"
                  />{" "} */}
                  Double Overtime Bill Rate
                </Label>

                <ReactTooltip
                  id="double-overtime-bill-rate-tooltip"
                  place="top"
                  content="Please enter the double overtime bill rate for the candidate"
                />

                <div className="grid grid-cols-3 gap-3 items-start w-full">
                  {/* Col 1: Duration */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {rateFrequencyOptions.find(
                          (opt) =>
                            opt.key === values.doubleOvertimeBillRateDuration
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={
                            values.doubleOvertimeBillRateDuration || ""
                          }
                          placeholder="Select Duration"
                          options={rateFrequencyOptions}
                          onChange={(e, option) =>
                            setFieldValue(
                              "doubleOvertimeBillRateDuration",
                              option?.key
                            )
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                          disabled={!!isEditMode || rateDisabled}
                        />
                        <div className="">
                          <ErrorMessage
                            name="doubleOvertimeBillRateDuration"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 2: Currency */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {currencyOptions.find(
                          (opt) =>
                            opt.key === values.doubleOvertimeBillRateCurrency
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={
                            values.doubleOvertimeBillRateCurrency || ""
                          }
                          placeholder="Select Currency"
                          options={currencyOptions}
                          onChange={(e, option) =>
                            setFieldValue(
                              "doubleOvertimeBillRateCurrency",
                              option?.key
                            )
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                          disabled={!!isEditMode || rateDisabled}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="doubleOvertimeBillRateCurrency"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 3: Amount */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {typeof values.doubleOvertimeBillRate === "number" &&
                        !isNaN(values.doubleOvertimeBillRate)
                          ? `$${values.doubleOvertimeBillRate}`
                          : "-"}
                      </div>
                    ) : (
                      <>
                        <TextField
                          value={values.doubleOvertimeBillRate}
                          name="doubleOvertimeBillRate"
                          onChange={(e, value) => {
                            setFieldValue(
                              "doubleOvertimeBillRate",
                              value,
                              true
                            ); // validate now
                          }}
                          onBlur={() =>
                            setFieldTouched(
                              "doubleOvertimeBillRate",
                              true,
                              true
                            )
                          }
                          styles={{
                            root: { width: "100%" },
                            fieldGroup: { border: "2px solid #d1d5db" },
                          }}
                          disabled={!!isEditMode || rateDisabled}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="doubleOvertimeBillRate"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* //Per Diem */}
              <div className="mb-4 px-2">
                <Label required className="flex gap-1 items-center">
                  <ReceiptOutlinedIcon />{" "}
                  {/* <Icon
                    iconName="Money"
                    className="mr-1 font-bold text-xs"
                    data-tooltip-id="per-diem-cost-tooltip"
                  />{" "} */}
                  Per Diem Cost
                </Label>

                <ReactTooltip
                  id="per-diem-cost-tooltip"
                  place="top"
                  content="Please enter the per diem cost for the candidate"
                />

                <div className="grid grid-cols-3 gap-3 items-start w-full">
                  {/* Col 1: Duration */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {rateFrequencyOptions.find(
                          (opt) => opt.key === values.perDiemCostDuration
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={values.perDiemCostDuration || ""}
                          placeholder="Select Duration"
                          options={rateFrequencyOptions}
                          onChange={(e, option) =>
                            setFieldValue("perDiemCostDuration", option?.key)
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="perDiemCostDuration"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 2: Currency */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {currencyOptions.find(
                          (opt) => opt.key === values.perDiemCostCurrency
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={values.perDiemCostCurrency || ""}
                          placeholder="Select Currency"
                          options={currencyOptions}
                          onChange={(e, option) =>
                            setFieldValue("perDiemCostCurrency", option?.key)
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="perDiemCostCurrency"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 3: Amount */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {typeof values.perDiemCost === "number" &&
                        !isNaN(values.perDiemCost)
                          ? `$${values.perDiemCost}`
                          : "-"}
                      </div>
                    ) : (
                      <>
                        <TextField
                          value={values.perDiemCost}
                          name="perDiemCost"
                          onChange={(e, value) => {
                            setFieldValue("perDiemCost", value, true); // validate now
                          }}
                          onBlur={() =>
                            setFieldTouched("perDiemCost", true, true)
                          }
                          styles={{
                            root: { width: "100%" },
                            fieldGroup: { border: "2px solid #d1d5db" },
                          }}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="perDiemCost"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {!!isEditMode && (
                    <div className="w-full">
                      <Label className="flex gap-1 items-center">
                        {/* <Icon
                          iconName="Tag"
                          className="mr-1 font-bold text-xs"
                          data-tooltip-id="pay-rate-effective-date-tooltip"
                        />{" "} */}
                        <EventOutlinedIcon /> Per Diem Cost Effective Date
                      </Label>

                      <ReactTooltip
                        id="pay-rate-effective-date-tooltip"
                        place="top"
                        content="Please select the effective date for the pay rate change"
                      />

                      <DatePicker
                        // value={
                        //   values.tentativeJoiningDate
                        //     ? new Date(values.tentativeJoiningDate)
                        //     : undefined
                        // }
                        allowTextInput={false}
                        calloutProps={{ preventDismissOnScroll: true }}
                        placeholder="Select Date"
                        onSelectDate={(date) =>
                          setFieldValue("perDiemEffectiveDate", date)
                        }
                      />
                      <ErrorMessage
                        name="perDiemEffectiveDate"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* //Non Billable*/}
              <div className="mb-4 px-2">
                <Label required className="flex gap-1 items-center">
                  <RedeemOutlinedIcon />{" "}
                  {/* <Icon
                    iconName="Money"
                    className="mr-1 font-bold text-xs"
                    data-tooltip-id="non-billable-bonus-tooltip"
                  />{" "} */}
                  Non-Billable Bonus
                </Label>

                <ReactTooltip
                  id="non-billable-bonus-tooltip"
                  place="top"
                  content="Please enter the non-billable bonus for the candidate"
                />

                <div className="grid grid-cols-3 gap-3 items-start w-full">
                  {/* Col 1: Duration */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {rateFrequencyOptions.find(
                          (opt) => opt.key === values.nonBillableBonusDuration
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={values.nonBillableBonusDuration || ""}
                          placeholder="Select Duration"
                          options={rateFrequencyOptions}
                          onChange={(e, option) =>
                            setFieldValue(
                              "nonBillableBonusDuration",
                              option?.key
                            )
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="nonBillableBonusDuration"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 2: Currency */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {currencyOptions.find(
                          (opt) => opt.key === values.nonBillableBonusCurrency
                        )?.text || "-"}
                      </div>
                    ) : (
                      <>
                        <Dropdown
                          selectedKey={values.nonBillableBonusCurrency || ""}
                          placeholder="Select Currency"
                          options={currencyOptions}
                          onChange={(e, option) =>
                            setFieldValue(
                              "nonBillableBonusCurrency",
                              option?.key
                            )
                          }
                          styles={{
                            root: { width: "100%" },
                            dropdown: { border: "2px solid #d1d5db" },
                          }}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="nonBillableBonusCurrency"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Col 3: Amount */}
                  <div className="min-w-0">
                    {isViewMode ? (
                      <div className="w-full py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                        {typeof values.nonBillableBonus === "number" &&
                        !isNaN(values.nonBillableBonus)
                          ? `$${values.nonBillableBonus}`
                          : "-"}
                      </div>
                    ) : (
                      <>
                        <TextField
                          value={values.nonBillableBonus}
                          name="nonBillableBonus"
                          onChange={(e, value) => {
                            setFieldValue("nonBillableBonus", value, true); // validate now
                          }}
                          onBlur={() =>
                            setFieldTouched("nonBillableBonus", true, true)
                          }
                          styles={{
                            root: { width: "100%" },
                            fieldGroup: { border: "2px solid #d1d5db" },
                          }}
                        />
                        <div className=" mt-1">
                          <ErrorMessage
                            name="nonBillableBonus"
                            component="div"
                            className="text-red-500 text-xs leading-4"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {!!isEditMode && (
                    <div className="w-full">
                      <Label className="flex gap-1 items-center">
                        {/* <Icon
                          iconName="Tag"
                          className="mr-1 font-bold text-xs"
                          data-tooltip-id="pay-rate-effective-date-tooltip"
                        />{" "} */}
                        <EventOutlinedIcon /> Non Billable Bonus Effective Date
                      </Label>

                      <ReactTooltip
                        id="pay-rate-effective-date-tooltip"
                        place="top"
                        content="Please select the effective date for the pay rate change"
                      />

                      <DatePicker
                        // value={
                        //   values.tentativeJoiningDate
                        //     ? new Date(values.tentativeJoiningDate)
                        //     : undefined
                        // }
                        allowTextInput={false}
                        calloutProps={{ preventDismissOnScroll: true }}
                        placeholder="Select Date"
                        onSelectDate={(date) =>
                          setFieldValue("nonBillableEffectiveDate", date)
                        }
                      />
                      <ErrorMessage
                        name="nonBillableEffectiveDate"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* //Conditionally Rendering */}
              {isEditMode && (
                <>
                  {/* //Pay Rate / Bill Rate Change DropDown */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="w-full">
                      <Label
                        required={true}
                        className="flex gap-1 items-center"
                      >
                        {/* <Icon
                          iconName="Tag"
                          className="mr-1 font-bold text-xs"
                          data-tooltip-id="pay-rate-bill-rate-change-tooltip"
                        />{" "} */}
                        <PaidOutlinedIcon /> Pay Rate / Bill Rate Change
                      </Label>

                      <ReactTooltip
                        id="pay-rate-bill-rate-change-tooltip"
                        place="top"
                        content="Please select the pay rate or bill rate change for the candidate"
                      />

                      <Dropdown
                        // selectedKey={values.exemptStatus || ""}
                        placeholder="Select the pay rate or bill rate change for the candidate"
                        options={payRateBillRateChangeOptions}
                        onChange={(e, option) =>
                          setFieldValue(
                            "payRateBillRateChange",
                            option?.key || ""
                          )
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="payRateBillRateChange"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>

                  {/* // Pay Rate Effective Date Conditionally based on above drop down selection only not before  */}
                  {(values.payRateBillRateChange === "Pay Rate change" ||
                    values.payRateBillRateChange ===
                      "Bill Rate and Pay Rate change") && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="w-full">
                        <Label
                          required={true}
                          className="flex gap-1 items-center"
                        >
                          <EventOutlinedIcon />{" "}
                          {/* <Icon
                            iconName="Tag"
                            className="mr-1 font-bold text-xs"
                            data-tooltip-id="pay-rate-effective-date-tooltip"
                          />{" "} */}
                          Pay Rate Effective Date
                        </Label>

                        <ReactTooltip
                          id="pay-rate-effective-date-tooltip"
                          place="top"
                          content="Please select the effective date for the pay rate change"
                        />

                        <DatePicker
                          // value={
                          //   values.tentativeJoiningDate
                          //     ? new Date(values.tentativeJoiningDate)
                          //     : undefined
                          // }
                          allowTextInput={false}
                          calloutProps={{ preventDismissOnScroll: true }}
                          placeholder="Select Date"
                          onSelectDate={(date) =>
                            setFieldValue("payRateEffectiveDate", date)
                          }
                        />
                        <ErrorMessage
                          name="payRateEffectiveDate"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* //Bill Rate Effective Date Conditionally based on above drop down selection only not before  */}
                  {(values.payRateBillRateChange === "Bill Rate change" ||
                    values.payRateBillRateChange ===
                      "Bill Rate and Pay Rate change") && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="w-full">
                        <Label
                          required={true}
                          className="flex gap-1 items-center"
                        >
                          {/* <Icon
                            iconName="Tag"
                            className="mr-1 font-bold text-xs"
                            data-tooltip-id="bill-rate-effective-date-tooltip"
                          />{" "} */}
                          <EventOutlinedIcon />
                          Bill Rate Effective Date
                        </Label>

                        <ReactTooltip
                          id="bill-rate-effective-date-tooltip"
                          place="top"
                          content="Please select the effective date for the Bill rate change"
                        />

                        <DatePicker
                          // value={
                          //   values.tentativeJoiningDate
                          //     ? new Date(values.tentativeJoiningDate)
                          //     : undefined
                          // }
                          allowTextInput={false}
                          calloutProps={{ preventDismissOnScroll: true }}
                          placeholder="Select Date"
                          onSelectDate={(date) =>
                            setFieldValue("billRateEffectiveDate", date)
                          }
                        />
                        <ErrorMessage
                          name="billRateEffectiveDate"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* NEW PAY RATE FIELDS */}

                  {/* //New Pay Rate*/}
                  {(values.payRateBillRateChange === "Pay Rate change" ||
                    values.payRateBillRateChange ===
                      "Bill Rate and Pay Rate change") && (
                    <div>
                      <div className="mb-4 px-2">
                        <Label required className="flex gap-1 items-center">
                          <PaidOutlinedIcon />{" "}
                          {/* <Icon
                            iconName="Money"
                            className="mr-1 font-bold text-xs"
                            data-tooltip-id="new-pay-rate-tooltip"
                          />{" "} */}
                          New Pay Rate
                        </Label>

                        <ReactTooltip
                          id="new-pay-rate-tooltip"
                          place="top"
                          content="Please enter the new pay rate for the candidate"
                        />

                        <div className="grid grid-cols-3 gap-3 items-start w-full">
                          {/* Col 1: Duration */}
                          <div className="min-w-0">
                            <Dropdown
                              // selectedKey={values.newPayRateDuration || ""}
                              placeholder="Select Duration"
                              options={rateFrequencyOptions}
                              onChange={(e, option) => {
                                setFieldValue(
                                  "newPayRateDuration",
                                  option?.key ?? "",
                                  true
                                ); // validate immediately
                                setFieldTouched(
                                  "newPayRateDuration",
                                  true,
                                  false
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newPayRateDuration",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                dropdown: { border: "2px solid #d1d5db" },
                              }}
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newPayRateDuration"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>

                          {/* Col 2: Currency */}
                          <div className="min-w-0">
                            <Dropdown
                              selectedKey={values.newPayRateCurrency || ""}
                              placeholder="Select Currency"
                              options={currencyOptions}
                              onChange={(e, option) => {
                                setFieldValue(
                                  "newPayRateCurrency",
                                  option?.key ?? "",
                                  true
                                ); // validate immediately
                                setFieldTouched(
                                  "newPayRateCurrency",
                                  true,
                                  false
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newPayRateCurrency",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                dropdown: { border: "2px solid #d1d5db" },
                              }}
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newPayRateCurrency"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>

                          {/* Col 3: Amount */}
                          <div className="min-w-0">
                            <TextField
                              // value={values.newPayRate || ""}
                              name="newPayRate"
                              onChange={(e, value) => {
                                setFieldValue("newPayRate", value, true);
                              }}
                              onBlur={() =>
                                setFieldTouched("newPayRate", true, true)
                              }
                              styles={{
                                root: { width: "100%" },
                                fieldGroup: { border: "2px solid #d1d5db" },
                              }}
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newPayRate"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* //New Overtime Pay Rate */}
                      <div className="mb-4 px-2">
                        <Label required className="flex gap-1 items-center">
                          <PaymentsOutlinedIcon />{" "}
                          {/* <Icon
                            iconName="Money"
                            className="mr-1 font-bold text-xs"
                            data-tooltip-id="new-overtime-pay-rate-tooltip"
                          />{" "} */}
                          New Overtime Pay Rate
                        </Label>

                        <ReactTooltip
                          id="new-overtime-pay-rate-tooltip"
                          place="top"
                          content="Please enter the new overtime pay rate for the candidate"
                        />

                        <div className="grid grid-cols-3 gap-3 items-start w-full">
                          {/* Col 1: Duration */}
                          <div className="min-w-0">
                            <Dropdown
                              selectedKey={
                                values.newOvertimePayRateDuration || ""
                              }
                              placeholder="Select Duration"
                              options={rateFrequencyOptions}
                              onChange={(e, option) => {
                                setFieldValue(
                                  "newOvertimePayRateDuration",
                                  option?.key ?? "",
                                  true
                                ); // validate immediately
                                setFieldTouched(
                                  "newOvertimePayRateDuration",
                                  true,
                                  false
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newOvertimePayRateDuration",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                dropdown: { border: "2px solid #d1d5db" },
                              }}
                              disabled={
                                rateDisabled ||
                                (values.exemptStatus !== "Exempt" &&
                                  values.typeOfPlacement !== "Permanent")
                              }
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newOvertimePayRateDuration"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>

                          {/* Col 2: Currency */}
                          <div className="min-w-0">
                            <Dropdown
                              selectedKey={
                                values.newOvertimePayRateCurrency || ""
                              }
                              placeholder="Select Currency"
                              options={currencyOptions}
                              onChange={(e, option) => {
                                setFieldValue(
                                  "newOvertimePayRateCurrency",
                                  option?.key ?? "",
                                  true
                                ); // validate immediately
                                setFieldTouched(
                                  "newOvertimePayRateCurrency",
                                  true,
                                  false
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newOvertimePayRateCurrency",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                dropdown: { border: "2px solid #d1d5db" },
                              }}
                              disabled={
                                rateDisabled ||
                                (values.exemptStatus !== "Exempt" &&
                                  values.typeOfPlacement !== "Permanent")
                              }
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newOvertimePayRateCurrency"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>

                          {/* Col 3: Amount */}
                          <div className="min-w-0">
                            <TextField
                              value={values.newOvertimePayRate}
                              name="newOvertimePayRate"
                              onChange={(e, value) => {
                                setFieldValue(
                                  "newOvertimePayRate",
                                  value,
                                  true
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newOvertimePayRate",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                fieldGroup: { border: "2px solid #d1d5db" },
                              }}
                              disabled={
                                rateDisabled ||
                                (values.exemptStatus !== "Exempt" &&
                                  values.typeOfPlacement !== "Permanent")
                              }
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newOvertimePayRate"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* //New Double Overtime Pay Rate */}
                      <div className="mb-4 px-2">
                        <Label required className="flex gap-1 items-center">
                          <CurrencyExchangeOutlinedIcon />{" "}
                          {/* <Icon
                            iconName="Money"
                            className="mr-1 font-bold text-xs"
                            data-tooltip-id="new-double-overtime-pay-rate-tooltip"
                          />{" "} */}
                          New Double Overtime Pay Rate
                        </Label>

                        <ReactTooltip
                          id="new-double-overtime-pay-rate-tooltip"
                          place="top"
                          content="Please enter the new double overtime pay rate for the candidate"
                        />

                        <div className="grid grid-cols-3 gap-3 items-start w-full">
                          {/* Col 1: Duration */}
                          <div className="min-w-0">
                            <Dropdown
                              selectedKey={
                                values.newDoubleOvertimePayRateDuration || ""
                              }
                              placeholder="Select Duration"
                              options={rateFrequencyOptions}
                              onChange={(e, option) => {
                                setFieldValue(
                                  "newDoubleOvertimePayRateDuration",
                                  option?.key ?? "",
                                  true
                                ); // validate immediately
                                setFieldTouched(
                                  "newDoubleOvertimePayRateDuration",
                                  true,
                                  false
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newDoubleOvertimePayRateDuration",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                dropdown: { border: "2px solid #d1d5db" },
                              }}
                              disabled={
                                rateDisabled ||
                                (values.exemptStatus !== "Exempt" &&
                                  values.typeOfPlacement !== "Permanent")
                              }
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newDoubleOvertimePayRateDuration"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>

                          {/* Col 2: Currency */}
                          <div className="min-w-0">
                            <Dropdown
                              selectedKey={
                                values.newDoubleOvertimePayRateCurrency || ""
                              }
                              placeholder="Select Currency"
                              options={currencyOptions}
                              onChange={(e, option) => {
                                setFieldValue(
                                  "newDoubleOvertimePayRateCurrency",
                                  option?.key ?? "",
                                  true
                                ); // validate immediately
                                setFieldTouched(
                                  "newDoubleOvertimePayRateCurrency",
                                  true,
                                  false
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newDoubleOvertimePayRateCurrency",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                dropdown: { border: "2px solid #d1d5db" },
                              }}
                              disabled={
                                rateDisabled ||
                                (values.exemptStatus !== "Exempt" &&
                                  values.typeOfPlacement !== "Permanent")
                              }
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newDoubleOvertimePayRateCurrency"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>

                          {/* Col 3: Amount */}
                          <div className="min-w-0">
                            <TextField
                              value={values.newDoubleOvertimePayRate}
                              name="newDoubleOvertimePayRate"
                              onChange={(e, value) => {
                                setFieldValue(
                                  "newDoubleOvertimePayRate",
                                  value,
                                  true
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newDoubleOvertimePayRate",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                fieldGroup: { border: "2px solid #d1d5db" },
                              }}
                              disabled={
                                rateDisabled ||
                                (values.exemptStatus !== "Exempt" &&
                                  values.typeOfPlacement !== "Permanent")
                              }
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newDoubleOvertimePayRate"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NEW BILL RATE FIELDS */}

                  {/* //New Bill Rate */}
                  {(values.payRateBillRateChange === "Bill Rate change" ||
                    values.payRateBillRateChange ===
                      "Bill Rate and Pay Rate change") && (
                    <div>
                      <div className="mb-4 px-2">
                        <Label required className="flex gap-1 items-center">
                          <PaidOutlinedIcon />{" "}
                          {/* <Icon
                            iconName="Money"
                            className="mr-1 font-bold text-xs"
                            data-tooltip-id="new-bill-rate-tooltip"
                          />{" "} */}
                          New Bill Rate
                        </Label>

                        <ReactTooltip
                          id="new-bill-rate-tooltip"
                          place="top"
                          content="Please enter the new bill rate for the candidate"
                        />

                        <div className="grid grid-cols-3 gap-3 items-start w-full">
                          {/* Col 1: Duration */}
                          <div className="min-w-0">
                            <Dropdown
                              // selectedKey={values.newBillRateDuration || ""}
                              placeholder="Select Duration"
                              options={rateFrequencyOptions}
                              onChange={(e, option) => {
                                setFieldValue(
                                  "newBillRateDuration",
                                  option?.key ?? "",
                                  true
                                ); // validate immediately
                                setFieldTouched(
                                  "newBillRateDuration",
                                  true,
                                  false
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newBillRateDuration",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                dropdown: { border: "2px solid #d1d5db" },
                              }}
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newBillRateDuration"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>

                          {/* Col 2: Currency */}
                          <div className="min-w-0">
                            <Dropdown
                              selectedKey={values.newBillRateCurrency || ""}
                              placeholder="Select Currency"
                              options={currencyOptions}
                              onChange={(e, option) => {
                                setFieldValue(
                                  "newBillRateCurrency",
                                  option?.key ?? "",
                                  true
                                ); // validate immediately
                                setFieldTouched(
                                  "newBillRateCurrency",
                                  true,
                                  false
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newBillRateCurrency",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                dropdown: { border: "2px solid #d1d5db" },
                              }}
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newBillRateCurrency"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>

                          {/* Col 3: Amount */}
                          <div className="min-w-0">
                            <TextField
                              // value={values.newBillRate || ""}
                              name="newBillRate"
                              onChange={(e, value) => {
                                setFieldValue("newBillRate", value, true);
                              }}
                              onBlur={() =>
                                setFieldTouched("newBillRate", true, true)
                              }
                              styles={{
                                root: { width: "100%" },
                                fieldGroup: { border: "2px solid #d1d5db" },
                              }}
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newBillRate"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* //New Overtime Bill Rate */}
                      <div className="mb-4 px-2">
                        <Label required className="flex gap-1 items-center">
                          <PaymentsOutlinedIcon />{" "}
                          {/* <Icon
                            iconName="Money"
                            className="mr-1 font-bold text-xs"
                            data-tooltip-id="new-overtime-bill-rate-tooltip"
                          />{" "} */}
                          New Overtime Bill Rate
                        </Label>

                        <ReactTooltip
                          id="new-overtime-bill-rate-tooltip"
                          place="top"
                          content="Please enter the new overtime bill rate for the candidate"
                        />

                        <div className="grid grid-cols-3 gap-3 items-start w-full">
                          {/* Col 1: Duration */}
                          <div className="min-w-0">
                            <Dropdown
                              selectedKey={
                                values.newOvertimeBillRateDuration || ""
                              }
                              placeholder="Select Duration"
                              options={rateFrequencyOptions}
                              onChange={(e, option) => {
                                setFieldValue(
                                  "newOvertimeBillRateDuration",
                                  option?.key ?? "",
                                  true
                                ); // validate immediately
                                setFieldTouched(
                                  "newOvertimeBillRateDuration",
                                  true,
                                  false
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newOvertimeBillRateDuration",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                dropdown: { border: "2px solid #d1d5db" },
                              }}
                              disabled={rateDisabled}
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newOvertimeBillRateDuration"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>

                          {/* Col 2: Currency */}
                          <div className="min-w-0">
                            <Dropdown
                              selectedKey={
                                values.newOvertimeBillRateCurrency || ""
                              }
                              placeholder="Select Currency"
                              options={currencyOptions}
                              onChange={(e, option) => {
                                setFieldValue(
                                  "newOvertimeBillRateCurrency",
                                  option?.key ?? "",
                                  true
                                ); // validate immediately
                                setFieldTouched(
                                  "newOvertimeBillRateCurrency",
                                  true,
                                  false
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newOvertimeBillRateCurrency",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                dropdown: { border: "2px solid #d1d5db" },
                              }}
                              disabled={rateDisabled}
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newOvertimeBillRateCurrency"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>

                          {/* Col 3: Amount */}
                          <div className="min-w-0">
                            <TextField
                              value={values.newOvertimeBillRate}
                              name="newOvertimeBillRate"
                              onChange={(e, value) => {
                                setFieldValue(
                                  "newOvertimeBillRate",
                                  value,
                                  true
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newOvertimeBillRate",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                fieldGroup: { border: "2px solid #d1d5db" },
                              }}
                              disabled={rateDisabled}
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newOvertimeBillRate"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* //New Double Overtime Bill Rate */}
                      <div className="mb-4 px-2">
                        <Label required className="flex gap-1 items-center">
                          <CurrencyExchangeOutlinedIcon />{" "}
                          {/* <Icon
                            iconName="Money"
                            className="mr-1 font-bold text-xs"
                            data-tooltip-id="new-double-overtime-bill-rate-tooltip"
                          />{" "} */}
                          New Double Overtime Bill Rate
                        </Label>

                        <ReactTooltip
                          id="new-double-overtime-bill-rate-tooltip"
                          place="top"
                          content="Please enter the new double overtime bill rate for the candidate"
                        />

                        <div className="grid grid-cols-3 gap-3 items-start w-full">
                          {/* Col 1: Duration */}
                          <div className="min-w-0">
                            <Dropdown
                              selectedKey={
                                values.newDoubleOvertimeBillRateDuration || ""
                              }
                              placeholder="Select Duration"
                              options={rateFrequencyOptions}
                              onChange={(e, option) => {
                                setFieldValue(
                                  "newDoubleOvertimeBillRateDuration",
                                  option?.key ?? "",
                                  true
                                ); // validate immediately
                                setFieldTouched(
                                  "newDoubleOvertimeBillRateDuration",
                                  true,
                                  false
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newDoubleOvertimeBillRateDuration",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                dropdown: { border: "2px solid #d1d5db" },
                              }}
                              disabled={rateDisabled}
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newDoubleOvertimeBillRateDuration"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>

                          {/* Col 2: Currency */}
                          <div className="min-w-0">
                            <Dropdown
                              selectedKey={
                                values.newDoubleOvertimeBillRateCurrency || ""
                              }
                              placeholder="Select Currency"
                              options={currencyOptions}
                              onChange={(e, option) => {
                                setFieldValue(
                                  "newDoubleOvertimeBillRateCurrency",
                                  option?.key ?? "",
                                  true
                                ); // validate immediately
                                setFieldTouched(
                                  "newDoubleOvertimeBillRateCurrency",
                                  true,
                                  false
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newDoubleOvertimeBillRateCurrency",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                dropdown: { border: "2px solid #d1d5db" },
                              }}
                              disabled={rateDisabled}
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newDoubleOvertimeBillRateCurrency"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>

                          {/* Col 3: Amount */}
                          <div className="min-w-0">
                            <TextField
                              value={values.newDoubleOvertimeBillRate}
                              name="newDoubleOvertimeBillRate"
                              onChange={(e, value) => {
                                setFieldValue(
                                  "newDoubleOvertimeBillRate",
                                  value,
                                  true
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  "newDoubleOvertimeBillRate",
                                  true,
                                  true
                                )
                              }
                              styles={{
                                root: { width: "100%" },
                                fieldGroup: { border: "2px solid #d1d5db" },
                              }}
                              disabled={rateDisabled}
                            />
                            <div className="h-4 mt-1">
                              <ErrorMessage
                                name="newDoubleOvertimeBillRate"
                                component="div"
                                className="text-red-500 text-xs leading-4"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <TimelapseOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="contract-duration-tooltip"
                    />{" "} */}
                    Contract Duration (Months)
                  </Label>

                  <ReactTooltip
                    id="contract-duration-tooltip"
                    place="top"
                    content="Please enter the contract duration in months"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.contractDurationMonths ?? "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.contractDurationMonths || ""}
                        //Might have to convert this to again string , as it takes string value , we are fetching number so might have to else i think it wont cause error as well ( compile time ofc wont give and run time yes it can give in run tim e( react logs , but ig wont fail the buld and dont crash, give warnig or erro ig ))
                        placeholder="Enter Contract Duration"
                        onChange={(e, value) => {
                          setFieldValue(
                            "contractDurationMonths",
                            Number(value) || "",
                            true
                          ); // validate now
                        }}
                        onBlur={() =>
                          setFieldTouched("contractDurationMonths", true, true)
                        }
                        styles={{ fieldGroup: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="contractDurationMonths"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <ScheduleOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="no-of-hours-tooltip"
                    />{" "} */}
                    No of Hours on This Position
                  </Label>

                  <ReactTooltip
                    id="no-of-hours-tooltip"
                    place="top"
                    content="Please enter the number of hours for this position"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.noOfHoursOnThisPosition ?? "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.noOfHoursOnThisPosition || ""}
                        placeholder="Select Hours"
                        options={noOfHoursOnThisPositionOptions}
                        onChange={(e, option) =>
                          setFieldValue(
                            "noOfHoursOnThisPosition",
                            Number(option?.key) || null
                          )
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="noOfHoursOnThisPosition"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <EventOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Calendar"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="tentative-joining-date-tooltip"
                    />{" "} */}
                    Tentative Joining Date
                  </Label>

                  <ReactTooltip
                    id="tentative-joining-date-tooltip"
                    place="top"
                    content="Please select the tentative joining date of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.tentativeJoiningDate &&
                      values.tentativeJoiningDate !== "1900-01-01T00:00:00.000Z"
                        ? new Date(
                            values.tentativeJoiningDate
                          ).toLocaleDateString()
                        : "-"}
                    </div>
                  ) : (
                    <>
                      <DatePicker
                        value={
                          values.tentativeJoiningDate &&
                          values.tentativeJoiningDate !==
                            "1900-01-01T00:00:00.000Z"
                            ? new Date(values.tentativeJoiningDate)
                            : undefined
                        }
                        allowTextInput={false}
                        calloutProps={{ preventDismissOnScroll: true }}
                        placeholder="Select Date"
                        onSelectDate={(date) =>
                          setFieldValue("tentativeJoiningDate", date ?? "")
                        }
                      />
                      <ErrorMessage
                        name="tentativeJoiningDate"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <EventOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Calendar"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="proposed-end-date-tooltip"
                    />{" "} */}
                    Proposed End Date
                  </Label>

                  <ReactTooltip
                    id="proposed-end-date-tooltip"
                    place="top"
                    content="Please select the proposed end date of the candidate's assignment"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.proposedEndDate &&
                      values.proposedEndDate !== "1900-01-01T00:00:00.000Z"
                        ? new Date(values.proposedEndDate).toLocaleDateString()
                        : "-"}
                    </div>
                  ) : (
                    <>
                      <DatePicker
                        value={
                          values.proposedEndDate &&
                          values.proposedEndDate !== "1900-01-01T00:00:00.000Z"
                            ? new Date(values.proposedEndDate)
                            : undefined
                        }
                        allowTextInput={false}
                        calloutProps={{ preventDismissOnScroll: true }}
                        placeholder="Select Date"
                        onSelectDate={(date) =>
                          setFieldValue("proposedEndDate", date ?? "")
                        }
                      />
                      <ErrorMessage
                        name="proposedEndDate"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <CalendarMonthOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="PaymentCard"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="payroll-schedule-tooltip"
                    />{" "} */}
                    Payroll Schedule
                  </Label>

                  <ReactTooltip
                    id="payroll-schedule-tooltip"
                    place="top"
                    content="Please select the payroll schedule for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.payrollSchedule || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.payrollSchedule || ""}
                        placeholder="Select Payroll Schedule"
                        options={payrollScheduleOptions}
                        onChange={(e, option) =>
                          setFieldValue("payrollSchedule", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="payrollSchedule"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <HandshakeOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="PeopleRepeat"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="type-of-engagement-tooltip"
                    />{" "} */}
                    Type of Engagement
                  </Label>

                  <ReactTooltip
                    id="type-of-engagement-tooltip"
                    place="top"
                    content="Please select the type of engagement for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.typeOfEngagement || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.typeOfEngagement || ""}
                        placeholder="Select Type of Engagement"
                        options={typeOfEngagementOptions}
                        onChange={(e, option) =>
                          setFieldValue("typeOfEngagement", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="typeOfEngagement"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <AdminPanelSettingsOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Shield"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="work-authorization-status-tooltip"
                    />{" "} */}
                    Work Authorization Status
                  </Label>

                  <ReactTooltip
                    id="work-authorization-status-tooltip"
                    place="top"
                    content="Please select the work authorization status of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.workAuthorizationStatus || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.workAuthorizationStatus || ""}
                        placeholder="Select Work Authorization Status"
                        options={workAuthorizationStatusOptions}
                        onChange={(e, option) =>
                          setFieldValue(
                            "workAuthorizationStatus",
                            option?.key || ""
                          )
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="workAuthorizationStatus"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label
                    required={
                      nonExpiryWorkAuthorisationOptions.includes(
                        values.workAuthorizationStatus
                      )
                        ? true
                        : false
                    }
                    className="flex gap-1 items-center"
                  >
                    <EventAvailableOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Calendar"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="work-auth-expiration-date-tooltip"
                    />{" "} */}
                    Work Auth. Expiration Date
                  </Label>

                  <ReactTooltip
                    id="work-auth-expiration-date-tooltip"
                    place="top"
                    content="Please select the work authorization expiration date of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.workAuthorizationExpirationDate &&
                      values.workAuthorizationExpirationDate !==
                        "1900-01-01T00:00:00.000Z"
                        ? dayjs(values.workAuthorizationExpirationDate).format(
                            "DD/MM/YYYY"
                          )
                        : "-"}
                    </div>
                  ) : (
                    <>
                      <DatePicker
                        value={
                          values.workAuthorizationExpirationDate &&
                          values.workAuthorizationExpirationDate !==
                            "1900-01-01T00:00:00.000Z"
                            ? new Date(values.workAuthorizationExpirationDate)
                            : undefined
                        }
                        allowTextInput={false}
                        calloutProps={{ preventDismissOnScroll: true }}
                        placeholder="Select Date"
                        onSelectDate={(date) =>
                          setFieldValue(
                            "workAuthorizationExpirationDate",
                            date ?? ""
                          )
                        }
                      />
                      <ErrorMessage
                        name="workAuthorizationExpirationDate"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <DomainVerificationOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="NumberSymbol"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="requirement-id-tooltip"
                    />{" "} */}
                    Requirement ID
                  </Label>

                  <ReactTooltip
                    id="requirement-id-tooltip"
                    place="top"
                    content="Please enter the requirement ID for this position"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.requirementID || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.requirementID || ""}
                        placeholder="Enter Requirement ID"
                        onChange={(e, value) => {
                          setFieldValue("requirementID", value || "", true); // validate now
                        }}
                        onBlur={() =>
                          setFieldTouched("requirementID", true, true)
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="requirementID"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <BadgeOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="IDBadge"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="contingent-worker-id-tooltip"
                    />{" "} */}
                    Contingent Worker ID
                  </Label>

                  <ReactTooltip
                    id="contingent-worker-id-tooltip"
                    place="top"
                    content="Please enter the contingent worker ID for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.contingentWorkerID || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.contingentWorkerID || ""}
                        placeholder="Enter Contingent Worker ID"
                        onChange={(e, value) =>
                          setFieldValue("contingentWorkerID", value || "")
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="contingentWorkerID"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <AdfScannerOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="requirement-classification-tooltip"
                    />{" "} */}
                    Requirement Classification
                  </Label>

                  <ReactTooltip
                    id="requirement-classification-tooltip"
                    place="top"
                    content="Please select the requirement classification for this position"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.requirementClassification || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.requirementClassification || ""}
                        placeholder="Select Requirement Classification"
                        options={requirementClassificationOptions}
                        onChange={(e, option) => {
                          setFieldValue(
                            "requirementClassification",
                            option?.key ?? "",
                            true
                          ); // validate immediately
                          setFieldTouched(
                            "requirementClassification",
                            true,
                            false
                          );
                        }}
                        onBlur={() =>
                          setFieldTouched(
                            "requirementClassification",
                            true,
                            true
                          )
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="requirementClassification"
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
