"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveKnowledgeTool = void 0;
const langchain_1 = require("langchain");
const vectorStore_js_1 = require("../rag/vectorStore.js");
exports.retrieveKnowledgeTool = (0, langchain_1.tool)(async (input) => {
    try {
        console.log("🔍 Tool called with input:", input);
        const vectorStore = await (0, vectorStore_js_1.createVectorStore)();
        const docs = await vectorStore.similaritySearch(input, 2);
        console.log("📄 Retrieved docs:", docs);
        return docs.map((doc) => doc.pageContent).join("\n");
    }
    catch (error) {
        console.error("❌ TOOL ERROR:", error);
        throw error;
    }
}, {
    name: "retrieve_qa_knowledge",
    description: "Use this tool whenever a question relates to QA test failures, login issues, or historical test logs.",
});
