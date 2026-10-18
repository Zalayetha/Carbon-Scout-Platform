import type { EvalCase } from "@anvia/core/evals";
import { supportPolicy } from "../context/support-policy.js";

export type ContainEvalCase = EvalCase<string, string | RegExp> & {
  expected: string | RegExp;
};

export type ExactMatchEvalCase = EvalCase<string, boolean> & {
  expected: boolean;
};

export type AbstentionEvalCase = EvalCase<string, boolean> & {
  expected: boolean;
};

/** 1. Clear Answer case: Evaluated with contains() */
export const clearAnswerCase: ContainEvalCase = {
  id: "clear-answer",
  input:
    "Research 2025-2026 Biochar carbon credit price benchmarks per ton and summarize key market metrics.",
  expected: "$",
  metadata: {
    scenario: "clear-answer",
    description: "Clear benchmark query with verifiable market data ($100-$200/ton)",
  },
};

/** 2. Ambiguous Request case: Evaluated with contains() */
export const ambiguousRequestCase: ContainEvalCase = {
  id: "ambiguous-request",
  input: "Find carbon credit info and make a report.",
  expected: /(scope|clarif|assume|voluntary carbon)/i,
  metadata: {
    scenario: "ambiguous-request",
    description: "Vague request handled by defining assumed scope or seeking clarification",
  },
};

/** 3. No Useful Result case: Evaluated with abstention() */
export const abstentionCases: readonly AbstentionEvalCase[] = [
  {
    id: "no-useful-result",
    input:
      "Find public carbon credit pricing for local private bakery 'PastryZero Bakery' in Jakarta.",
    expected: true,
    retrievalContext: [supportPolicy.text],
    metadata: {
      scenario: "no-useful-result",
      description: "Private entity with no public registry pricing - agent must abstain",
    },
  },
];

/** 4. Source Citation, Clear Answer & Ambiguous Request cases: Evaluated with contains() */
export const containCases: readonly ContainEvalCase[] = [
  clearAnswerCase,
  ambiguousRequestCase,
  {
    id: "source-citation",
    input:
      "Research Biochar carbon credit prices and include source URLs in output/carbon_scout_report.md.",
    expected: "https://",
    metadata: {
      scenario: "source-citation",
      description: "Generated output or report file contains valid HTTPS source URLs",
    },
  },
];

/** 5. Report File Created case: Evaluated with exactMatch() */
export const exactMatchCases: readonly ExactMatchEvalCase[] = [
  {
    id: "report-file-created",
    input:
      "Research Biochar carbon credit prices and save the report to output/carbon_scout_report.md.",
    expected: true,
    metadata: {
      scenario: "report-file-created",
      description: "Asserts output/carbon_scout_report.md exists and is non-empty in sandbox",
    },
  },
];

/** All 5 evaluation cases across all scenarios */
export const carbonScoutEvalCases = [
  clearAnswerCase,
  ambiguousRequestCase,
  ...abstentionCases,
  ...containCases,
  ...exactMatchCases,
];
