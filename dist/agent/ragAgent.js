"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRAGAgent = runRAGAgent;
const langchain_1 = require("langchain");
const openai_1 = require("@langchain/openai");
const retrievalTool_js_1 = require("../tools/retrievalTool.js");
async function runRAGAgent(question) {
    const model = new openai_1.ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
    });
    const agent = (0, langchain_1.createAgent)({
        model,
        tools: [retrievalTool_js_1.retrieveKnowledgeTool],
        systemPrompt: `
You are a QA diagnostic assistant.

If the user asks about test failures, login issues, QA logs, or environment problems,
you MUST use the retrieve_qa_knowledge tool before answering.

Do NOT guess.
Do NOT provide general knowledge.
Always retrieve historical test data first.
`,
    });
    // 🔹 Invoke the agent
    const result = await agent.invoke({
        messages: [
            {
                role: "user",
                content: question,
            },
        ],
    });
    // 🔹 Return final assistant message
    return result.messages.at(-1)?.content ?? "No response generated.";
}
