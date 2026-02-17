import readline from "readline";
import { QAExecutiveReport } from "../types/triageTypes.js";

function askHumanApproval(question: string): Promise<boolean> {
  const rl = readline.createInterface({
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

export async function evaluateAlerts(
  report: QAExecutiveReport,
  trendInsight: string
): Promise<void> {

  console.log("\n🚦 Alert Evaluation:");

  if (report.criticalCount > 0) {

    console.log("🚨 CRITICAL ISSUE DETECTED!");

    const approved = await askHumanApproval(
      "Do you want to push CRITICAL alert to Slack? (y/n): "
    );

    if (approved) {
      console.log("📢 Sending Slack Alert → #qa-critical");
    } else {
      console.log("🛑 Alert cancelled by human.");
    }
  }

  if (trendInsight.includes("CRITICAL failures increased")) {

    const approved = await askHumanApproval(
      "CRITICAL spike detected. Escalate to PagerDuty? (y/n): "
    );

    if (approved) {
      console.log("🔥 Escalating to PagerDuty...");
    } else {
      console.log("🛑 Escalation cancelled.");
    }
  }
}
