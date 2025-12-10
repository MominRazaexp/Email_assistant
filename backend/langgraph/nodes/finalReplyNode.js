import { logNodeExecution } from "../../utils/logger.js";

export const finalReplyNode = async ({ state, runId }) => {
  const finalReply = state.polishedReply || state.draftReply;

  const summarySteps = state.steps.map((s) => {
    return {
      node: s.node,
      timestamp: s.timestamp,
      shortOutput:
        s.output && typeof s.output === "object"
          ? Object.keys(s.output)
          : "done"
    };
  });

  const output = {
    finalReply,
    steps: summarySteps
  };

  const newState = {
    ...state,
    finalReply,
    steps: [
      ...state.steps,
      {
        node: "FinalReplyNode",
        input: {},
        output,
        timestamp: new Date()
      }
    ]
  };

  await logNodeExecution(runId, "FinalReplyNode", {}, output, newState);

  return newState;
};