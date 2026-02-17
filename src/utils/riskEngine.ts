import { QAExecutiveReport } from "../types/triageTypes.js";

export function calculateRiskScore(
  report: QAExecutiveReport,
  trendInsight: string
): number {

  let score = 0;

  score += report.criticalCount * 40;
  score += report.highCount * 20;
  score += report.mediumCount * 10;
  score += report.lowCount * 5;

  if (trendInsight.includes("increased")) {
    score += 20;
  }

  if (score > 100) score = 100;

  return score;
}

export function classifyRisk(score: number): string {
  if (score >= 80) return "SYSTEM AT RISK";
  if (score >= 50) return "HIGH RISK";
  if (score >= 25) return "MODERATE RISK";
  return "LOW RISK";
}
