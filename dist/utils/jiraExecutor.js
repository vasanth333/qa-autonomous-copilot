"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleJiraCreation = handleJiraCreation;
const readline_1 = __importDefault(require("readline"));
function askApproval(question) {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase() === "y");
        });
    });
}
async function handleJiraCreation(ticket, riskScore) {
    console.log("\n🎫 Jira Execution Decision:");
    if (riskScore >= 80) {
        console.log("🔥 HIGH RISK SYSTEM STATE");
        const approved = await askApproval("Risk ≥ 80. Mandatory approval required. Create Jira ticket? (y/n): ");
        if (!approved) {
            console.log("🛑 Jira creation blocked by human.");
            return;
        }
    }
    else if (riskScore >= 50) {
        const approved = await askApproval("Risk ≥ 50. Approve Jira creation? (y/n): ");
        if (!approved) {
            console.log("🛑 Jira creation cancelled.");
            return;
        }
    }
    // Simulate Jira API call
    console.log("📤 Simulating Jira Ticket Creation...");
    console.log("Ticket Created Successfully ✅");
}
