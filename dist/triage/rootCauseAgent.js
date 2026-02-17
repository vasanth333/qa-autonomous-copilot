"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRootCauseAgent = runRootCauseAgent;
const openai_1 = require("@langchain/openai");
async function runRootCauseAgent(cluster) {
    const model = new openai_1.ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
    });
    const prompt = `
You are a QA root cause analysis specialist.

Cluster Pattern:
${cluster.pattern}

Affected Tests:
${cluster.testNames.join(", ")}

Provide a concise root cause explanation.
Do not speculate beyond the pattern.
`;
    const response = await model.invoke(prompt);
    return typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
}
