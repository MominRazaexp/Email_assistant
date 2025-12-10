import { StateGraph, END } from "@langchain/langgraph";
import { initialState } from "./state.js";

import { inputNode } from "./nodes/inputNode.js";
import { taskPlanningNode } from "./nodes/taskPlanningNode.js";
import { analyzeEmailNode } from "./nodes/analyzeEmailNode.js";
import { toolDecisionNode } from "./nodes/toolDecisionNode.js";
import { draftReplyNode } from "./nodes/draftReplyNode.js";
import { grammarPolishNode } from "./nodes/grammarPolishNode.js";
import { saveToDBNode } from "./nodes/saveToDBNode.js";
import { monitoringNode } from "./nodes/monitoringNode.js";
import { finalReplyNode } from "./nodes/finalReplyNode.js";

export const buildGraph = () => {
  //StateGraph is a workflow engine.
  //The channels inside it act like variables in shared state that all nodes can read and update.
  const graph = new StateGraph({
    channels: {
      emailText: null,
      runId: null,
      plan: null,
      steps: null,
      analysis: null,
      draftReply: null,
      polishedReply: null,
      finalReply: null,
      needsSearch: null,
      missingInfo: null,
      templateSuggestion: null,
      usedEmbedding: null
    }
  });

  //Each graph.addNode() registers a step in your workflow.
  graph.addNode("InputNode", async (state, config) => {
    //receives state (the shared workflow data)
    //receives config (extra data graph sends)
    return inputNode({
      state,
      input: config.input,
      runId: state.runId
    });
  });

  graph.addNode("TaskPlanningNode", async (state, config) => {
    return taskPlanningNode({ state, runId: state.runId });
  });

  graph.addNode("AnalyzeEmailNode", async (state, config) => {
    return analyzeEmailNode({ state, runId: state.runId });
  });

  graph.addNode("ToolDecisionNode", async (state, config) => {
    return toolDecisionNode({ state, runId: state.runId });
  });

  graph.addNode("DraftReplyNode", async (state, config) => {
    return draftReplyNode({ state, runId: state.runId });
  });

  graph.addNode("GrammarPolishNode", async (state, config) => {
    return grammarPolishNode({ state, runId: state.runId });
  });

  graph.addNode("SaveToDBNode", async (state, config) => {
    return saveToDBNode({ state, runId: state.runId });
  });

  graph.addNode("MonitoringNode", async (state, config) => {
    return monitoringNode({ state, runId: state.runId });
  });

  graph.addNode("FinalReplyNode", async (state, config) => {
    return finalReplyNode({ state, runId: state.runId });
  });

  // This tells the graph:
  // Start the workflow from InputNode.
  graph.setEntryPoint("InputNode");

  //Edges Section Flow
  //connects one node to the next.
  graph.addEdge("InputNode", "TaskPlanningNode");
  graph.addEdge("TaskPlanningNode", "AnalyzeEmailNode");
  graph.addEdge("AnalyzeEmailNode", "ToolDecisionNode");
  graph.addEdge("ToolDecisionNode", "DraftReplyNode");
  graph.addEdge("DraftReplyNode", "GrammarPolishNode");
  graph.addEdge("GrammarPolishNode", "SaveToDBNode");
  graph.addEdge("SaveToDBNode", "MonitoringNode");
  graph.addEdge("MonitoringNode", "FinalReplyNode");
  graph.addEdge("FinalReplyNode", END);

  //compile graph into runnable engine
  const compiled = graph.compile({
    //storage mechanism
    checkpointer: undefined
  });

  return compiled;
};

export const runEmailGraph = async ({ emailText, runId }) => {
  const graph = buildGraph();
  //run this entire pipeline with the given input
  const result = await graph.invoke(
  { emailText, runId }
);
//.stream()
//Full run, but emits events as nodes complete.

// .start(input)
// Starts the graph and creates a checkpoint after each node.

// .resume(checkpoint)
// Continues the graph from the last saved state if something crashed or you intentionally paused it.

  return result;
};




// const inputNode = new LLMChain({
//   llm: model,
//   prompt: `Process the email input: {emailText}`
// });

// const planningNode = new LLMChain({
//   llm: model,
//   prompt: `Create a task plan for this email: {inputNodeOutput}`
// });

// const analyzeNode = new LLMChain({
//   llm: model,
//   prompt: `Analyze this email deeply: {planningOutput}`
// });

// const toolDecisionNode = new LLMChain({
//   llm: model,
//   prompt: `Decide if external tools are required based on analysis: {analysisOutput}`
// });
// const emailChain = new SequentialChain({
//   chains: [
//     inputNode,
//     planningNode,
//     analyzeNode,
//     toolDecisionNode,
//     draftNode,
//     polishNode
//   ],
//   inputVariables: ["emailText"],
//   outputVariables: ["polishNodeOutput"]
// });