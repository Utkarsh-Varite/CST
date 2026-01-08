import { ErrorMessage, useFormikContext } from "formik";
import React, { useEffect } from "react";
import { Label, TextField } from "@fluentui/react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import type { EditFormValues } from "../../../cst-view/utils/edit-utils";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
// import { TooltipHost } from "@fluentui/react";

export const Comments = ({
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
              <div className="grid grid-cols-1 gap-3">
                {/* Comments Text Field */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <CommentOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Comment"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="comments-tooltip"
                    />{" "} */}
                    Comments
                  </Label>

                  <ReactTooltip
                    id="comments-tooltip"
                    place="top"
                    content="Enter your thoughts, feedback, or any information you'd like to share."
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700 min-h-[150px] whitespace-pre-wrap">
                      {values.comments || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        placeholder="Enter your comments here"
                        onChange={(e, value) =>
                          setFieldValue("comments", value || "")
                        }
                        value={values.comments || ""}
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
                        name="comments"
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
