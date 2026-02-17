"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runValidationAgent = runValidationAgent;
const openai_1 = require("@langchain/openai");
async function runValidationAgent(retrievedContext, analysisAnswer) {
    const model = new openai_1.ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
    });
    const prompt = `
You are a QA validation expert.

Retrieved QA Context:
${retrievedContext}

Analysis Answer:
${analysisAnswer}

Evaluate the following:

1. Is the analysis grounded ONLY in the retrieved context?
2. Are there unsupported assumptions?
3. Provide a confidence score between 0 and 1.

Return STRICT JSON:

{
  "isGrounded": true or false,
  "confidence": 0.0 to 1.0,
  "notes": "short explanation"
}
`;
    const response = await model.invoke(prompt);
    const content = typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
    return JSON.parse(content);
}
