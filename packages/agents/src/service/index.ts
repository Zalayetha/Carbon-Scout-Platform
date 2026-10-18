import { mockResearchService } from "./mock-research-service.js";
import { liveResearchService } from "./research-service.js";
import type { ResearchService } from "./types.js";

/**
 * Returns either the real or mock research service based on the USE_MOCK_SERVICES env var or availability of TAVILY_API_KEY.
 */
export function getResearchService(): ResearchService {
  if (process.env.USE_MOCK_SERVICES === "true" || !process.env.TAVILY_API_KEY) {
    return mockResearchService;
  }
  return liveResearchService;
}
