import { ErrorMessage, useFormikContext } from "formik";
import React, { useEffect } from "react";
import { genderDropDownOptions, workLocationDropDownOptions } from "./utils";
import { Label, TextField, Dropdown } from "@fluentui/react";
import type { IDropdownOption } from "@fluentui/react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import MyDropzone from "../../../commons/dropZone";
import { NumberFormatter } from "../../../helpers/helpers";
// import ApiClient from "../../../../../../services/ApiClient";
// import { set } from "@microsoft/sp-lodash-subset";
import { fetchVariteId } from "../../../commons/helpers";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PublicOffOutlinedIcon from "@mui/icons-material/PublicOffOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import MarkunreadMailboxOutlinedIcon from "@mui/icons-material/MarkunreadMailboxOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import Loader from "../../../commons/loader";

export const CandidateDetails = ({
  isViewMode,

  countries,
  setCountries,
  states,
  setStates,
  cities,
  setCities,
  fetchStates,
  fetchCities,

  homeCountries,
  setHomeCountries,
  homeStates,
  setHomeStates,
  homeCities,
  setHomeCities,
  fetchHomeStates,
  fetchHomeCities,
}: {
  isViewMode: boolean;

  countries: IDropdownOption[];
  setCountries: React.Dispatch<React.SetStateAction<IDropdownOption[]>>;
  states: IDropdownOption[];
  setStates: React.Dispatch<React.SetStateAction<IDropdownOption[]>>;
  cities: IDropdownOption[];
  setCities: React.Dispatch<React.SetStateAction<IDropdownOption[]>>;
  fetchStates: (countryId: number) => Promise<void>;
  fetchCities: (countryId: number, stateId: number) => Promise<void>;

  homeCountries: IDropdownOption[];
  setHomeCountries: React.Dispatch<React.SetStateAction<IDropdownOption[]>>;
  homeStates: IDropdownOption[];
  setHomeStates: React.Dispatch<React.SetStateAction<IDropdownOption[]>>;
  homeCities: IDropdownOption[];
  setHomeCities: React.Dispatch<React.SetStateAction<IDropdownOption[]>>;
  fetchHomeStates: (countryId: number) => Promise<void>;
  fetchHomeCities: (countryId: number, stateId: number) => Promise<void>;
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
  const [variteId, setVariteId] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formattedPhoneNumber, setFormattedPhoneNumber] =
    React.useState<string>("");
  console.log("CandidateDetails component rendered 123");
  const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();
  const handleDelete = (indexToDelete: number) => {
    const updatedFiles = values.fileAttachment.filter(
      (_: any, i: number) => i !== indexToDelete
    );
    setFieldValue("fileAttachment", updatedFiles);
  };

  const handleView = (file: any) => {
    if (!file?.ServerRelativePath) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    }
    if (file?.ServerRelativePath) {
      const fileLink = `https://varite.sharepoint.com${file?.ServerRelativePath?.DecodedUrl}`;
      window.open(fileLink, "_blank");
    }
  };

  // const fetchVariteId = async (employeeId: string) => {
  //   const url = `https://varfunctiontypescriptcst.azurewebsites.net/api/view-client-info/view?consultantId=${employeeId}&consultantType=0&history=0`;
  //   const response = await fetch(url);
  //   const data = await response.json();
  //   setVariteId(data?.result?.[0]?.[0]?.iVariteEmployeeId || "");
  //   if (!response.ok) {
  //     console.error("Error fetching:", response.status, await response.text());
  //     return;
  //   }
  // };

  // const fetchVariteId = async (employeeId: string) => {
  //   const url = `view-client-info/view?consultantId=${employeeId}&consultantType=0&history=0`;

  //   // ⬇️ Replaced fetch() + .json() with ApiClient.get()
  //   const data = await ApiClient.get(url);

  //   setVariteId(data?.result?.[0]?.[0]?.iVariteEmployeeId || "");
  // };

  useEffect(() => {
    fetchVariteId(values?.employeeId, setVariteId);
  }, []);
  useEffect(() => {
    fetchFiles();
  }, [variteId]);

  const fetchFiles = async () => {
    setLoading(true);
    const baseUrl = `https://varite.sharepoint.com/usa/USOnboarding/_api/web/lists/getbytitle('Candidate%20Status%20Tracker')/items(${variteId})/AttachmentFiles`;

    const response = await fetch(baseUrl, {
      headers: {
        Accept: "application/json;odata=verbose",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Error fetching:", response.status, await response.text());
      setLoading(false);
      return;
    }

    const data = await response.json();
    setFieldValue("fileAttachment", data?.d?.results || []);
    setLoading(false);
  };

  const uploadFiles = async (files: File[]) => {
    if (!files?.length) return;
    const digestResponse = await fetch(
      "https://varite.sharepoint.com/usa/USOnboarding/_api/contextinfo",
      {
        method: "POST",
        headers: { Accept: "application/json;odata=verbose" },
        credentials: "include",
      }
    );
    const digestValue = (await digestResponse.json()).d.GetContextWebInformation
      .FormDigestValue;
    setLoading(true);
    for (const file of files) {
      const fileName = file.name.replace(/'/g, "''");
      const uploadUrl =
        `https://varite.sharepoint.com/usa/USOnboarding/_api/` +
        `web/lists/getbytitle('Candidate%20Status%20Tracker')/items(${variteId})/` +
        `AttachmentFiles/add(FileName='${fileName}')`;

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Accept: "application/json;odata=verbose",
          "X-RequestDigest": digestValue,
          "Content-Type": "application/octet-stream",
        },
        body: file,
        credentials: "include",
      });

      if (!res.ok) {
        setLoading(false);
        setFieldValue("fileAttachment", [], false);
        console.error(`❌ Failed ${file.name}:`, res.status, await res.text());
      } else {
        const data = await res.json();
        console.log(`✅ Uploaded ${file.name}:`, data.d.ServerRelativeUrl);
        setLoading(false);
        setFieldValue("fileAttachment", [], false);
        fetchFiles();
      }
    }
  };

  async function deleteAttachment({ fileName }: { fileName: string }) {
    setLoading(true);
    const web = "https://varite.sharepoint.com/usa/USOnboarding";
    const listTitle = "Candidate%20Status%20Tracker";
    const itemId = variteId;
    const digestRes = await fetch(`${web}/_api/contextinfo`, {
      method: "POST",
      headers: { Accept: "application/json;odata=verbose" },
      credentials: "include",
    });
    const digest = (await digestRes.json()).d.GetContextWebInformation
      .FormDigestValue;
    const safeName = fileName?.replace(/'/g, "''");
    const url =
      `${web}/_api/web/lists/getbytitle('${listTitle}')/items(${itemId})/` +
      `AttachmentFiles/getByFileName(fileName='${safeName}')`;

    await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "X-RequestDigest": digest,
        "IF-MATCH": "*",
        "X-HTTP-Method": "DELETE",
      },
      credentials: "include",
    });

    // if (!res.ok) {
    //   setLoading(false);
    //   const t = await res.text();
    //   throw new Error(`Delete failed (${res.status}): ${t}`);
    // }
    setLoading(false);
    fetchFiles();
    return true;
  }

  useEffect(() => {
    if (values?.phoneNumber.length >= 10) {
      NumberFormatter(
        values?.phoneNumber,
        values?.homeAddressCountry,
        setFormattedPhoneNumber
      );
    }
  }, [values?.phoneNumber, values?.homeAddressCountry]);

  useEffect(() => {
    if (formattedPhoneNumber) {
      setFieldValue("phoneNumber", formattedPhoneNumber, false);
    }
  }, [formattedPhoneNumber]);

  return (
    <section>
      <div className="bg-gray-200 p-2">
        <div>
          <div className="px-4 py-6 bg-white">
            <div>
              <div className="grid grid-cols-2 gap-3">
                {/* Consultant First Name */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <PersonOutlineOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="consultant-first-name-tooltip"
                    />{" "} */}
                    Consultant First Name
                  </Label>

                  <ReactTooltip
                    id="consultant-first-name-tooltip"
                    place="top"
                    content="Please enter the first name of the candidate"
                  />
                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.consultantFirstName || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.consultantFirstName || ""}
                        placeholder="Enter Consultant First Name"
                        onChange={(e, value) => {
                          setFieldValue(
                            "consultantFirstName",
                            value || "",
                            true
                          );
                        }}
                        onBlur={() =>
                          setFieldTouched("consultantFirstName", true, true)
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="consultantFirstName"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Consultant Middle Name */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <PersonOutlineOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="consultant-middle-name-tooltip"
                    />{" "} */}
                    Consultant Middle Name
                  </Label>

                  <ReactTooltip
                    id="consultant-middle-name-tooltip"
                    place="top"
                    content="Please enter the middle name of the candidate"
                  />
                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.consultantMiddleName || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.consultantMiddleName || ""}
                        placeholder="Enter Consultant Middle Name"
                        onChange={(e, value) => {
                          setFieldValue(
                            "consultantMiddleName",
                            value || "",
                            true
                          ); // validate now
                        }}
                        onBlur={() =>
                          setFieldTouched("consultantMiddleName", true, true)
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="consultantMiddleName"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Consultant Last Name */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <PersonOutlineOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="consultant-last-name-tooltip"
                    />{" "} */}
                    Consultant Last Name
                  </Label>

                  <ReactTooltip
                    id="consultant-last-name-tooltip"
                    place="top"
                    content="Please enter the last name of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.consultantLastName || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.consultantLastName || ""}
                        placeholder="Enter Consultant Last Name"
                        onChange={(e, value) => {
                          setFieldValue(
                            "consultantLastName",
                            value || "",
                            true
                          ); // validate now
                        }}
                        onBlur={() =>
                          setFieldTouched("consultantLastName", true, true)
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="consultantLastName"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Suffix */}
                <div className="w-full">
                  <Label className="flex gap-1 items-center">
                    <BadgeOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="suffix-tooltip"
                    />{" "} */}
                    Suffix
                  </Label>

                  <ReactTooltip
                    id="suffix-tooltip"
                    place="top"
                    content="Please enter suffix like Mr,Mrs,Ms,Sr,Jr,etc"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.suffix || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.suffix || ""}
                        placeholder="Enter Suffix"
                        onChange={(e, value) => {
                          setFieldValue("suffix", value || "", true); // validate now
                        }}
                        onBlur={() => setFieldTouched("suffix", true, true)}
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="suffix"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Consultant Full Name */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <PersonOutlineOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="consultant-full-name-tooltip"
                    />{" "} */}
                    Consultant Full Name
                  </Label>

                  <ReactTooltip
                    id="consultant-full-name-tooltip"
                    place="top"
                    content="Full name will be entered automatically on adding suffix, first, last and middle name"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.consultantFullName || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.consultantFullName}
                        placeholder="Enter Consultant Full Name"
                        onChange={(e, value) => {
                          setFieldValue(
                            "consultantFullName",
                            value || "",
                            true
                          ); // validate now
                        }}
                        onBlur={() =>
                          setFieldTouched("consultantFullName", true, true)
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="consultantFullName"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Consultant Gender */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <WcOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="consultant-gender-tooltip"
                    />{" "} */}
                    Consultant Gender
                  </Label>

                  <ReactTooltip
                    id="consultant-gender-tooltip"
                    place="top"
                    content="Please select the gender of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.consultantGender || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.consultantGender || ""}
                        placeholder="Select Consultant Gender"
                        options={genderDropDownOptions}
                        onChange={(e, option) => {
                          setFieldValue(
                            "consultantGender",
                            option?.key ?? "",
                            true
                          ); // validate immediately
                          setFieldTouched("consultantGender", true, false);
                        }}
                        onBlur={() =>
                          setFieldTouched("consultantGender", true, true)
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />
                      <ErrorMessage
                        name="consultantGender"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Home Address Street */}
                <div className="w-full ">
                  <Label required={true} className="flex gap-1 items-center">
                    <HomeOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="home-address-street-tooltip"
                    />{" "} */}
                    Home Address Street
                  </Label>

                  <ReactTooltip
                    id="home-address-street-tooltip"
                    place="top"
                    content="Please enter the street address of the candidate's home"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.homeAddressStreet || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.homeAddressStreet || ""}
                        placeholder="Enter Home Address Street"
                        onChange={(e, value) => {
                          setFieldValue("homeAddressStreet", value || "", true); // validate now
                        }}
                        onBlur={() =>
                          setFieldTouched("homeAddressStreet", true, true)
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="homeAddressStreet"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* // Home Address Country */}

                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <PublicOffOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="home-address-country-tooltip"
                    />{" "} */}
                    Home Address Country
                  </Label>

                  <ReactTooltip
                    id="home-address-country-tooltip"
                    place="top"
                    content="Please select the country of the candidate's home address"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {homeCountries.find(
                        (opt) => opt.key === values.homeAddressCountry
                      )?.text || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        placeholder="Select Home Address Country"
                        options={homeCountries}
                        selectedKey={values.homeAddressCountry || ""}
                        onChange={(e, option) => {
                          setFieldValue(
                            "homeAddressCountry",
                            option?.key ?? "",
                            true
                          );
                          setFieldTouched("homeAddressCountry", true, false);
                          setFieldValue("homeAddressStateOrProvince", "", true);
                          setFieldTouched(
                            "homeAddressStateOrProvince",
                            true,
                            false
                          );

                          setFieldValue("homeAddressCity", "", true);
                          setFieldTouched("homeAddressCity", true, false);

                          setHomeStates([]);
                          setHomeCities([]);

                          if (option?.key) fetchHomeStates(Number(option.key));
                        }}
                        onBlur={() =>
                          setFieldTouched("homeAddressCountry", true, true)
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />

                      <ErrorMessage
                        name="homeAddressCountry"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Home Address State Or Province */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <LocationCityOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="home-address-state-tooltip"
                    />{" "} */}
                    Home Address State Or Province
                  </Label>

                  <ReactTooltip
                    id="home-address-state-tooltip"
                    place="top"
                    content="Please select the state or province of the candidate's home address"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {homeStates.find(
                        (opt) => opt.key === values.homeAddressStateOrProvince
                      )?.text || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.homeAddressStateOrProvince || ""}
                        placeholder="Select Home Address State"
                        options={homeStates}
                        onChange={(e, option) => {
                          // set state + validate immediately
                          setFieldValue(
                            "homeAddressStateOrProvince",
                            option?.key ?? "",
                            true
                          );
                          setFieldTouched(
                            "homeAddressStateOrProvince",
                            true,
                            false
                          );

                          // clear dependent city + validate it too
                          setFieldValue("homeAddressCity", "", true);
                          setFieldTouched("homeAddressCity", true, false);

                          setHomeCities([]);

                          // fetch cities if we have both country & state
                          const countryId = Number(values.homeAddressCountry);
                          const stateId = Number(option?.key);
                          if (
                            !Number.isNaN(countryId) &&
                            !Number.isNaN(stateId)
                          ) {
                            fetchHomeCities(countryId, stateId);
                          }
                        }}
                        onBlur={() =>
                          setFieldTouched(
                            "homeAddressStateOrProvince",
                            true,
                            true
                          )
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />

                      <ErrorMessage
                        name="homeAddressStateOrProvince"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>
                {/* Home Address City */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <ApartmentOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="home-address-city-tooltip"
                    />{" "} */}
                    Home Address City
                  </Label>

                  <ReactTooltip
                    id="home-address-city-tooltip"
                    place="top"
                    content="Please enter the city of the candidate's home address"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {homeCities.find(
                        (opt) => opt.key === values.homeAddressCity
                      )?.text || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        placeholder="Select Home Address City"
                        options={homeCities}
                        selectedKey={values.homeAddressCity || ""}
                        onChange={(e, option) => {
                          setFieldValue(
                            "homeAddressCity",
                            option?.key ?? "",
                            true
                          );
                          setFieldTouched("homeAddressCity", true, false);
                        }}
                        onBlur={() =>
                          setFieldTouched("homeAddressCity", true, true)
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />

                      <ErrorMessage
                        name="homeAddressCity"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Home Address Postal Code */}
                <div className="w-full mb-5">
                  <Label required={true} className="flex gap-1 items-center">
                    <MarkunreadMailboxOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="home-address-postal-code-tooltip"
                    />{" "} */}
                    Home Address Postal Code
                  </Label>

                  <ReactTooltip
                    id="home-address-postal-code-tooltip"
                    place="top"
                    content="Please enter the postal code of the candidate's home address"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.homeAddressPostalCode || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.homeAddressPostalCode || ""}
                        placeholder="Enter Home Address Postal Code"
                        onChange={(e, value) => {
                          setFieldValue(
                            "homeAddressPostalCode",
                            value || "",
                            true
                          ); // validate now
                        }}
                        onBlur={() =>
                          setFieldTouched("homeAddressPostalCode", true, true)
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="homeAddressPostalCode"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>
                <div />
                {/* /////////////////////////////////////// */}

                {/*work country */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <PublicOffOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="work-country-tooltip"
                    />{" "} */}
                    Work Country
                  </Label>

                  <ReactTooltip
                    id="work-country-tooltip"
                    place="top"
                    content="Please select the candidate's work country"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {countries.find((opt) => opt.key === values.workCountry)
                        ?.text || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        placeholder="Select Work Country"
                        options={countries}
                        selectedKey={values.workCountry || ""}
                        onChange={(e, option) => {
                          // set country + validate immediately
                          setFieldValue("workCountry", option?.key ?? "", true);
                          setFieldTouched("workCountry", true, false);

                          // clear dependents + validate them too
                          setFieldValue("workState", "", true);
                          setFieldTouched("workState", true, false);

                          setFieldValue("workCity", "", true);
                          setFieldTouched("workCity", true, false);

                          setStates([]);
                          setCities([]);

                          if (option?.key) {
                            const countryId = Number(option.key);
                            if (!Number.isNaN(countryId))
                              fetchStates(countryId);
                          }
                        }}
                        onBlur={() =>
                          setFieldTouched("workCountry", true, true)
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />

                      <ErrorMessage
                        name="workCountry"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Work State */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <LocationCityOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="work-state-tooltip"
                    />{" "} */}
                    Work State
                  </Label>

                  <ReactTooltip
                    id="work-state-tooltip"
                    place="top"
                    content="Please select the candidate's work state or province"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {states.find((opt) => opt.key === values.workState)
                        ?.text || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.workState || ""}
                        placeholder="Select Work State"
                        options={states}
                        onChange={(e, option) => {
                          // set state + validate immediately
                          setFieldValue("workState", option?.key ?? "", true);
                          setFieldTouched("workState", true, false);

                          // clear dependent city + validate it too
                          setFieldValue("workCity", "", true);
                          setFieldTouched("workCity", true, false);

                          setCities([]);

                          // fetch cities if both country & state are valid numbers
                          const countryId = Number(values.workCountry);
                          const stateId = Number(option?.key);
                          if (
                            !Number.isNaN(countryId) &&
                            !Number.isNaN(stateId)
                          ) {
                            fetchCities(countryId, stateId);
                          }
                        }}
                        onBlur={() => setFieldTouched("workState", true, true)}
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />

                      <ErrorMessage
                        name="workState"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Work City */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <ApartmentOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="work-city-tooltip"
                    />{" "} */}
                    Work City
                  </Label>

                  <ReactTooltip
                    id="work-city-tooltip"
                    place="top"
                    content="Please enter the candidate's work city"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {cities.find((opt) => opt.key === values.workCity)
                        ?.text || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        placeholder="Select Work City"
                        options={cities}
                        selectedKey={values.workCity || ""}
                        onChange={(e, option) => {
                          // set city + validate immediately
                          setFieldValue("workCity", option?.key ?? "", true);
                          setFieldTouched("workCity", true, false);
                        }}
                        onBlur={() => setFieldTouched("workCity", true, true)}
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />

                      <ErrorMessage
                        name="workCity"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Work Location */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <BusinessOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="work-location-tooltip"
                    />{" "} */}
                    Work Location
                  </Label>

                  <ReactTooltip
                    id="work-location-tooltip"
                    place="top"
                    content="Please enter the candidate's work location"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.workLocation || "-"}
                    </div>
                  ) : (
                    <>
                      <Dropdown
                        selectedKey={values.workLocation || ""}
                        placeholder="Select Work Location"
                        options={workLocationDropDownOptions}
                        onChange={(e, option) => {
                          // set work location + validate immediately
                          setFieldValue(
                            "workLocation",
                            option?.key ?? "",
                            true
                          );
                          setFieldTouched("workLocation", true, false);
                        }}
                        onBlur={() =>
                          setFieldTouched("workLocation", true, true)
                        }
                        styles={{ dropdown: { border: "2px solid #d1d5db" } }}
                      />

                      <ErrorMessage
                        name="workLocation"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Phone Number */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <PhoneOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="phone-number-tooltip"
                    />{" "} */}
                    Phone Number
                  </Label>

                  <ReactTooltip
                    id="phone-number-tooltip"
                    place="top"
                    content="Please enter the phone number of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.phoneNumber || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.phoneNumber || ""}
                        placeholder={
                          values.homeAddressCountry === 1
                            ? "(XXX)XXX-XXXX" // Canada
                            : values.homeAddressCountry === 3
                            ? "(XXX)XXX-XXXX" // USA
                            : values.homeAddressCountry === 2
                            ? "+44 XXXX XXXXXX" // UK
                            : "Enter phone number"
                        }
                        onChange={(e, value) => {
                          setFieldValue("phoneNumber", value || "", true); // validate now
                        }}
                        onBlur={() =>
                          setFieldTouched("phoneNumber", true, true)
                        }
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* E-Mail */}
                <div className="w-full">
                  <Label required={true} className="flex gap-1 items-center">
                    <EmailOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Globe"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="email-tooltip"
                    />{" "} */}
                    E-Mail
                  </Label>

                  <ReactTooltip
                    id="email-tooltip"
                    place="top"
                    content="Please enter the email address of the candidate"
                  />

                  {isViewMode ? (
                    <div className="py-2 px-3 border border-gray-300 rounded bg-gray-100 text-gray-700">
                      {values.email || "-"}
                    </div>
                  ) : (
                    <>
                      <TextField
                        value={values.email || ""}
                        placeholder="Enter E-Mail"
                        onChange={(e, value) => {
                          setFieldValue("email", value || "", true); // validate now
                        }}
                        onBlur={() => setFieldTouched("email", true, true)}
                        styles={{
                          fieldGroup: { border: "2px solid #d1d5db" },
                        }}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500"
                      />
                    </>
                  )}
                </div>

                {/* Attachments Section */}
                <div>
                  <Label className="flex gap-1 items-center">
                    <AttachFileOutlinedIcon />{" "}
                    {/* <Icon
                      iconName="Attach"
                      className="mr-1 font-bold text-xs"
                      data-tooltip-id="work-location-tooltip"
                    />{" "} */}
                    Attachments
                  </Label>
                  <>
                    {
                      loading && <Loader />
                      // (
                      //   <div className="inline-block rounded bg-gray-100 px-3 py-1 text-sm text-gray-700">
                      //     Loading...
                      //   </div>
                      // )
                    }
                    {values.fileAttachment.length > 0 && (
                      <div className="mb-2">
                        {values.fileAttachment[0].name ? (
                          <span>Changed/Added file details</span>
                        ) : null}
                        {values.fileAttachment.map(
                          (file: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2  border border-gray-300 p-1 rounded"
                            >
                              <div className="justify-between w-full flex">
                                <span
                                  className="flex items-center gap-1 text-sm font-medium text-gray-800 truncate max-w-[250px]"
                                  title={file.name || file?.FileName}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-blue-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 7h10M7 11h10M7 15h10M5 19h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  {file.name || file?.FileName}
                                </span>
                                <div
                                  className={
                                    file?.name
                                      ? "grid grid-cols-1 items-center justify-center gap-2"
                                      : "gap-2 flex"
                                  }
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleView(file)}
                                    className={
                                      file.name
                                        ? "ml-3 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
                                        : "px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
                                    }
                                  >
                                    View
                                  </button>

                                  {isViewMode === false &&
                                    ((file?.FileName && loading !== true) ||
                                      (file.name ===
                                        values.fileAttachment[
                                          values.fileAttachment.length - 1
                                        ]?.name &&
                                        loading !== true)) && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          deleteAttachment({
                                            fileName: file.FileName,
                                          });
                                          handleDelete(index);
                                        }}
                                        className={
                                          file.name
                                            ? "px-3 py-1.5 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-200 mt-2"
                                            : "px-3 py-1.5 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-200"
                                        }
                                      >
                                        {file.name ? "Cancel" : "Delete"}
                                      </button>
                                    )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </>
                  {!values.employeeId || isViewMode === true ? (
                    <div>
                      Adding File Attachments is not available at this stage.
                    </div>
                  ) : (
                    <div className=" ">
                      <MyDropzone consultantId={values?.consultantId} />
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => uploadFiles(values.fileAttachment)}
                          disabled={
                            values.fileAttachment[0]?.name && loading !== true
                              ? false
                              : true
                          }
                        >
                          Upload Attachments
                        </button>
                      </div>
                    </div>
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
