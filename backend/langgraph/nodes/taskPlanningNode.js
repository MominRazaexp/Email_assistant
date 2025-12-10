import client from "../../config/openai.js";
import { logNodeExecution } from "../../utils/logger.js";

export const taskPlanningNode = async ({ state, runId }) => {
  const prompt =
    "You are a planning assistant for an email-reply agent. " +
    "Given the following email, return a JSON array of step objects. " +
    "Each step must have 'order' (number) and 'description' (string).\n\n" +
    "Email:\n" +
    state.emailText +
    "\n\nReturn ONLY valid JSON.";

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content || "{}";

  let planArray = [];
  try {
    const parsed = JSON.parse(content);
    // Expect { steps: [...] } or just [...]
    if (Array.isArray(parsed)) {
      planArray = parsed;
    } else if (parsed.steps && Array.isArray(parsed.steps)) {
      planArray = parsed.steps;
    }
  } catch (error) {
    planArray = [
      { order: 1, description: "Analyze intent" },
      { order: 2, description: "Extract key points" },
      { order: 3, description: "Identify missing information" },
      { order: 4, description: "Use tools if required" },
      { order: 5, description: "Draft reply" },
      { order: 6, description: "Final polish" }
    ];
  }

  const newState = {
  ...state,
  plan: planArray,
  steps: [
    ...(state.steps || []),
    {
      node: "TaskPlanningNode",
      input: { emailText: state.emailText },
      output: { plan: planArray },
      timestamp: new Date()
    }
  ]
};
  await logNodeExecution(
    runId,
    "TaskPlanningNode",
    { emailText: state.emailText },
    { plan: planArray },
    newState
  );

  return newState;
};