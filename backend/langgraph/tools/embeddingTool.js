import client from "../../config/openai.js";
import Template from "../../models/Template.js";

export const embeddingTool = async ({ emailText }) => {
  // Only used when agent decides personalization is helpful.
  const embeddingResponse = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: emailText
  });

  const vector = embeddingResponse.data[0].embedding;

  // Simple cosine similarity search implemented manually.
  const templates = await Template.find({});
  let bestTemplate = null;
  let bestScore = -1;

  const magnitude = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i += 1) {
      const v = arr[i];
      sum += v * v;
    }
    return Math.sqrt(sum);
  };

  const dot = (a, b) => {
    const len = a.length < b.length ? a.length : b.length;
    let sum = 0;
    for (let i = 0; i < len; i += 1) {
      sum += a[i] * b[i];
    }
    return sum;
  };

  const magVector = magnitude(vector);

  for (let i = 0; i < templates.length; i += 1) {
    const t = templates[i];
    if (!t.embedding || t.embedding.length === 0) {
      // Skip templates without embeddings
      // (could be a migration or partially filled DB)
      continue;
    }
    const magTemplate = magnitude(t.embedding);
    if (magTemplate === 0 || magVector === 0) {
      continue;
    }
    const sim = dot(vector, t.embedding) / (magVector * magTemplate);
    if (sim > bestScore) {
      bestScore = sim;
      bestTemplate = t;
    }
  }

  if (!bestTemplate) {
    return {
      used: false,
      suggestion: ""
    };
  }

  return {
    used: true,
    suggestion: bestTemplate.body,
    title: bestTemplate.title,
    similarity: bestScore
  };
};