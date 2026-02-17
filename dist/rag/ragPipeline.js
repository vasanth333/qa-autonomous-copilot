"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRAG = runRAG;
const openai_1 = require("@langchain/openai");
const vectorStore_js_1 = require("./vectorStore.js");
async function runRAG(question) {
    // 1️⃣ Create vector store
    const vectorStore = await (0, vectorStore_js_1.createVectorStore)();
    // 2️⃣ Retrieve relevant documents
    const docs = await vectorStore.similaritySearch(question, 2);
    const context = docs.map(doc => doc.pageContent).join("\n");
    // 3️⃣ Create LLM (no model field needed in your version)
    const llm = new openai_1.ChatOpenAI({
        temperature: 0,
    });
    // 4️⃣ Structured prompt
    const prompt = `
You are a QA diagnostic assistant.
Answer the question only using the context below.
If the answer is not in the context, say "I don't know."

Context:
${context}

Question:
${question}
`;
    // 5️⃣ Generate answer
    const response = await llm.invoke(prompt);
    return response.content;
}
