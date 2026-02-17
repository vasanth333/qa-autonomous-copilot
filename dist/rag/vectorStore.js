"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVectorStore = createVectorStore;
const openai_1 = require("@langchain/openai");
const hnswlib_1 = require("@langchain/community/vectorstores/hnswlib");
const textsplitters_1 = require("@langchain/textsplitters");
async function createVectorStore() {
    const embeddings = new openai_1.OpenAIEmbeddings({
        model: "text-embedding-3-small",
    });
    const rawText = `
[10:01] Server started
[10:02] DB connected
[10:03] Login request received
[10:03] Timeout occurred
[10:04] Retry failed
[10:05] Payment module loaded
[10:06] Signup validated
`;
    const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
    });
    const docs = await splitter.createDocuments([rawText]);
    const vectorStore = await hnswlib_1.HNSWLib.fromDocuments(docs, embeddings);
    return vectorStore;
}
