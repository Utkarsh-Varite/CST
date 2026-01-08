import React from "react";

type LoaderProps = {
  size?: number; // px
  label?: string;
  className?: string;
};

const Loader: React.FC<LoaderProps> = ({
  size = 40,
  label = "",
  className = "",
}) => {
  return (
    <div
      className={`flex items-center text-center justify-center gap-3 ${className}`}
    >
      <div className="justify-center items-center text-center">
        <div
          className="flex justify-center mb-2 items-center w-full"
          style={{ height: size, width: size }}
        >
          <Spinner />
        </div>

        <div className="text-center w-full">
          {label ? (
            <span className="text-sm text-gray-700">{label}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Loader;

const Spinner = () => (
  <svg className="h-10 w-10 animate-spin text-pink-800" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);
