import React, { useState } from "react";
import { fetchMonitoringGraph } from "../utils/api.js";
import Loader from "../components/Loader.jsx";
import { useToast } from "../components/ToastContext.jsx";

const MonitoringPage = () => {
  const [runIdInput, setRunIdInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleLoad = async () => {
    setLoading(true);
    try {
      const result = await fetchMonitoringGraph(runIdInput.trim());
      setData(result);
      if (toast) {
        toast.showToast("Monitoring data loaded.", "success");
      }
    } catch (error) {
      if (toast) {
        toast.showToast("Failed to load monitoring data", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900">Monitoring</h1>
      <p className="text-sm text-gray-600">
        View LangGraph workflow structure and execution logs. Optionally filter
        by a specific run ID (copied from the Dashboard).
      </p>
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
        <input
          type="text"
          value={runIdInput}
          onChange={(e) => setRunIdInput(e.target.value)}
          placeholder="Optional Run ID"
          className="w-full md:w-80 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleLoad}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Load Logs
        </button>
      </div>
      {loading && <Loader text="Loading monitoring logs..." />}
      {data && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Graph Overview
            </h2>
            <p className="text-xs text-gray-500 mb-2">
              Static view of nodes and edges in the LangGraph workflow.
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  Nodes
                </p>
                <ul className="text-xs text-gray-700 list-disc list-inside">
                  {data.nodes.map((n) => (
                    <li key={n.node}>
                      {n.node}{" "}
                      <span className="text-gray-400">
                        ({n.count} executions)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  Edges
                </p>
                <ul className="text-xs text-gray-700 list-disc list-inside">
                  {data.edges.map((e, idx) => (
                    <li key={idx}>
                      {e.from} → {e.to}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm max-h-[420px] overflow-y-auto">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Execution Timeline
            </h2>
            {data.timeline.length === 0 && (
              <p className="text-xs text-gray-500">
                No logs found for this filter.
              </p>
            )}
            <ol className="relative border-l border-gray-200 ml-2">
              {data.timeline.map((entry, index) => (
                <li className="mb-4 ml-4" key={index}>
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                  <time className="mb-1 text-xs font-normal leading-none text-gray-400">
                    {entry.timestamp
                      ? new Date(entry.timestamp).toLocaleTimeString()
                      : ""}
                  </time>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {entry.node}
                  </h3>
                  <details className="mt-1">
                    <summary className="text-xs text-gray-600 cursor-pointer">
                      View details
                    </summary>
                    <div className="mt-1 space-y-1">
                      <p className="text-[11px] text-gray-500">
                        Input:{" "}
                        <span className="font-mono">
                          {JSON.stringify(entry.input)}
                        </span>
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Output:{" "}
                        <span className="font-mono">
                          {JSON.stringify(entry.output)}
                        </span>
                      </p>
                      <p className="text-[11px] text-gray-500">
                        State snapshot:{" "}
                        <span className="font-mono">
                          {JSON.stringify(entry.state)}
                        </span>
                      </p>
                    </div>
                  </details>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringPage;