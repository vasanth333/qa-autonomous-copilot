import { ChatOpenAI } from "@langchain/openai";
import { ClusterAnalysis } from "../types/triageTypes.js";

export async function generateExecutiveSummary(
  clusters: ClusterAnalysis[]
): Promise<string> {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  });

  const prompt = `
You are a QA executive reporting assistant.

Provide a concise executive summary based on the following failure clusters.

Focus on:
- Overall system health
- Most critical issues
- Priority areas for engineering

Clusters:
${clusters
  .map(
    (c) =>
      `Cluster ${c.clusterId} | Severity: ${c.severity} | Pattern: ${c.pattern}`
  )
  .join("\n")}

Keep summary under 5 sentences.
`;

  const response = await model.invoke(prompt);

  return typeof response.content === "string"
    ? response.content
    : JSON.stringify(response.content);
}
