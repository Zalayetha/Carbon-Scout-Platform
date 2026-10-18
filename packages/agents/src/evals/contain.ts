import { contains, runEvalCli } from "@anvia/core/evals";
import { createAgent } from "../agent.js";
import { lens } from "../lens.js";
import { containCases } from "./cases.js";
import { createEvalTarget } from "./target.js";

const agent = createAgent();
const target = createEvalTarget(agent);

console.log(
  "\n[1/1] Running Contain Evals (clear-answer, ambiguous-request, & source-citation)...",
);
const evalResult = await runEvalCli({
  name: "source-citation-contain-eval",
  cases: containCases,
  target,
  metrics: [contains()],
  format: "pretty",
  exitCode: true,
  reporters: [lens.evalReporter({ includePayloads: true })],
});

console.log(evalResult.results);
lens.flush();
