const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const processEmail = async (emailText) => {
  const res = await fetch(API_BASE_URL + "/api/email/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ emailText })
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Failed to process email");
  }

  return res.json();
};

export const fetchHistory = async () => {
  const res = await fetch(API_BASE_URL + "/api/history");
  if (!res.ok) {
    throw new Error("Failed to fetch history");
  }
  return res.json();
};

export const fetchMonitoringGraph = async (runId) => {
  const url = runId
    ? API_BASE_URL + "/api/monitoring/graph?runId=" + encodeURIComponent(runId)
    : API_BASE_URL + "/api/monitoring/graph";

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch monitoring graph");
  }
  return res.json();
};