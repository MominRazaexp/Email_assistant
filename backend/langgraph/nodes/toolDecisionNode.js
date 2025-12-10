import { logNodeExecution } from "../../utils/logger.js";
import { searchTool } from "../tools/searchTool.js";
import { embeddingTool } from "../tools/embeddingTool.js";
import client from "../../config/openai.js";
import Template from "../../models/Template.js";

export const toolDecisionNode = async ({ state, runId }) => {
  const outputs = {};

  let usedEmbedding = false;
  let templateSuggestion = "";
  const missingInfoText = state.missingInfo || "";
  const saveEmailAsTemplate = async ({ title, emailText }) => {
  const embeddingResponse = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: emailText
  });

  const vector = embeddingResponse.data[0].embedding;

 
  const newTemplate = new Template({
    title,
    body: emailText,
    embedding: vector
  });

  await newTemplate.save();

  return newTemplate;
};
const existingTemplates = await Template.find({});
  if (existingTemplates.length === 0) {
    await saveEmailAsTemplate({
      title: "First email template",
      emailText: state.emailText
    });
  }


  let searchResult = null;

    const queryParts = [];
    if (missingInfoText && missingInfoText.length > 0 && missingInfoText.toLowerCase() !== "none") {
      queryParts.push(missingInfoText);
    } else {
      queryParts.push(state.emailText);
    }
    const query = queryParts.join(". ");
    searchResult = await searchTool({ query });
    outputs.searchResult = searchResult;



  const intentLower = state.analysis.intent.toLowerCase();
  const canUseEmbedding =
    intentLower.indexOf("follow-up") !== -1 ||
    intentLower.indexOf("apology") !== -1 ||
    intentLower.indexOf("thank") !== -1;
  if (canUseEmbedding) {
     await saveEmailAsTemplate({
      title: "after first email",
      emailText: state.emailText
    });
    const embeddingInfo = await embeddingTool({ emailText: state.emailText });
    console.log(embeddingInfo)
    if (embeddingInfo.used) {
      usedEmbedding = true;
      templateSuggestion = embeddingInfo.suggestion;
      outputs.templateSuggestion = {
        title: embeddingInfo.title,
        similarity: embeddingInfo.similarity
      };
    }
  }

  const newState = {
    ...state,
    usedEmbedding,
    templateSuggestion,
    steps: [
      ...state.steps,
      {
        node: "ToolDecisionNode",
        input: {
          missingInfo: state.missingInfo,
          analysis: state.analysis
        },
        output: {
          usedEmbedding,
          templateSuggestionSummary:
            templateSuggestion && templateSuggestion.length > 0
              ? "Template suggestion applied"
              : "No template used",
          searchResultSummary: searchResult
            ? `Search result available:\n${JSON.stringify(searchResult, null, 2)}`
            : "No search used"
        },
        timestamp: new Date()
      }
    ]
  };

  await logNodeExecution(
    runId,
    "ToolDecisionNode",
    {
      missingInfo: state.missingInfo,
      analysis: state.analysis
    },
    outputs,
    newState
  );

  return newState;
};