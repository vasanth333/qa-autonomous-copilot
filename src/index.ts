import "dotenv/config";
import { calculateRiskScore, classifyRisk } from "./utils/riskEngine.js";
import { generateJiraTicket } from "./triage/jiraTicketAgent.js";
import { handleJiraCreation } from "./utils/jiraExecutor.js";


import { saveReport, loadLatestReport } from "./utils/reportStorage.js";
import { compareReports } from "./utils/trendAnalyzer.js";
import { applySeverityRules } from "./utils/severityRules.js";
import { evaluateAlerts } from "./utils/alertEngine.js";

import { collectLogs } from "./triage/logCollector.js";
import { runClusteringAgent } from "./triage/clusteringAgent.js";
import { runRootCauseAgent } from "./triage/rootCauseAgent.js";
import { runSeverityAgent } from "./triage/severityAgent.js";
import { generateExecutiveSummary } from "./triage/executiveSummaryAgent.js";

import {
  ClusterAnalysis,
  QAExecutiveReport,
} from "./types/triageTypes.js";

async function main() {
  // 🔹 Sample raw logs (simulate failed test logs)
  const rawLogs = [
    "Login failed due to timeout",
    "Signup failed due to timeout",
    "Payment failed due to invalid currency",
    "Checkout failed due to invalid currency",
  ];

  console.log("📥 Raw Logs:");
  console.log(rawLogs);

  // 🔹 Step 1 — Normalize logs
  const structuredLogs = collectLogs(rawLogs);

  console.log("📦 Structured Logs:");
  console.dir(structuredLogs, { depth: null });

  // 🔹 Step 2 — Cluster failures
  const clusters = await runClusteringAgent(structuredLogs);

  console.log("📊 Clustered Failures:");
  console.dir(clusters, { depth: null });

  // 🔹 Step 3 — Enrich clusters with root cause + deterministic severity
  const finalReport: ClusterAnalysis[] = [];

  for (const cluster of clusters) {
    const rootCause = await runRootCauseAgent(cluster);

    // AI suggestion
    const aiSeverity = await runSeverityAgent(cluster);

    // Deterministic override rules
    const severity = applySeverityRules(cluster, aiSeverity);

    finalReport.push({
      clusterId: cluster.clusterId,
      pattern: cluster.pattern,
      rootCause,
      severity,
      affectedTests: cluster.testNames,
    });
  }

  // 🔹 Step 4 — Calculate severity metrics
  const severityCounts = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };

  for (const cluster of finalReport) {
    severityCounts[cluster.severity]++;
  }

  const totalFailures = finalReport.reduce(
    (acc, cluster) => acc + cluster.affectedTests.length,
    0
  );

  const topPriorityCluster =
    finalReport.find((c) => c.severity === "CRITICAL")?.clusterId ||
    finalReport.find((c) => c.severity === "HIGH")?.clusterId ||
    null;

  // 🔹 Step 5 — Generate executive summary
  const summary = await generateExecutiveSummary(finalReport);

  const executiveReport: QAExecutiveReport = {
    summary,
    totalFailures,
    criticalCount: severityCounts.CRITICAL,
    highCount: severityCounts.HIGH,
    mediumCount: severityCounts.MEDIUM,
    lowCount: severityCounts.LOW,
    topPriorityCluster,
    clusters: finalReport,
  };

  // 🔹 Load previous report BEFORE saving new one
  const previousReport = loadLatestReport();

  // 🔹 Save current report
  const filePath = saveReport(executiveReport);
  console.log(`📁 Report saved to: ${filePath}`);

  // 🔹 Compare trend
  const trendInsight = compareReports(previousReport, executiveReport);

  console.log("\n📊 Trend Analysis:");
  console.log(trendInsight);


// 🔹 Calculate system risk
const riskScore = calculateRiskScore(executiveReport, trendInsight);
const riskLevel = classifyRisk(riskScore);

console.log("\n📊 System Risk Assessment:");
console.log(`Risk Score: ${riskScore}/100`);
console.log(`Risk Level: ${riskLevel}`);


// 🔹 Generate Jira Ticket
const jiraTicket = await generateJiraTicket(
  executiveReport,
  riskScore
);

console.log("\n🎫 Generated Jira Ticket:");
console.dir(jiraTicket, { depth: null });
// 🔹 Controlled Jira Execution
await handleJiraCreation(jiraTicket, riskScore);



  // 🔹 Human-controlled alert evaluation
  await evaluateAlerts(executiveReport, trendInsight);

  console.log("\n📈 Executive QA Report:");
  console.dir(executiveReport, { depth: null });
}






main().catch((error) => {
  console.error("🚨 SYSTEM ERROR:", error);
});
