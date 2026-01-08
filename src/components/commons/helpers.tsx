import ApiClient from "../../services/ApiClient";

export const fetchVariteId = async (
  employeeId: string,
  setVariteId: Function
) => {
  const url = `view-client-info/view?consultantId=${employeeId}&consultantType=0&history=0`;
  const data = await ApiClient.get(url);

  setVariteId(data?.result?.[0]?.[0]?.iVariteEmployeeId || "");
};

export const taskViewer = (taskType: string, variteId: string) => {
  if (!taskType || !variteId) return;
  const baseUrl = "https://varite.sharepoint.com/usa/USOnboarding/Lists/";
  let url = "";
  switch (taskType.toLowerCase()) {
    case "offboarding":
      url = `${baseUrl}Offboarding%20Tasks/AllItems.aspx?FilterField1=FID&FilterValue1=${variteId}`;
      break;

    case "finance":
      url = `${baseUrl}Finance%20Tasks/AllItems.aspx?FilterField1=FID&FilterValue1=${variteId}`;
      break;

    case "onboarding":
      url = `${baseUrl}Candidate%20Status%20Tasks/AllItems.aspx?FilterField1=FID&FilterValue1=${variteId}`;
      break;

    default:
      console.warn("Unknown task type:", taskType);
      return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
};
