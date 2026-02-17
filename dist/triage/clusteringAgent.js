"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runClusteringAgent = runClusteringAgent;
const openai_1 = require("@langchain/openai");
async function runClusteringAgent(logs) {
    const model = new openai_1.ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
    });
    const prompt = `
You are a QA failure clustering specialist.

Group the following test failures by similar root cause pattern.

Return STRICT JSON array:

[
  {
    "clusterId": "cluster-1",
    "pattern": "short description of shared failure pattern",
    "testNames": ["Test-1", "Test-3"]
  }
]

Failures:
${logs
        .map((log) => `${log.testName}: ${log.errorMessage}`)
        .join("\n")}
`;
    const response = await model.invoke(prompt);
    const raw = typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
    let cleaned = raw.trim();
    if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/```json/g, "");
        cleaned = cleaned.replace(/```/g, "");
        cleaned = cleaned.trim();
    }
    return JSON.parse(cleaned);
}
