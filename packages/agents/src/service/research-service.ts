import { tavily } from "@tavily/core";
import type {
  FetchPageOptions,
  FetchPageResponse,
  ResearchService,
  SearchOptions,
  SearchResponse,
} from "./types.js";

function extractTextFromHtml(html: string): string {
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  clean = clean.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "");
  clean = clean.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "");

  clean = clean.replace(/<\/(p|div|h[1-6]|li|tr|article|section)>/gi, "\n");
  clean = clean.replace(/<br\s*[/]?>/gi, "\n");

  clean = clean.replace(/<[^>]+>/g, " ");

  clean = clean
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return clean
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

export const liveResearchService: ResearchService = {
  search: async (query: string, options: SearchOptions = {}): Promise<SearchResponse> => {
    try {
      const apiKey = process.env.TAVILY_API_KEY;
      if (!apiKey) {
        throw new Error("TAVILY_API_KEY environment variable is missing.");
      }
      const client = tavily({ apiKey });
      const response = await client.search(query, {
        maxResults: options.maxResults ?? 5,
        topic: options.topic ?? "general",
        includeAnswer: true,
        searchDepth: "basic",
      });

      return {
        answer: response.answer ?? null,
        results: response.results.map((item) => ({
          title: item.title,
          url: item.url,
          content: item.content,
          score: item.score ?? undefined,
          publishedDate: item.publishedDate ?? undefined,
        })),
      };
    } catch (error) {
      return {
        answer: null,
        results: [],
        error:
          error instanceof Error ? error.message : "Failed to execute carbon market web search",
      };
    }
  },

  fetchPage: async (url: string, options: FetchPageOptions = {}): Promise<FetchPageResponse> => {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (CarbonScoutBot/1.0; +https://github.com/carbon-scout)",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        return {
          url,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const html = await response.text();
      let text = extractTextFromHtml(html);

      if (options.maxLength && text.length > options.maxLength) {
        text = text.slice(0, options.maxLength) + "\n\n...[Content truncated for length]";
      }

      return {
        url,
        content: text,
      };
    } catch (error) {
      return {
        url,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch carbon registry / standard webpage content",
      };
    }
  },
};
