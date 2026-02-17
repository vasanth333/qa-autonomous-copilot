import { ChatOpenAI } from "@langchain/openai";
import { FailureCluster } from "../types/triageTypes.js";

export async function runRootCauseAgent(
  cluster: FailureCluster
): Promise<string> {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  });

  const prompt = `
You are a QA root cause analysis specialist.

Cluster Pattern:
${cluster.pattern}

Affected Tests:
${cluster.testNames.join(", ")}

Provide a concise root cause explanation.
Do not speculate beyond the pattern.
`;

  const response = await model.invoke(prompt);

  return typeof response.content === "string"
    ? response.content
    : JSON.stringify(response.content);
}
