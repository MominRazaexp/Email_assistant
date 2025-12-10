import { historySaveTool } from "../tools/historySaveTool.js";
import { logNodeExecution } from "../../utils/logger.js";

export const saveToDBNode = async ({ state, runId }) => {
  const result = await historySaveTool({
    emailText: state.emailText,
    finalReply: state.polishedReply || state.draftReply,
    steps: state.steps
  });

  const newState = {
    ...state,
    finalReply: state.polishedReply || state.draftReply,
    steps: [
      ...state.steps,
      {
        node: "SaveToDBNode",
        input: {
          emailText: state.emailText,
          finalReply: state.polishedReply || state.draftReply
        },
        output: { historyId: result.id },
        timestamp: new Date()
      }
    ]
  };

  await logNodeExecution(
    runId,
    "SaveToDBNode",
    {
      emailText: state.emailText,
      finalReply: state.polishedReply || state.draftReply
    },
    { historyId: result.id },
    newState
  );

  return newState;
};