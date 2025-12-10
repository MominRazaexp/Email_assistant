import client from "../../config/openai.js";
import { logNodeExecution } from "../../utils/logger.js";

export const analyzeEmailNode = async ({ state, runId }) => {
  const prompt =
    "You are an email analysis assistant. Read the email below and return JSON with keys:\n" +
    "intent (short string), sentiment (e.g., positive, neutral, negative), " +
    "keyPoints (array of short bullet strings), urgency (low, medium, high), " +
    "missingInfo (short string describing any missing details or 'none').\n\n" +
    "Email:\n" +
    state.emailText +
    "\n\nReturn ONLY valid JSON.";

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content || "{}";

  let analysis = {
    intent: "",
    sentiment: "",
    keyPoints: [],
    urgency: "",
    missingInfo: ""
  };

  try {
    const parsed = JSON.parse(content);
    analysis.intent = parsed.intent || "";
    analysis.sentiment = parsed.sentiment || "";
    analysis.keyPoints = Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [];
    analysis.urgency = parsed.urgency || "";
    analysis.missingInfo = parsed.missingInfo || "";
  } catch (error) {
    analysis.missingInfo = "";
  }

  const newState = {
    ...state,
    analysis: {
      intent: analysis.intent,
      sentiment: analysis.sentiment,
      keyPoints: analysis.keyPoints,
      urgency: analysis.urgency
    },
    missingInfo: analysis.missingInfo,
    steps: [
      ...state.steps,
      {
        node: "AnalyzeEmailNode",
        input: { emailText: state.emailText },
        output: analysis,
        timestamp: new Date()
      }
    ]
  };
  await logNodeExecution(
    runId,
    "AnalyzeEmailNode",
    { emailText: state.emailText },
    analysis,
    newState
  );

  return newState;
};