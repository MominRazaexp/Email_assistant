import React, { useState } from "react";
import EmailInputBox from "../components/EmailInputBox.jsx";
import AIOutputCard from "../components/AIOutputCard.jsx";
import AgentTimelineViewer from "../components/AgentTimelineViewer.jsx";
import Loader from "../components/Loader.jsx";
import { processEmail } from "../utils/api.js";
import { useToast } from "../components/ToastContext.jsx";

const DashboardPage = () => {
  const [emailText, setEmailText] = useState("");
  const [reply, setReply] = useState("");
  const [steps, setSteps] = useState([]);
  const [runId, setRunId] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleGenerate = async () => {
    if (!emailText || emailText.trim().length === 0) {
      if (toast) {
        toast.showToast("Please paste an email first.", "error");
      }
      return;
    }
    setLoading(true);
    setReply("");
    setSteps([]);
    setRunId("");

    try {
      const data = await processEmail(emailText);
      setReply(data.finalReply || "");
      setSteps(data.steps || []);
      setRunId(data.runId || "");
      if (toast) {
        toast.showToast("Reply generated successfully.", "success");
      }
    } catch (error) {
      if (toast) {
        toast.showToast(error.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <EmailInputBox value={emailText} onChange={setEmailText} />
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className={
                "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" +
                (loading ? " opacity-80 cursor-not-allowed" : "")
              }
            >
              {loading ? "Generating..." : "Generate Reply"}
            </button>
            {loading && <Loader text="Agent is thinking..." />}
          </div>
          <AIOutputCard reply={reply} />
        </div>
        <div className="w-full md:w-72">
          <AgentTimelineViewer steps={steps} />
          {runId && (
            <p className="mt-2 text-xs text-gray-500 break-all">
              Run ID: {runId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;