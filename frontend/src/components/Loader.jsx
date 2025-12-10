import React from "react";

const Loader = ({ text }) => {
  const label = text && text.length > 0 ? text : "Processing...";
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span>{label}</span>
    </div>
  );
};

export default Loader;