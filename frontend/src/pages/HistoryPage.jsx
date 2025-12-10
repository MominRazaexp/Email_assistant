import React, { useEffect, useState } from "react";
import { fetchHistory } from "../utils/api.js";
import Loader from "../components/Loader.jsx";
import { useToast } from "../components/ToastContext.jsx";

const HistoryItem = ({ item, onClick }) => {
  const createdAt = item.createdAt ? new Date(item.createdAt) : null;
  const dateText = createdAt ? createdAt.toLocaleString() : "";

  const snippet =
    item.emailText.length > 120
      ? item.emailText.slice(0, 120) + "..."
      : item.emailText;

  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm cursor-pointer hover:bg-gray-50"
      onClick={() => onClick(item)}
    >
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-gray-500">{dateText}</p>
        <p className="text-xs text-gray-400">
          Steps: {item.steps ? item.steps.length : 0}
        </p>
      </div>
      <p className="text-xs font-semibold text-gray-700 mb-1">Original Email</p>
      <p className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">{snippet}</p>
      <p className="text-xs font-semibold text-gray-700 mb-1">AI Reply</p>
      <p className="text-sm text-gray-800 whitespace-pre-wrap">{item.finalReply}</p>
    </div>
  );
};

const Modal = ({ item, onClose }) => {
  const [showSteps, setShowSteps] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  if (!item) return null;
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


const formatKey = (key) => {
  const result = key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim();
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const renderObject = (obj) => {
  return Object.entries(obj).map(([key, value], idx) => {
    const formattedKey = formatKey(key);

    if (Array.isArray(value)) {
      return (
        <div key={idx} className="ml-4 mb-1">
          <p className="text-sm font-semibold">{formattedKey}:</p>
          <ul className="list-disc ml-5 text-sm">
            {value.map((v, i) =>
              typeof v === "object" && v !== null ? (
                <li key={i}>{renderObject(v)}</li>
              ) : (
                <li key={i}>
                  <pre className="whitespace-pre-wrap">{v?.toString()}</pre>
                </li>
              )
            )}
          </ul>
        </div>
      );
    } else if (typeof value === "object" && value !== null) {
      return (
        <div key={idx} className="ml-4 mb-1">
          <p className="text-sm font-semibold">{formattedKey}:</p>
          <div className="ml-4">{renderObject(value)}</div>
        </div>
      );
    } else {
      return (
        <p key={idx} className="text-sm mb-1">
          <span className="font-semibold">{formattedKey}:</span>{" "}
          <pre className="whitespace-pre-wrap inline">{value?.toString()}</pre>
        </p>
      );
    }
  });
};

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-2xl"
        >
          ×
        </button>

        <div className="mb-4">
          <p className="text-xs text-gray-500">
            {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
          </p>
          <p className="text-xs text-gray-400">
            Steps: {item.steps ? item.steps.length : 0}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-1">Original Email</p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{item.emailText}</p>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-1">AI Reply</p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{item.finalReply}</p>
        </div>

        {/* Show Steps Button */}
        {item.steps && item.steps.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showSteps ? "Hide Steps" : "Show Steps"}
            </button>
          </div>
        )}

        {/* Steps List */}
        {showSteps && (
          <div className="mt-4 border-t pt-4 space-y-2">
            {item.steps.map((step, index) => (
              <div
                key={index}
                className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedStep(step)}
              >
                <p className="text-sm font-semibold">
                  Step {index + 1}: {step.node}
                </p>
              </div>
            ))}

            {/* Selected Step Details */}
            {selectedStep && (
              <div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
                <p className="text-sm font-semibold mb-2">Node: {selectedStep.node}</p>

                {/* Input */}
                {selectedStep.input && (
                  <div className="border-t pt-2">
                    <p className="text-sm font-semibold mb-1">Input:</p>
                    <div>{renderObject(selectedStep.input)}</div>
                  </div>
                )}

                {/* Output */}
                {selectedStep.output && (
                  <div className="border-t pt-2">
                    <p className="text-sm font-semibold mb-1">Output:</p>
                    <div>{renderObject(selectedStep.output)}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchHistory();
        setHistory(data);
      } catch (error) {
        if (toast) {
          toast.showToast("Failed to load history", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900">History</h1>
      {loading && <Loader text="Loading history..." />}
      {!loading && history.length === 0 && (
        <p className="text-sm text-gray-500">
          No history yet. Generate a reply in the Dashboard to see it here.
        </p>
      )}
      <div className="space-y-3">
        {history.map((item) => (
          <HistoryItem key={item._id} item={item} onClick={setSelectedItem} />
        ))}
      </div>

      {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
};

export default HistoryPage;
