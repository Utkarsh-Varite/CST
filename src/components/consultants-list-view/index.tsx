// const varite = require("../../assets/image.png");
import * as React from "react";
import { DefaultButton } from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import type { StandaloneContext } from "../CandidateStatusTracker";
import { ConsultantTable } from "./consultant-table";
import { HomeFilled } from "@fluentui/react-icons";

interface IMyPaginatedGridProps {
  context: StandaloneContext;
}

export const ConsultantListView: React.FC<IMyPaginatedGridProps> = ({
  context,
}) => {
  console.log(context);
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/cst-view");
  };
  console.log("new version");
  React.useEffect(() => {
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

  React.useEffect(() => {
    const scrollableDiv = document.querySelector('[data-is-scrollable="true"]');
    if (scrollableDiv) {
      scrollableDiv.classList.remove(
        "m_b_beed2cf1",
        "l_b_beed2cf1",
        "o_b_beed2cf1",
        "p_b_beed2cf1",
        "flex" // ✅ Remove "flex" as well
      ); // Remove only specific SharePoint classes
    }
  }, []);

  React.useEffect(() => {
    const el = document.querySelector(".j_b_cb6f7c2e") as HTMLElement | null;
    if (el) {
      el.style.maxWidth = "none";
    }
  }, []);

  return (
    <section className="w-full max-w-full">
      {/* Header */}
      {/* <div className="flex flex-wrap justify-between items-center px-4 pt-4"> */}
      {/* Commented out image */}
      {/* <img src={varite} alt="Varite" className="h-10 w-32" /> */}

      {/* <div className="flex-1 flex justify-center">
          <div className="bg-pink-800 text-white font-bold px-4 py-2 rounded-md">
            Candidate Status Tracker
          </div>
        </div> */}

      <div className="grid grid-cols-3 p-4">
        <div className="mr-4 items-center justify-start flex">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="p-2 rounded border-0 bg-transparent hover:bg-pink-100"
            title="Go to Home"
          >
            <HomeFilled className="w-6 h-6 text-pink-800" />
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold font-sans text-pink-800 px-4">
            Candidate Status Tracker
          </h1>
        </div>

        <div className="justify-end flex items-center text-center">
          <DefaultButton
            text="Create New"
            iconProps={{ iconName: "Add" }}
            className="rounded-md cursor-pointer"
            styles={{
              root: {
                backgroundColor: "#fff",
                color: "#4a4a4a",
                border: "solid",
                borderColor: "#AD1457",
                padding: "8px 16px",
              },
              rootHovered: {
                backgroundColor: "#fff",
              },
            }}
            onClick={handleCreate}
          />
        </div>
      </div>

      {/* Create Button */}
      {/* <DefaultButton
          text="Create New"
          iconProps={{ iconName: "Add" }}
          className="rounded-md cursor-pointer"
          styles={{
            root: {
              backgroundColor: "#4a4a4a",
              color: "white",
              border: "none",
              padding: "8px 16px",
            },
            rootHovered: {
              backgroundColor: "#6a6a6a",
            },
          }}
          onClick={handleCreate}
        /> */}
      {/* </div> */}

      <ConsultantTable />
    </section>
  );
};
