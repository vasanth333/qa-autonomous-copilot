export interface TestLog {
  testName: string;
  errorMessage: string;
  environment: string;
  timestamp: string;
}

export interface FailureCluster {
  clusterId: string;
  pattern: string;
  testNames: string[];
}

export interface ClusterAnalysis {
  clusterId: string;
  pattern: string;
  rootCause: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  affectedTests: string[];
}

export interface QAExecutiveReport {
  summary: string;
  totalFailures: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  topPriorityCluster: string | null;
  clusters: ClusterAnalysis[];
}

export interface JiraTicket {
  title: string;
  description: string;
  impact: string;
  acceptanceCriteria: string[];
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}
