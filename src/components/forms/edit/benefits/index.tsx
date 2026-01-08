import { ErrorMessage, useFormikContext } from "formik";
import React, { useEffect } from "react";
import { benefitCostOptions, enrollmentStatusOptions } from "./utils";

import { Label, TextField, Dropdown, DatePicker } from "@fluentui/react";
import type { EditFormValues } from "../../../cst-view/utils/edit-utils";

import { Tooltip as ReactTooltip } from "react-tooltip";

import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

export const Benefits = ({
  EditFormInitialValues,
  isViewMode,
}: {
  EditFormInitialValues: EditFormValues | null;
  isViewMode: boolean;
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

  const { values, setFieldValue } = useFormikContext<any>();

  return (
    <section>
      <div className="bg-gray-200 p-2">
        <div>
          <div className="px-4 py-6 bg-white">
            <div>
              <div className="grid grid-cols-2 gap-3">
                {/* Benefit Cost */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <PaidOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="benefit-cost-tooltip"
                    />{" "} */}
                    Benefit Cost
                  </Label>

                  <ReactTooltip
                    id="benefit-cost-tooltip"
                    place="top"
                    content="Please enter the benefit cost associated with the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.benefitCost || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.benefitCost || ""}
                        placeholder="Select Benefit Cost"
                        options={benefitCostOptions}
                        onChange={(e, option) =>
                          setFieldValue("benefitCost", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="benefitCost"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* 401K Enrollment Date */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <CalendarMonthOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Calendar"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="401k-enrollment-date-tooltip"
                    />{" "} */}
                    401K Enrollment Date
                  </Label>

                  <ReactTooltip
                    id="401k-enrollment-date-tooltip"
                    place="top"
                    content="Please select the 401K enrollment date for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.enrollment401kDate &&
                      values.enrollment401kDate !== "1900-01-01T00:00:00.000Z"
                        ? new Date(
                            values.enrollment401kDate
                          ).toLocaleDateString()
                        : "-"}
                    </div>
                  ) : (
                    <>
                      <DatePicker
                        value={
                          values.enrollment401kDate &&
                          values.enrollment401kDate !==
                            "1900-01-01T00:00:00.000Z"
                            ? new Date(values.enrollment401kDate)
                            : undefined
                        }
                        placeholder="Select 401K Enrollment Date"
                        onSelectDate={(date) =>
                          setFieldValue("enrollment401kDate", date ?? "")
                        }
                      />
                      <ErrorMessage
                        name="enrollment401kDate"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* 401K Enrollment Status */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <FactCheckOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Tag"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="401k-enrollment-status-tooltip"
                    />{" "} */}
                    401K Enrollment Status
                  </Label>

                  <ReactTooltip
                    id="401k-enrollment-status-tooltip"
                    place="top"
                    content="Please select the 401K enrollment status of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.enrollmentStatus || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.enrollmentStatus || ""}
                        placeholder="Select 401K Enrollment Status"
                        options={enrollmentStatusOptions}
                        onChange={(e, option) =>
                          setFieldValue("enrollmentStatus", option?.key || "")
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="enrollmentStatus"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Employee Engagement */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <GroupsOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Info"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="employee-engagement-tooltip"
                    />{" "} */}
                    Employee Engagement
                  </Label>

                  <ReactTooltip
                    id="employee-engagement-tooltip"
                    place="top"
                    content="Please provide details about employee engagement for the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700 whitespace-pre-wrap">
                      {values.employeeEngagement || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.employeeEngagement || ""}
                        placeholder="Enter Employee Engagement"
                        onChange={(e, value) =>
                          setFieldValue("employeeEngagement", value || "")
                        }
                        styles={{ fieldGroup: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="employeeEngagement"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Employee Engagement Date */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <EventOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Calendar"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="employee-engagement-date-tooltip"
                    />{" "} */}
                    Employee Engagement Date
                  </Label>

                  <ReactTooltip
                    id="employee-engagement-date-tooltip"
                    place="top"
                    content="Please select the date for employee engagement activities"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.employeeEngagementDate &&
                      values.employeeEngagementDate !==
                        "1900-01-01T00:00:00.000Z"
                        ? new Date(
                            values.employeeEngagementDate
                          ).toLocaleDateString()
                        : "-"}
                    </div>
                  ) : (
                    <>
                      <DatePicker
                        value={
                          values.employeeEngagementDate &&
                          values.employeeEngagementDate !==
                            "1900-01-01T00:00:00.000Z"
                            ? new Date(values.employeeEngagementDate)
                            : undefined
                        }
                        placeholder="Select Employee Engagement Date"
                        onSelectDate={(date) =>
                          setFieldValue("employeeEngagementDate", date ?? "")
                        }
                      />
                      <ErrorMessage
                        name="employeeEngagementDate"
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
