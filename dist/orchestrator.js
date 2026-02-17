"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMultiAgentSystem = runMultiAgentSystem;
const logCollector_js_1 = require("./triage/logCollector.js");
const clusteringAgent_js_1 = require("./triage/clusteringAgent.js");
const rootCauseAgent_js_1 = require("./triage/rootCauseAgent.js");
const severityAgent_js_1 = require("./triage/severityAgent.js");
const executiveSummaryAgent_js_1 = require("./triage/executiveSummaryAgent.js");
const severityRules_js_1 = require("./utils/severityRules.js");
const riskEngine_js_1 = require("./utils/riskEngine.js");
const trendAnalyzer_js_1 = require("./utils/trendAnalyzer.js");
const reportStorage_js_1 = require("./utils/reportStorage.js");
async function runMultiAgentSystem(rawLogs) {
    // Step 1 — Normalize logs
    const structuredLogs = (0, logCollector_js_1.collectLogs)(rawLogs);
    // Step 2 — Cluster failures
    const clusters = await (0, clusteringAgent_js_1.runClusteringAgent)(structuredLogs);
    const finalClusters = [];
    // Step 3 — Enrich clusters
    for (const cluster of clusters) {
        const rootCause = await (0, rootCauseAgent_js_1.runRootCauseAgent)(cluster);
        const aiSeverity = await (0, severityAgent_js_1.runSeverityAgent)(cluster);
        const severity = (0, severityRules_js_1.applySeverityRules)(cluster, aiSeverity);
        finalClusters.push({
            clusterId: cluster.clusterId,
            pattern: cluster.pattern,
            rootCause,
            severity,
            affectedTests: cluster.testNames,
        });
    }
    // Step 4 — Severity counts
    const severityCounts = {
        CRITICAL: finalClusters.filter(c => c.severity === "CRITICAL").length,
        HIGH: finalClusters.filter(c => c.severity === "HIGH").length,
        MEDIUM: finalClusters.filter(c => c.severity === "MEDIUM").length,
        LOW: finalClusters.filter(c => c.severity === "LOW").length,
    };
    const totalFailures = finalClusters.reduce((acc, cluster) => acc + cluster.affectedTests.length, 0);
    const topPriorityCluster = finalClusters.find(c => c.severity === "CRITICAL")?.clusterId ||
        finalClusters.find(c => c.severity === "HIGH")?.clusterId ||
        null;
    // Step 5 — Executive summary
    const summary = await (0, executiveSummaryAgent_js_1.generateExecutiveSummary)(finalClusters);
    const executiveReport = {
        summary,
        totalFailures,
        criticalCount: severityCounts.CRITICAL,
        highCount: severityCounts.HIGH,
        mediumCount: severityCounts.MEDIUM,
        lowCount: severityCounts.LOW,
        topPriorityCluster,
        clusters: finalClusters,
    };
    // Step 6 — Trend comparison
    const previousReport = (0, reportStorage_js_1.loadLatestReport)();
    const trendInsight = (0, trendAnalyzer_js_1.compareReports)(previousReport, executiveReport);
    // ✅ Step 7 — Risk scoring (FIXED: pass both arguments)
    const riskScore = (0, riskEngine_js_1.calculateRiskScore)(executiveReport, trendInsight);
    return {
        executiveReport,
        trendInsight,
        riskScore,
    };
}
