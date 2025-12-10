import client from "../../config/openai.js";

export const grammarPolishTool = async ({ text, tone }) => {
  const safeTone = tone && tone.length > 0 ? tone : "professional and friendly";

  const prompt =
    "You are a writing assistant. Improve the grammar, clarity, and tone of the following email reply. " +
    "Keep the meaning but make it " +
    safeTone +
    ".\n\n" +
    "Reply only with the improved email text.\n\n" +
    text;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }]
  });

  const content = response.choices[0].message.content || "";
  return {
    original: text,
    polished: content
  };
};