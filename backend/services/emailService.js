import { runEmailGraph } from "../langgraph/graph.js";
import { createRunId } from "../utils/logger.js";
import Log from "../models/Log.js";

export const processEmail = async (emailText) => {
  const runId = createRunId();
  const finalState = await runEmailGraph({ emailText, runId });

  const logs = await Log.find({ runId }).sort({ createdAt: 1 }).lean();

  return {
    runId,
    finalReply: finalState.finalReply,
    steps: finalState.steps,
    logs
  };
};