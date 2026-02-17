import readline from "readline";
import { JiraTicket } from "../types/triageTypes.js";

function askApproval(question: string): Promise<boolean> {
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

export async function handleJiraCreation(
  ticket: JiraTicket,
  riskScore: number
): Promise<void> {

  console.log("\n🎫 Jira Execution Decision:");

  if (riskScore >= 80) {
    console.log("🔥 HIGH RISK SYSTEM STATE");
    const approved = await askApproval(
      "Risk ≥ 80. Mandatory approval required. Create Jira ticket? (y/n): "
    );

    if (!approved) {
      console.log("🛑 Jira creation blocked by human.");
      return;
    }
  } else if (riskScore >= 50) {
    const approved = await askApproval(
      "Risk ≥ 50. Approve Jira creation? (y/n): "
    );

    if (!approved) {
      console.log("🛑 Jira creation cancelled.");
      return;
    }
  }

  // Simulate Jira API call
  console.log("📤 Simulating Jira Ticket Creation...");
  console.log("Ticket Created Successfully ✅");
}
