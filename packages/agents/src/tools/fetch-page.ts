import { createTool } from "@anvia/core";
import { z } from "zod";
import type { ResearchService } from "../service/types.js";
import { getResearchService } from "../service/index.js";

interface FetchWebPageToolDeps {
  service?: Pick<ResearchService, "fetchPage">;
}

export function createFetchWebPageTool(deps: FetchWebPageToolDeps = {}) {
  const service = deps.service ?? getResearchService();
  return createTool({
    name: "fetchWebPage",
    description:
      "Fetches and extracts clean body text content from accredited carbon registries (Verra, Gold Standard, Puro.earth), regulatory documentation (EU CBAM, POJK, GHG Protocol), and market data sources for deep analysis.",
    inputSchema: z.object({
      url: z
        .string()
        .url()
        .describe("The URL of the webpage or registry document to fetch content from"),
      maxLength: z
        .number()
        .int()
        .positive()
        .optional()
        .default(4000)
        .describe("Maximum character length of the extracted content to return"),
    }),
    execute: async ({ url, maxLength }) => {
      const result = await service.fetchPage(url, { maxLength });
      return JSON.stringify(result, null, 2);
    },
  });
}

export const fetchWebPageTool = createFetchWebPageTool();
