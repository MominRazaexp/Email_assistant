import { logNodeExecution } from "../../utils/logger.js";

export const inputNode = async ({ state, runId }, input = {}) => {

  const emailText = input.emailText || state.emailText || "";

  if (!emailText) {
    throw new Error("InputNode: emailText is missing");
  }

  const newState = {
    ...state,
    emailText
  };

  await logNodeExecution(runId, "InputNode", input, { emailText }, newState);

  return newState;
};
