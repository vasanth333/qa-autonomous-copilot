import { ChatOpenAI } from "@langchain/openai";
import { FailureCluster } from "../types/triageTypes.js";

export async function runSeverityAgent(
  cluster: FailureCluster
): Promise<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL"> {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  });

  const prompt = `
You are a QA severity classification expert.

Cluster Pattern:
${cluster.pattern}

Number of affected tests: ${cluster.testNames.length}

Classify severity as one of:
LOW
MEDIUM
HIGH
CRITICAL

Return only one word.
`;

  const response = await model.invoke(prompt);

  const content =
    typeof response.content === "string"
      ? response.content.trim().toUpperCase()
      : "MEDIUM";

  if (["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(content)) {
    return content as any;
  }

  return "MEDIUM";
}
