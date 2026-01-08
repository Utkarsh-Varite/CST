import { ErrorMessage, useFormikContext } from "formik";
import { useEffect } from "react";
import {
  Label,
  Dropdown,
  DatePicker,
  //IDropdownOption,
} from "@fluentui/react";
import dayjs from "dayjs";

import {
  timesheetAccessOptions,
  medicalBenefitsOptions,
  vendorCOIRequiredOptions,
} from "./utils";
import type { EditFormValues } from "../../../cst-view/utils/edit-utils";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useSearchParams } from "react-router-dom";
import EventOutlinedIcon from "@mui/icons-material/Event";
import PunchClockOutlinedIcon from "@mui/icons-material/PunchClockOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import AssuredWorkloadOutlinedIcon from "@mui/icons-material/AssuredWorkloadOutlined";
import FollowTheSignsOutlinedIcon from "@mui/icons-material/FollowTheSignsOutlined";

export const JoiningDetails = ({
  // EditFormInitialValues,
  isViewMode,
}: {
  EditFormInitialValues: EditFormValues | null;
  isViewMode: boolean;
}) => {
  const [searchParams] = useSearchParams();
  const consultantId = searchParams.get("consultantId");
  const isCreateMode = !consultantId;
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

  const { values, setFieldValue } = useFormikContext<any>();

  return (
    <section>
      <div className="bg-gray-200 p-2">
        <div>
          <div className="px-4 py-6 bg-white">
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div className="w-full">
                  <Label
                    required={values.employeeStatus === 1 ? true : false}
                    className="flex gap-1 items-center"
                  >
                    <EventOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Calendar"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="date-of-joining-tooltip"
                    />{" "} */}
                    Date of Joining
                  </Label>

                  <ReactTooltip
                    id="date-of-joining-tooltip"
                    place="top"
                    content="Please select the candidate's date of joining"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.dateOfJoining &&
                      values.dateOfJoining !== "1900-01-01T00:00:00.000Z"
                        ? dayjs(values.dateOfJoining).format("DD MMM YYYY")
                        : "-"}
                    </div>
                  ) : (
                    <>
                      <DatePicker
                        value={
                          values.dateOfJoining &&
                          values.dateOfJoining !== "1900-01-01T00:00:00.000Z"
                            ? new Date(values.dateOfJoining)
                            : undefined
                        }
                        placeholder="Select Date of Joining"
                        onSelectDate={(date) =>
                          setFieldValue("dateOfJoining", date ?? "")
                        }
                        disabled={isCreateMode}
                      />
                      <ErrorMessage
                        name="dateOfJoining"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <PunchClockOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="timesheet-access-tooltip"
                    />{" "} */}
                    Timesheet Access
                  </Label>

                  <ReactTooltip
                    id="timesheet-access-tooltip"
                    place="top"
                    content="Please select the timesheet access status for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.timesheetAccess || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.timesheetAccess || ""}
                        placeholder="Select Timesheet Access"
                        options={timesheetAccessOptions}
                        onChange={(e, option) =>
                          setFieldValue("timesheetAccess", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        disabled={isCreateMode}
                      />
                      <ErrorMessage
                        name="timesheetAccess"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <LocalHospitalOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="medical-benefits-tooltip"
                    />{" "} */}
                    Medical Benefits (Portal Access)
                  </Label>

                  <ReactTooltip
                    id="medical-benefits-tooltip"
                    place="top"
                    content="Please indicate if the candidate has medical benefits with portal access"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.medicalBenefits || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.medicalBenefits || ""}
                        placeholder="Select Requirement Classification"
                        options={medicalBenefitsOptions}
                        onChange={(e, option) =>
                          setFieldValue("medicalBenefits", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                        disabled={isCreateMode}
                      />
                      <ErrorMessage
                        name="medicalBenefits"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <AssuredWorkloadOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="vendor-coi-required-tooltip"
                    />{" "} */}
                    Vendor COI Required
                  </Label>

                  <ReactTooltip
                    id="vendor-coi-required-tooltip"
                    place="top"
                    content="Please specify if a Vendor Certificate of Insurance (COI) is required"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.vendorCOIrequired || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.vendorCOIrequired || ""}
                        placeholder="Select Requirement Classification"
                        options={vendorCOIRequiredOptions}
                        onChange={(e, option) =>
                          setFieldValue("vendorCOIrequired", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="vendorCOIrequired"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <EventOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Calendar"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="vendor-coi-expiration-tooltip"
                    />{" "} */}
                    Vendor COI Expiration
                  </Label>

                  <ReactTooltip
                    id="vendor-coi-expiration-tooltip"
                    place="top"
                    content="Please select the expiration date of the Vendor Certificate of Insurance (COI)"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.vendorCOIexpiration &&
                      values.vendorCOIexpiration !== "1900-01-01T00:00:00.000Z"
                        ? dayjs(values.vendorCOIexpiration).format(
                            "DD MMM YYYY"
                          )
                        : "-"}
                    </div>
                  ) : (
                    <>
                      <DatePicker
                        value={
                          values.vendorCOIexpiration &&
                          values.vendorCOIexpiration !==
                            "1900-01-01T00:00:00.000Z"
                            ? new Date(values.vendorCOIexpiration)
                            : undefined
                        }
                        allowTextInput={false}
                        calloutProps={{ preventDismissOnScroll: true }}
                        placeholder="Select Date"
                        onSelectDate={(date) =>
                          setFieldValue("vendorCOIexpiration", date ?? "")
                        }
                      />
                      <ErrorMessage
                        name="vendorCOIexpiration"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <EventOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="IDBadge"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="vendor-coi-expiration-calculated-tooltip"
                    />{" "} */}
                    Vendor COI Expiration (Calculated Date Field)
                  </Label>

                  <ReactTooltip
                    id="vendor-coi-expiration-calculated-tooltip"
                    place="top"
                    content="This field shows the calculated expiration date for the Vendor Certificate of Insurance (COI)"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.vendorCOIexpirationDateField &&
                      values.vendorCOIexpirationDateField !==
                        "1900-01-01T00:00:00.000Z"
                        ? dayjs(values.vendorCOIexpirationDateField).format(
                            "DD MMM YYYY"
                          )
                        : "-"}
                    </div>
                  ) : (
                    <>
                      <DatePicker
                        value={
                          values.vendorCOIexpirationDateField &&
                          values.vendorCOIexpirationDateField !==
                            "1900-01-01T00:00:00.000Z"
                            ? new Date(values.vendorCOIexpirationDateField)
                            : undefined
                        }
                        placeholder="Select Date"
                        onSelectDate={(date) =>
                          setFieldValue(
                            "vendorCOIexpirationDateField",
                            date ?? ""
                          )
                        }
                        disabled={isCreateMode}
                      />
                      <ErrorMessage
                        name="vendorCOIexpirationDateField"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <FollowTheSignsOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="post-joining-follow-up-tooltip"
                    />{" "} */}
                    Post Joining Consultant Follow Up
                  </Label>

                  <ReactTooltip
                    id="post-joining-follow-up-tooltip"
                    place="top"
                    content="Please indicate if post joining consultant follow-up is required"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.postJoiningConsultant &&
                      values.postJoiningConsultant !==
                        "1900-01-01T00:00:00.000Z"
                        ? dayjs(values.postJoiningConsultant).format(
                            "DD MMM YYYY"
                          )
                        : "-"}
                    </div>
                  ) : (
                    <>
                      <DatePicker
                        value={
                          values.postJoiningConsultant &&
                          values.postJoiningConsultant !==
                            "1900-01-01T00:00:00.000Z"
                            ? new Date(values.postJoiningConsultant)
                            : undefined
                        }
                        placeholder="Select Date"
                        onSelectDate={(date) =>
                          setFieldValue("postJoiningConsultant", date ?? "")
                        }
                        disabled={isCreateMode}
                      />
                      <ErrorMessage
                        name="postJoiningConsultant"
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
