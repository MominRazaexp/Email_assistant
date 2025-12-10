import React from "react";

const formatTime = (t) => {
  if (!t) return "";
  const date = new Date(t);
  return date.toLocaleTimeString();
};

const AgentTimelineViewer = ({ steps }) => {
  if (!steps || steps.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
        Agent steps will appear here after you generate a reply.
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        Agent Timeline
      </h2>
      <ol className="relative border-l border-gray-200 ml-2">
        {steps.map((step, index) => (
          <li className="mb-4 ml-4" key={index}>
            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
            <time className="mb-1 text-xs font-normal leading-none text-gray-400">
              {formatTime(step.timestamp)}
            </time>
            <h3 className="text-sm font-semibold text-gray-900">
              {step.node}
            </h3>
            <p className="text-xs text-gray-600">
              {step.output && typeof step.output === "object"
                ? "Output keys: " + Object.keys(step.output).join(", ")
                : ""}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default AgentTimelineViewer;