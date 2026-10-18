import type { EvalCase } from "@anvia/core/evals";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { createAgent } from "../agent.js";

/**
 * Creates an evaluation target function that invokes the agent and:
 * - Returns boolean true/false for 'report-file-created' by verifying the output file
 * - Returns chat response combined with report file content for 'source-citation'
 * - Returns conversational chat response for clear-answer, ambiguous-request, and abstention cases
 */
export function createEvalTarget(agent: ReturnType<typeof createAgent>) {
  return async (input: string, testCase: EvalCase<string, unknown>): Promise<string | boolean> => {
    // 1. Invoke the agent
    const response = await agent.generate({ prompt: input });
    let chatResponse = "";

    if ("output" in response && typeof response.output === "string") {
      chatResponse = response.output;
    } else if ("output" in response && response.output !== undefined) {
      chatResponse = JSON.stringify(response.output);
    }

    // Helper: Read report file from output directory
    let reportFileContent = "";
    let reportFileExists = false;
    const reportPath = path.resolve(process.cwd(), "output/carbon_scout_report.md");

    try {
      const content = await fs.readFile(reportPath, "utf8");
      if (content.trim().length > 0) {
        reportFileContent = content;
        reportFileExists = true;
      }
    } catch {
      // File may not exist
    }

    // 2. Scenario-specific target return values:
    if (testCase.id === "report-file-created") {
      return reportFileExists;
    }

    if (testCase.id === "source-citation") {
      return [chatResponse, reportFileContent].filter(Boolean).join("\n\n");
    }

    return chatResponse;
  };
}
