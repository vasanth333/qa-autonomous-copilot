import { FailureCluster } from "../types/triageTypes.js";

export function applySeverityRules(
  cluster: FailureCluster,
  aiSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {

  const pattern = cluster.pattern.toLowerCase();

  // 🔹 Hard override rules
  if (pattern.includes("login")) {
    return "HIGH";
  }

  if (pattern.includes("payment")) {
    return "CRITICAL";
  }

  if (pattern.includes("timeout")) {
    return "HIGH";
  }

  return aiSeverity;
}
