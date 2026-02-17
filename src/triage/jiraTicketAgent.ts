import { ChatOpenAI } from "@langchain/openai";
import { QAExecutiveReport, JiraTicket } from "../types/triageTypes.js";

export async function generateJiraTicket(
  report: QAExecutiveReport,
  riskScore: number
): Promise<JiraTicket> {

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  });

  const prompt = `
You are a senior QA lead creating a Jira ticket.

System Summary:
${report.summary}

Total Failures: ${report.totalFailures}
Critical: ${report.criticalCount}
High: ${report.highCount}
Medium: ${report.mediumCount}

Risk Score: ${riskScore}/100

Generate a Jira ticket in STRICT JSON format:

{
  "title": "...",
  "description": "...",
  "impact": "...",
  "acceptanceCriteria": ["...", "..."],
  "priority": "LOW | MEDIUM | HIGH | CRITICAL"
}

Rules:
- If riskScore >= 80 → priority = CRITICAL
- If riskScore >= 50 → priority = HIGH
- If riskScore >= 25 → priority = MEDIUM
- Otherwise → LOW

Do not wrap JSON in markdown.
`;

  const response = await model.invoke(prompt);

  const raw =
    typeof response.content === "string"
      ? response.content.trim()
      : JSON.stringify(response.content);

  let cleaned = raw;

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/```json/g, "");
    cleaned = cleaned.replace(/```/g, "");
    cleaned = cleaned.trim();
  }

  return JSON.parse(cleaned) as JiraTicket;
}
