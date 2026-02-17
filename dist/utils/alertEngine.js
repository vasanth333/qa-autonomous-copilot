"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateAlerts = evaluateAlerts;
const readline_1 = __importDefault(require("readline"));
function askHumanApproval(question) {
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
async function evaluateAlerts(report, trendInsight) {
    console.log("\n🚦 Alert Evaluation:");
    if (report.criticalCount > 0) {
        console.log("🚨 CRITICAL ISSUE DETECTED!");
        const approved = await askHumanApproval("Do you want to push CRITICAL alert to Slack? (y/n): ");
        if (approved) {
            console.log("📢 Sending Slack Alert → #qa-critical");
        }
        else {
            console.log("🛑 Alert cancelled by human.");
        }
    }
    if (trendInsight.includes("CRITICAL failures increased")) {
        const approved = await askHumanApproval("CRITICAL spike detected. Escalate to PagerDuty? (y/n): ");
        if (approved) {
            console.log("🔥 Escalating to PagerDuty...");
        }
        else {
            console.log("🛑 Escalation cancelled.");
        }
    }
}
