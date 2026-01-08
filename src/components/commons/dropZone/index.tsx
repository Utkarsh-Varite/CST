import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFormikContext } from "formik";

function MyDropzone({ consultantId }: { consultantId: string }) {
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log("Consultant ID:", consultantId);
    console.log("Dropped files:", acceptedFiles);
    const updatedFiles = [...(values.fileAttachment || []), ...acceptedFiles];
    setFieldValue("fileAttachment", updatedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
  });

  const { values, setFieldValue } = useFormikContext<any>();

  return (
    <div
      {...getRootProps()}
      className={`flex  items-center justify-center w-[50%]  border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ease-in-out
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
    >
      <input {...getInputProps()} />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-12 w-12 mb-3 ${
          isDragActive ? "text-blue-500" : "text-gray-400"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 16V4m0 0L3 8m4-4l4 4M13 8h8m-8 4h8m-8 4h8m-8 4h8"
        />
      </svg>

      {isDragActive ? (
        <p className="text-blue-500 font-medium">Drop the files here ...</p>
      ) : (
        <div className="text-center">
          <p className="text-gray-700 font-medium">
            Drag & drop files here, or{" "}
            <span className="text-blue-600 underline">browse</span>
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Supports images, PDFs and more
          </p>
        </div>
      )}
    </div>
  );
}

export default MyDropzone;
