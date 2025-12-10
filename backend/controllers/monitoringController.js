import Log from "../models/Log.js";

export const getGraphController = async (req, res) => {
  const runId = req.query.runId || "";
  const filter = runId && runId.length > 0 ? { runId } : {};

  try {
    const logs = await Log.find(filter).sort({ createdAt: 1 }).lean();

    const timeline = logs.map((l) => {
      return {
        node: l.node,
        timestamp: l.timestamp,
        input: l.input,
        output: l.output,
        state: l.state
      };
    });

    const nodesMap = {};
    for (let i = 0; i < logs.length; i += 1) {
      const n = logs[i].node;
      if (!nodesMap[n]) {
        nodesMap[n] = { node: n, count: 0 };
      }
      nodesMap[n].count += 1;
    }
    const nodes = Object.keys(nodesMap).map((k) => nodesMap[k]);

    const edges = [
      { from: "InputNode", to: "TaskPlanningNode" },
      { from: "TaskPlanningNode", to: "AnalyzeEmailNode" },
      { from: "AnalyzeEmailNode", to: "ToolDecisionNode" },
      { from: "ToolDecisionNode", to: "DraftReplyNode" },
      { from: "DraftReplyNode", to: "GrammarPolishNode" },
      { from: "GrammarPolishNode", to: "SaveToDBNode" },
      { from: "SaveToDBNode", to: "MonitoringNode" },
      { from: "MonitoringNode", to: "FinalReplyNode" }
    ];

    return res.json({
      runId: runId || null,
      nodes,
      edges,
      timeline
    });
  } catch (error) {
    console.error("Error fetching monitoring graph:", error.message);
    return res.status(500).json({
      message: "Failed to fetch monitoring info",
      error: error.message
    });
  }
};