"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const riskEngine_js_1 = require("./utils/riskEngine.js");
const jiraTicketAgent_js_1 = require("./triage/jiraTicketAgent.js");
const jiraExecutor_js_1 = require("./utils/jiraExecutor.js");
const reportStorage_js_1 = require("./utils/reportStorage.js");
const trendAnalyzer_js_1 = require("./utils/trendAnalyzer.js");
const severityRules_js_1 = require("./utils/severityRules.js");
const alertEngine_js_1 = require("./utils/alertEngine.js");
const logCollector_js_1 = require("./triage/logCollector.js");
const clusteringAgent_js_1 = require("./triage/clusteringAgent.js");
const rootCauseAgent_js_1 = require("./triage/rootCauseAgent.js");
const severityAgent_js_1 = require("./triage/severityAgent.js");
const executiveSummaryAgent_js_1 = require("./triage/executiveSummaryAgent.js");
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
    const structuredLogs = (0, logCollector_js_1.collectLogs)(rawLogs);
    console.log("📦 Structured Logs:");
    console.dir(structuredLogs, { depth: null });
    // 🔹 Step 2 — Cluster failures
    const clusters = await (0, clusteringAgent_js_1.runClusteringAgent)(structuredLogs);
    console.log("📊 Clustered Failures:");
    console.dir(clusters, { depth: null });
    // 🔹 Step 3 — Enrich clusters with root cause + deterministic severity
    const finalReport = [];
    for (const cluster of clusters) {
        const rootCause = await (0, rootCauseAgent_js_1.runRootCauseAgent)(cluster);
        // AI suggestion
        const aiSeverity = await (0, severityAgent_js_1.runSeverityAgent)(cluster);
        // Deterministic override rules
        const severity = (0, severityRules_js_1.applySeverityRules)(cluster, aiSeverity);
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
    const totalFailures = finalReport.reduce((acc, cluster) => acc + cluster.affectedTests.length, 0);
    const topPriorityCluster = finalReport.find((c) => c.severity === "CRITICAL")?.clusterId ||
        finalReport.find((c) => c.severity === "HIGH")?.clusterId ||
        null;
    // 🔹 Step 5 — Generate executive summary
    const summary = await (0, executiveSummaryAgent_js_1.generateExecutiveSummary)(finalReport);
    const executiveReport = {
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
    const previousReport = (0, reportStorage_js_1.loadLatestReport)();
    // 🔹 Save current report
    const filePath = (0, reportStorage_js_1.saveReport)(executiveReport);
    console.log(`📁 Report saved to: ${filePath}`);
    // 🔹 Compare trend
    const trendInsight = (0, trendAnalyzer_js_1.compareReports)(previousReport, executiveReport);
    console.log("\n📊 Trend Analysis:");
    console.log(trendInsight);
    // 🔹 Calculate system risk
    const riskScore = (0, riskEngine_js_1.calculateRiskScore)(executiveReport, trendInsight);
    const riskLevel = (0, riskEngine_js_1.classifyRisk)(riskScore);
    console.log("\n📊 System Risk Assessment:");
    console.log(`Risk Score: ${riskScore}/100`);
    console.log(`Risk Level: ${riskLevel}`);
    // 🔹 Generate Jira Ticket
    const jiraTicket = await (0, jiraTicketAgent_js_1.generateJiraTicket)(executiveReport, riskScore);
    console.log("\n🎫 Generated Jira Ticket:");
    console.dir(jiraTicket, { depth: null });
    // 🔹 Controlled Jira Execution
    await (0, jiraExecutor_js_1.handleJiraCreation)(jiraTicket, riskScore);
    // 🔹 Human-controlled alert evaluation
    await (0, alertEngine_js_1.evaluateAlerts)(executiveReport, trendInsight);
    console.log("\n📈 Executive QA Report:");
    console.dir(executiveReport, { depth: null });
}
main().catch((error) => {
    console.error("🚨 SYSTEM ERROR:", error);
});
