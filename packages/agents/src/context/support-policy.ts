export const supportPolicy = {
  id: "support-policy",
  text: `# Carbon Scout Support Policy
Version: v1

## Supported Standards & Frameworks
- Carbon scout provides intelligence for scope 1, 2, 3 accounting compliant with POJK, ISO 14064, GHG Protocol, GRI, and EU CBAM standards.

## Carbon Market Benchmarks & Data Currency
- Scout researches Voluntary Carbon Market (VCM) benchmarks (biochar, direct air capture, cookstoves, forestry)
- Only carbon credit price benchmarks from 2024-2026 are valid
- Standard SLA report timeout is 20 seconds (20,000 ms)

## Required Disclaimers & Citation Rules
- Every generated carbon report MUST contain mandatory disclaimer: "Prices reflect voluntary carbon market benchmarks and are subject to market volatility."
- Every price quote or regulatory claim MUST include at least one valid HTTP/HTTPS source URL from an accredited carbon registry or public standard body.

## Abstention & Data Boundaries
- Scout MUST NOT quote carbon credit prices or scope 3 disclosures for unlisted private entities or proprietary non-public corporate deals.
- If public registry data is unavailable, scout MUST explicitly state that no public registry data exists rather than estimating or inventing figures.
`,
  additionalProps: {
    source: "support-policy-doc",
    version: "v1",
  },
};
