import Log from "../models/Log.js";
import { v4 as uuidv4 } from "uuid";

export const createRunId = () => {
  return uuidv4();
};

export const logNodeExecution = async (runId, node, input, output, state) => {
  try {
    await Log.create({
      runId,
      node,
      input,
      output,
      state,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Failed to save log:", error.message);
  }
};