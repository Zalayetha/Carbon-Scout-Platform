import { abstention, runEvalCli } from "@anvia/core/evals";
import { createAgent } from "../agent.js";
import { lens } from "../lens.js";
import { getModel } from "../model.js";
import { abstentionCases } from "./cases.js";
import { createEvalTarget } from "./target.js";

const agent = createAgent();
const target = createEvalTarget(agent);

console.log("\n[1/1] Running Abstention Eval (no-useful-result)...");
const evalResult = await runEvalCli({
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
  exitCode: true,
  reporters: [lens.evalReporter({ includePayloads: true })],
});

console.log(evalResult.results);
lens.flush();
