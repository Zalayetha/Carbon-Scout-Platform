import { exactMatch, runEvalCli } from "@anvia/core/evals";
import { createAgent } from "../agent.js";
import { lens } from "../lens.js";
import { exactMatchCases } from "./cases.js";
import { createEvalTarget } from "./target.js";

const agent = createAgent();
const target = createEvalTarget(agent);

console.log("\n[1/1] Running Report File Created Eval (report-file-created)...");
const evalResult = await runEvalCli({
  name: "report-file-created-exact-match-eval",
  cases: exactMatchCases,
  target,
  metrics: [exactMatch()],
  format: "pretty",
  exitCode: true,
  reporters: [lens.evalReporter({ includePayloads: true })],
});

console.log(evalResult.results);
lens.flush();
