import client from "../../config/openai.js";

export const searchTool = async ({ query }) => {
  const prompt =
    "You are a helpful web search summarizer. " +
    "You cannot access the internet. Instead, use your general world knowledge " +
    "to provide a short, factual answer to this query:\n\n" +
    query +
    "\n\nKeep it under 4 bullet points.";

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }]
  });

  const content = response.choices[0].message.content || "";
  return {
    query,
    result: content
  };
};