import { abstention, contains, exactMatch, runEvalCli } from "@anvia/core/evals";
import { createAgent } from "../agent.js";
import { lens } from "../lens.js";
import { getModel } from "../model.js";
import { abstentionCases, containCases, exactMatchCases } from "./cases.js";
import { createEvalTarget } from "./target.js";

const agent = createAgent();
const target = createEvalTarget(agent);

console.log("=== Running Carbon Scout Evaluations ===");

// 1. Abstention for 'no-useful-result'
console.log("\n[1/3] Running Abstention Eval (no-useful-result)...");
await runEvalCli({
  name: "abstention-eval",
  cases: abstentionCases,
  target,
  metrics: [
    abstention({
      model: getModel(),
      shouldAbstain: ({ case: testCase }) => testCase.expected === true,
    }),
  ],
  format: "pretty",
  exitCode: false,
  reporters: [lens.evalReporter({ includePayloads: true })],
});

// 2. Contains Evals ('clear-answer', 'ambiguous-request', & 'source-citation')
console.log(
  "\n[2/3] Running Contain Evals (clear-answer, ambiguous-request, & source-citation)...",
);
await runEvalCli({
  name: "contain-eval",
  cases: containCases,
  target,
  metrics: [contains()],
  format: "pretty",
  exitCode: false,
  reporters: [lens.evalReporter({ includePayloads: true })],
});

// 3. Exact Match for 'report-file-created'
console.log("\n[3/3] Running Report File Created Eval (report-file-created)...");
const finalResult = await runEvalCli({
  name: "report-file-created-exact-match-eval",
  cases: exactMatchCases,
  target,
  metrics: [exactMatch()],
  format: "pretty",
  exitCode: true,
  reporters: [lens.evalReporter({ includePayloads: true })],
});

console.log(finalResult.results);
lens.flush();
