import React, { useEffect, useState } from "react";
import { Label } from "@fluentui/react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import ApiClient from "../../../services/ApiClient";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";

type HistoryItem = {
  iEmployeeId: number;
  cEmployeeName: string;
  User_TimeStamp: string;
  cValueChanges: string;
  Approver_TimeStamp: string;
};

export const History = ({ consultantId }: { consultantId: string }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    const fetchHistory = async () => {
      try {
        // const response = await fetch(
        //   `https://varfunctiontypescriptcst.azurewebsites.net/api/consultant-history/get-consultant-history?id=${consultantId}`
        // );
        // const data = await response.json();
        const data = await ApiClient.get(
          `consultant-history/get-consultant-history?id=${consultantId}`
        );
        setHistory(data || []);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (consultantId) fetchHistory();
  }, [consultantId]);

  return (
    <section className="bg-gray-100 p-4 rounded-lg shadow-sm">
      <div className="px-6 py-5 bg-white rounded-lg shadow">
        <div className="flex items-center mb-4">
          {/* <Icon
            iconName="Comment"
            className="mr-2 text-blue-600"
            data-tooltip-id="history-tooltip"
          /> */}
          <Label className="flex gap-1 items-center">
            <SettingsBackupRestoreOutlinedIcon />
            History
          </Label>
          <ReactTooltip
            id="history-tooltip"
            place="top"
            content="View the history and previous updates for this record"
          />
        </div>

        {loading ? (
          <p className="text-sm text-gray-600">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-600">No history found.</p>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
              >
                <div className="mb-2 text-sm text-gray-700">
                  <span className="font-semibold text-blue-700">By:</span>{" "}
                  <span>{item.User_TimeStamp.trim()}</span>
                </div>

                <div className="text-sm text-gray-800 whitespace-pre-wrap">
                  {item.cValueChanges.split("],").map((change, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 bg-blue-100 rounded text-blue-800 mb-1"
                    >
                      {change.trim().replace(/[[\]]/g, "")}
                    </div>
                  ))}
                </div>

                {item.Approver_TimeStamp.trim() && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-green-700">
                      Approved:
                    </span>{" "}
                    {item.Approver_TimeStamp.trim()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
