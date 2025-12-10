import { grammarPolishTool } from "../tools/grammarPolishTool.js";
import { logNodeExecution } from "../../utils/logger.js";

export const grammarPolishNode = async ({ state, runId }) => {
  const result = await grammarPolishTool({
    text: state.draftReply,
    tone: "professional, warm, and concise"
  });

  const newState = {
    ...state,
    polishedReply: result.polished,
    steps: [
      ...state.steps,
      {
        node: "GrammarPolishNode",
        input: { draftReply: state.draftReply },
        output: { polishedReply: result.polished },
        timestamp: new Date()
      }
    ]
  };

  await logNodeExecution(
    runId,
    "GrammarPolishNode",
    { draftReply: state.draftReply },
    { polishedReply: result.polished },
    newState
  );

  return newState;
};