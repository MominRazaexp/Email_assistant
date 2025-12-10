import { logNodeExecution } from "../../utils/logger.js";

export const monitoringNode = async ({ state, runId }) => {
  const snapshot = {
    emailText: state.emailText,
    plan: state.plan,
    analysis: state.analysis,
    draftReply: state.draftReply,
    polishedReply: state.polishedReply,
    finalReply: state.finalReply
  };

  const newState = {
    ...state,
    steps: [
      ...state.steps,
      {
        node: "MonitoringNode",
        input: {},
        output: snapshot,
        timestamp: new Date()
      }
    ]
  };

  await logNodeExecution(runId, "MonitoringNode", {}, snapshot, newState);

  return newState;
};