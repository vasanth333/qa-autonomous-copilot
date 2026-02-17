"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExecutiveSummary = generateExecutiveSummary;
const openai_1 = require("@langchain/openai");
async function generateExecutiveSummary(clusters) {
    const model = new openai_1.ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
    });
    const prompt = `
You are a QA executive reporting assistant.

Provide a concise executive summary based on the following failure clusters.

Focus on:
- Overall system health
- Most critical issues
- Priority areas for engineering

Clusters:
${clusters
        .map((c) => `Cluster ${c.clusterId} | Severity: ${c.severity} | Pattern: ${c.pattern}`)
        .join("\n")}

Keep summary under 5 sentences.
`;
    const response = await model.invoke(prompt);
    return typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
}
