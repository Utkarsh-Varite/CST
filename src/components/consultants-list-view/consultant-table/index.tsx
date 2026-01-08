import React, { useEffect, useState } from "react";
import { Paper, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ApiClient from "../../../services/ApiClient";
import Loader from "../../commons/loader";

type ConsultantData = {
  id: number; // iEmployeeId
  consultantName: string; // cEmployeeName
  employeeStatus: string; // cEmployeeStatus
  typeOfPlacement: string; // cTypeOfPlacement
  clientName: string; // cClientName
  payRate: string; // iPayRate + cPayRateCurrenyType
  billRate: string; // iBillRate + cBillRateCurrenyType
  dateOfJoining: string; // cDateofJoining (formatted)
  dateOfExit: string; // cDateOfExit (formatted)
  jobTitle: string; // cJobTitle
  createdBy: string; // cCreatedBy
};

export const ConsultantTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("ID is : ", id);

  type ConsultantOptionType =
    | "Active Consultant"
    | "OnBoarding Consultant"
    | "Past Consultant"
    | "Others Consultant"
    | "Pending Consultant"
    | "Rejected Consultant";

  const consultantOptions: ConsultantOptionType[] = [
    "Active Consultant",
    "OnBoarding Consultant",
    "Past Consultant",
    "Others Consultant",
    "Pending Consultant",
    "Rejected Consultant",
  ];

  const [activeOption, setActiveOption] =
    useState<ConsultantOptionType>("Active Consultant");
  const [rows, setRows] = useState<ConsultantData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Tooltip title="View">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/cst-view?consultantId=${params.row.id}&view=true`);
              }}
            >
              <VisibilityIcon color="primary" />
            </IconButton>
          </Tooltip>

          {activeOption !== "Pending Consultant" && (
            <Tooltip title="Edit">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/cst-view?consultantId=${params.row.id}`);
                }}
              >
                <EditIcon color="action" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ),
    },
    { field: "consultantName", headerName: "Consultant Name", width: 200 },
    { field: "employeeStatus", headerName: "Employee Status", width: 150 },
    { field: "typeOfPlacement", headerName: "Type of Placement", width: 180 },
    { field: "clientName", headerName: "Client Name", width: 200 },
    { field: "payRate", headerName: "Pay Rate", width: 160 },
    { field: "billRate", headerName: "Bill Rate", width: 160 },
    { field: "dateOfJoining", headerName: "Date of Joining", width: 160 },
    { field: "dateOfExit", headerName: "Date of Exit", width: 160 },
    { field: "jobTitle", headerName: "Job Title", width: 200 },
    { field: "createdBy", headerName: "Created By", width: 160 },
  ];

  const fetchConsultantData = async (status: string) => {
    console.log("Hii1234");
    setRows([]); // Clear old rows immediately
    setLoading(true);
    try {
      let apiUrl = "";

      if (status === "active") {
        apiUrl = "consultant-data/active";
      } else if (status === "onboarding") {
        apiUrl = "consultant-data/onboarding";
      } else if (status === "past") {
        apiUrl = "consultant-data/past";
      } else if (status === "others") {
        apiUrl = "consultant-data/others";
      } else if (status === "pending") {
        apiUrl = "consultant-data/pending";
      } else if (status === "rejected") {
        apiUrl = "consultant-data/rejected";
      }

      const data: ConsultantData[] = await ApiClient.get(apiUrl);

      //const data: ConsultantData[] = await response.json();
      if (mapOptionToStatus(activeOption) === "onboarding") {
        if (Array.isArray(data)) {
          const now = Date.now();

          const parseISO = (v: unknown): number | null => {
            if (!v || typeof v !== "string") return null;
            const t = Date.parse(v);
            return Number.isNaN(t) ? null : t;
          };

          data.forEach((row: any) => {
            const joinDate =
              row.cDateofJoining && row.cDateofJoining !== "null"
                ? parseISO(row.cDateofJoining)
                : parseISO(row.dTentativeJoiningDate);

            row._joinDate = joinDate;
          });

          data.sort((a: any, b: any) => {
            if (!a._joinDate && !b._joinDate) return 0;
            if (!a._joinDate) return 1;
            if (!b._joinDate) return -1;
            return Math.abs(a._joinDate - now) - Math.abs(b._joinDate - now);
          });
          data.forEach((row: any) => delete row._joinDate);
        }
      } else {
        if (Array.isArray(data)) {
          const parseISO = (v: unknown): number | null => {
            if (!v || typeof v !== "string") return null;
            const t = Date.parse(v);
            return Number.isNaN(t) ? null : t;
          };

          data.forEach((row: any) => {
            const createdDate = parseISO(row.dCreatedDate);
            row._createdDate = createdDate;
          });

          data.sort((a: any, b: any) => {
            if (!a._createdDate && !b._createdDate) return 0;
            if (!a._createdDate) return 1;
            if (!b._createdDate) return -1;
            return b._createdDate - a._createdDate;
          });

          data.forEach((row: any) => delete row._createdDate);
        }
      }

      console.log("Fetched data:", data);

      const mappedRows = data.map((consultant: any, index: number) => ({
        id: consultant.iEmployeeId,
        consultantName: consultant.cEmployeeName || "-",
        employeeStatus: consultant.cEmployeeStatus || "-",
        typeOfPlacement: consultant.cPlacementType || "-", // Assuming API provides this : changed to the one which is providing
        clientName: consultant.cClientName || "-",
        payRate: `${consultant.iPayRate ? consultant.iPayRate : "-"} ${
          consultant.cPayRateCurrenyType ? consultant.cPayRateCurrenyType : "-"
        }`,
        billRate: `${consultant.iBillRate ? consultant.iBillRate : "-"} ${
          consultant.cBillRateCurrenyType
            ? consultant.cBillRateCurrenyType
            : "-"
        }`,
        dateOfJoining: consultant.cDateofJoining
          ? dayjs(consultant.cDateofJoining).format("DD-MM-YYYY")
          : "-",
        dateOfExit: consultant.cDateofTermination
          ? dayjs(consultant.cDateofTermination).format("DD-MM-YYYY")
          : "-", // Assuming API provides this : changed to the one which is providing
        jobTitle: consultant.cJobTitle || "-", // Assuming API provides this : changed to the one which is providing
        createdBy: consultant.cCreatedBy || "-", // Assuming API provides this : changed to the one which is providing   //icreatedBy is id and cCreatedBy is name
      }));

      setRows(mappedRows);
    } catch (error) {
      console.error("Error fetching consultant data:", error);
      setRows([]); // Set empty rows in case of error
    } finally {
      setLoading(false);
    }
  };

  const mapOptionToStatus = (option: ConsultantOptionType) => {
    switch (option) {
      case "Active Consultant":
        return "active";
      case "OnBoarding Consultant":
        return "onboarding";
      case "Past Consultant":
        return "past";
      case "Others Consultant":
        return "others";
      case "Pending Consultant":
        return "pending";
      case "Rejected Consultant":
        return "rejected";
      default:
        return "";
    }
  };

  useEffect(() => {
    const status = mapOptionToStatus(activeOption);
    if (status) {
      console.log("Fetching data for:", status);
      //setRows(null);
      setLoading(true);
      fetchConsultantData(status);
    }
  }, [activeOption]);

  return (
    <div className="w-full p-2">
      <div className="bg-white border rounded-lg shadow p-2">
        <div className="flex gap-4 truncate px-4 pb-6">
          {consultantOptions.map((consultantOption) => (
            <div
              key={consultantOption}
              onClick={() =>
                setActiveOption(consultantOption as ConsultantOptionType)
              }
              className={`
  cursor-pointer
  px-4 py-2
  rounded-full
  text-sm md:text-base
  font-semibold
  transition-all duration-200
  ${
    activeOption === consultantOption
      ? "bg-pink-800 text-white shadow border border-pink-800"
      : "border-solid border-pink-800 text-gray-700 hover:bg-pink-50"
  }
`}
            >
              {consultantOption}
            </div>
          ))}
        </div>
        {!loading && (
          <div className="px-4">
            <Paper style={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                onRowClick={(params) => {
                  if (activeOption === "Pending Consultant") {
                    navigate(
                      `/cst-view?consultantId=${params.row.id}&view=true`
                    );
                  } else {
                    navigate(
                      `/cst-view?consultantId=${params.row.id}&view=true`
                    );
                  }
                }}
                getRowId={(row) => row.id}
                sx={{
                  display: "grid",
                  gridTemplateRows: "auto 1fr auto",
                }}
              />
            </Paper>
          </div>
        )}
        {loading && <Loader size={56} />}
      </div>
    </div>
  );
};
