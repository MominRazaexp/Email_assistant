import client from "../../config/openai.js";
import { logNodeExecution } from "../../utils/logger.js";

export const draftReplyNode = async ({ state, runId }) => {
  const pointsText = state.analysis.keyPoints.join("; ");
  const urgencyText = state.analysis.urgency || "medium";
  const sentimentText = state.analysis.sentiment || "neutral";

  const extraContext = [];

  if (state.needsSearch) {
    extraContext.push(
      "The agent previously looked up some external information to clarify missing details."
    );
  }
  if (state.templateSuggestion && state.templateSuggestion.length > 0) {
    extraContext.push(
      "You also have access to a suggested template snippet. You may adapt it but do not copy it verbatim if it does not fit perfectly."
    );
  }

  const contextText = extraContext.join(" ");

  const prompt =
    "You are an AI email assistant. Draft a reply to the email below.\n\n" +
    "Email:\n" +
    state.emailText +
    "\n\n" +
    "Analysis:\n" +
    "- Intent: " +
    state.analysis.intent +
    "\n- Sentiment: " +
    sentimentText +
    "\n- Key points: " +
    pointsText +
    "\n- Urgency: " +
    urgencyText +
    "\n\n" +
    (state.templateSuggestion && state.templateSuggestion.length > 0
      ? "Suggested template snippet to consider:\n" +
        state.templateSuggestion +
        "\n\n"
      : "") +
    contextText +
    "\n\n" +
    "Write a clear, concise, and helpful reply. Do not include analysis labels, only the email body.";

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }]
  });

  const draft = response.choices[0].message.content || "";

  const newState = {
    ...state,
    draftReply: draft,
    steps: [
      ...state.steps,
      {
        node: "DraftReplyNode",
        input: {
          emailText: state.emailText,
          analysis: state.analysis,
          templateSuggestion:
            state.templateSuggestion && state.templateSuggestion.length > 0
              ? "Provided"
              : "None"
        },
        output: { draftReply: draft },
        timestamp: new Date()
      }
    ]
  };

  await logNodeExecution(
    runId,
    "DraftReplyNode",
    {
      emailText: state.emailText,
      analysis: state.analysis
    },
    { draftReply: draft },
    newState
  );

  return newState;
};