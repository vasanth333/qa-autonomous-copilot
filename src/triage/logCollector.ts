import { TestLog } from "../types/triageTypes.js";

export function collectLogs(rawLogs: string[]): TestLog[] {
  return rawLogs.map((log, index) => {
    return {
      testName: `Test-${index + 1}`,
      errorMessage: log,
      environment: "staging",
      timestamp: new Date().toISOString(),
    };
  });
}
