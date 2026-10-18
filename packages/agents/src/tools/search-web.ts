import { createTool } from "@anvia/core";
import { z } from "zod";
import type { ResearchService } from "../service/types.js";
import { getResearchService } from "../service/index.js";

interface SearchWebToolDeps {
  service?: Pick<ResearchService, "search">;
}

export function createSearchWebTool(deps: SearchWebToolDeps = {}) {
  const service = deps.service ?? getResearchService();
  return createTool({
    name: "searchWeb",
    description:
      "Search the web using Tavily Search API for up-to-date Voluntary Carbon Market (VCM) pricing benchmarks (Biochar, DAC, Forestry, Cookstoves), ESG regulatory frameworks (POJK, EU CBAM, GHG Protocol, ISO 14064, GRI), and accredited registry publications (Verra, Gold Standard, Puro.earth).",
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          "The carbon market, registry, or ESG regulatory search query string (e.g., 'Biochar CORC pricing benchmarks 2025' or 'EU CBAM Scope 1 2 reporting rules')",
        ),
      maxResults: z
        .number()
        .int()
        .positive()
        .max(10)
        .optional()
        .default(5)
        .describe("Maximum number of search results to return (default: 5)"),
      topic: z
        .enum(["general", "news", "finance"])
        .optional()
        .default("general")
        .describe("The search domain category (default: general)"),
    }),
    execute: async ({ query, maxResults, topic }) => {
      const result = await service.search(query, { maxResults, topic });
      return JSON.stringify(result, null, 2);
    },
  });
}

export const searchWebTool = createSearchWebTool();
