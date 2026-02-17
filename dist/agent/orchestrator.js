"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMultiAgentSystem = runMultiAgentSystem;
const retrievalAgent_js_1 = require("./retrievalAgent.js");
const analysisAgent_js_1 = require("./analysisAgent.js");
const validationAgent_js_1 = require("./validationAgent.js");
/**
 * 🔐 Basic Prompt Injection Detection
 */
function validateUserInput(question) {
    const forbiddenPatterns = [
        /ignore previous instructions/i,
        /override system/i,
        /reveal secrets/i,
        /execute command/i,
        /delete database/i,
    ];
    for (const pattern of forbiddenPatterns) {
        if (pattern.test(question)) {
            throw new Error("🚨 Potential prompt injection detected.");
        }
    }
}
/**
 * 🚦 Basic Rate Limiting
 */
let lastExecutionTime = 0;
const MIN_INTERVAL_MS = 1500;
function enforceRateLimit() {
    const now = Date.now();
    if (now - lastExecutionTime < MIN_INTERVAL_MS) {
        throw new Error("🚦 Rate limit exceeded. Please wait before retrying.");
    }
    lastExecutionTime = now;
}
/**
 * 🤖 Main Multi-Agent System
 */
async function runMultiAgentSystem(question) {
    try {
        // 🔐 Input validation
        validateUserInput(question);
        // 🚦 Rate limit check
        enforceRateLimit();
        const startTime = Date.now();
        const MAX_ATTEMPTS = 2;
        const CONFIDENCE_THRESHOLD = 0.7;
        let attempt = 0;
        let finalAnswer = "";
        let validation = null;
        while (attempt < MAX_ATTEMPTS) {
            console.log(`🔄 Attempt ${attempt + 1}`);
            console.log("🧩 Retrieval Agent...");
            const retrieved = await (0, retrievalAgent_js_1.runRetrievalAgent)(question);
            console.log("🧠 Analysis Agent...");
            finalAnswer = (await (0, analysisAgent_js_1.runAnalysisAgent)(retrieved));
            console.log("🔍 Validation Agent...");
            validation = await (0, validationAgent_js_1.runValidationAgent)(JSON.stringify(retrieved), finalAnswer);
            if (validation.confidence >= CONFIDENCE_THRESHOLD) {
                console.log("✅ Confidence acceptable. Stopping retries.");
                break;
            }
            console.log("⚠️ Low confidence detected. Retrying in 1 second...");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            attempt++;
        }
        const totalTime = Date.now() - startTime;
        console.log(`⏱ Total execution time: ${totalTime} ms`);
        return {
            answer: finalAnswer,
            validation,
            attempts: attempt + 1,
            executionTimeMs: totalTime,
        };
    }
    catch (error) {
        console.error("🚨 SYSTEM ERROR:", error);
        return {
            answer: "SYSTEM ERROR",
            validation: null,
            attempts: 0,
            executionTimeMs: 0,
        };
    }
}
