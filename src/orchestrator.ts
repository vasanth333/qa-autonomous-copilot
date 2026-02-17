import { collectLogs } from "./triage/logCollector.js";
import { runClusteringAgent } from "./triage/clusteringAgent.js";
import { runRootCauseAgent } from "./triage/rootCauseAgent.js";
import { runSeverityAgent } from "./triage/severityAgent.js";
import { generateExecutiveSummary } from "./triage/executiveSummaryAgent.js";

import { applySeverityRules } from "./utils/severityRules.js";
import { calculateRiskScore } from "./utils/riskEngine.js";
import { compareReports } from "./utils/trendAnalyzer.js";
import { loadLatestReport } from "./utils/reportStorage.js";

import {
  ClusterAnalysis,
  QAExecutiveReport,
} from "./types/triageTypes.js";

export async function runMultiAgentSystem(
  rawLogs: string[]
) {
  // Step 1 — Normalize logs
  const structuredLogs = collectLogs(rawLogs);

  // Step 2 — Cluster failures
  const clusters = await runClusteringAgent(structuredLogs);

  const finalClusters: ClusterAnalysis[] = [];

  // Step 3 — Enrich clusters
  for (const cluster of clusters) {
    const rootCause = await runRootCauseAgent(cluster);
    const aiSeverity = await runSeverityAgent(cluster);
    const severity = applySeverityRules(cluster, aiSeverity);

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

  const totalFailures = finalClusters.reduce(
    (acc, cluster) => acc + cluster.affectedTests.length,
    0
  );

  const topPriorityCluster =
    finalClusters.find(c => c.severity === "CRITICAL")?.clusterId ||
    finalClusters.find(c => c.severity === "HIGH")?.clusterId ||
    null;

  // Step 5 — Executive summary
  const summary = await generateExecutiveSummary(finalClusters);

  const executiveReport: QAExecutiveReport = {
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
  const previousReport = loadLatestReport();
  const trendInsight = compareReports(previousReport, executiveReport);

  // ✅ Step 7 — Risk scoring (FIXED: pass both arguments)
  const riskScore = calculateRiskScore(
    executiveReport,
    trendInsight
  );

  return {
    executiveReport,
    trendInsight,
    riskScore,
  };
}
