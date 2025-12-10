export const initialState = {
  emailText: "",
  plan: [],
  steps: [],
  analysis: {
    intent: "",
    sentiment: "",
    keyPoints: [],
    urgency: ""
  },
  draftReply: "",
  polishedReply: "",
  finalReply: "",
  needsSearch: false,
  missingInfo: "",
  templateSuggestion: "",
  usedEmbedding: false
};