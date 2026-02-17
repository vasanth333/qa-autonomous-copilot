"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeverityAgent = runSeverityAgent;
const openai_1 = require("@langchain/openai");
async function runSeverityAgent(cluster) {
    const model = new openai_1.ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
    });
    const prompt = `
You are a QA severity classification expert.

Cluster Pattern:
${cluster.pattern}

Number of affected tests: ${cluster.testNames.length}

Classify severity as one of:
LOW
MEDIUM
HIGH
CRITICAL

Return only one word.
`;
    const response = await model.invoke(prompt);
    const content = typeof response.content === "string"
        ? response.content.trim().toUpperCase()
        : "MEDIUM";
    if (["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(content)) {
        return content;
    }
    return "MEDIUM";
}
