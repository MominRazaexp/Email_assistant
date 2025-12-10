import EmailHistory from "../../models/EmailHistory.js";

export const historySaveTool = async ({ emailText, finalReply, steps }) => {
  const doc = await EmailHistory.create({
    emailText,
    finalReply,
    steps: steps || []
  });

  return {
    id: doc._id.toString()
  };
};