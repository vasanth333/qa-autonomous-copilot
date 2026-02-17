"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAgent = runAgent;
const openai_1 = __importDefault(require("openai"));
const addTool_1 = require("../tools/addTool");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
async function runAgent() {
    const userInput = "What is 10 + 15?";
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a math assistant. If user asks to add numbers, respond ONLY in JSON like: {\"action\":\"add\",\"a\":number,\"b\":number}"
            },
            {
                role: "user",
                content: userInput
            }
        ]
    });
    const content = response.choices[0].message.content;
    console.log("LLM Raw Response:", content);
    if (!content)
        return;
    const parsed = JSON.parse(content);
    if (parsed.action === "add") {
        const result = await (0, addTool_1.addNumbers)(parsed.a, parsed.b);
        console.log("Final Result:", result);
    }
    else {
        console.log("Unknown action");
    }
}
