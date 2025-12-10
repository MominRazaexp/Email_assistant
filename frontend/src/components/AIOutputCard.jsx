import React from "react";

const AIOutputCard = ({ reply }) => {
  if (!reply || reply.trim().length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
        The AI reply will appear here after processing.
      </div>
    );
  }

  const paragraphs = reply.split("\n");

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">
        AI Generated Reply
      </h2>
      <div className="text-sm text-gray-800 whitespace-pre-wrap">
        {paragraphs.map((p, idx) => {
          if (!p || p.trim().length === 0) {
            return <span key={idx}>&nbsp;</span>;
          }
          return <p key={idx}>{p}</p>;
        })}
      </div>
    </div>
  );
};

export default AIOutputCard;