import type {
  FetchPageOptions,
  FetchPageResponse,
  ResearchService,
  SearchOptions,
  SearchResponse,
} from "./types.js";

const MOCK_PAGES: Record<string, string> = {
  "https://puro.earth/carbon-removal-benchmarks": `Puro.earth Standard: 2024-2026 Carbon Dioxide Removal (CDR) Market Benchmarks
Biochar Carbon Removal Certificates (CORCs) traded between €120 - €195 per metric ton of CO2 equivalent ($130 - $210/tCO2e).
Engineered Direct Air Capture (DAC) credits averaged between $450 - $750 per metric ton with high permanence durability (>1000 years).`,
  "https://verra.org/vcs-forestry-pricing": `Verra Verified Carbon Standard (VCS): Afforestation, Reforestation, and Revegetation (ARR) & REDD+ Market Updates
Voluntary carbon market pricing for verified ARR removal credits ranged from $10 - $24 per tCO2e across 2024-2026 vintages.`,
  "https://goldstandard.org/cookstoves-vcm": `Gold Standard Foundation: Clean Cooking Solution Carbon Credits
High-integrity clean cookstove credit benchmarks averaged $7.50 - $14.00 per ton in 2024-2026, delivering verified SDG co-benefits.`,
};

export const mockResearchService: ResearchService = {
  search: async (query: string, options: SearchOptions = {}): Promise<SearchResponse> => {
    const q = query.toLowerCase();
    const limit = options.maxResults ?? 5;

    let mockResults = [
      {
        title: "Puro.earth Biochar & Engineered CDR Market Pricing Report (2024-2026)",
        url: "https://puro.earth/carbon-removal-benchmarks",
        content:
          "Verified Biochar CORC benchmarks traded between $130 - $210 per tCO2e across 2024-2026 European and North American facilities. High durability (>100+ years).",
        score: 0.98,
        publishedDate: "2026-01-15",
      },
      {
        title: "Direct Air Capture (DAC) Carbon Removal Cost Curves and Corporate Offsets",
        url: "https://puro.earth/dac-market-intelligence",
        content:
          "Direct Air Capture (DAC) benchmark pricing for voluntary corporate offsetting transactions ranged from $450 - $800 per metric ton of CO2 removed.",
        score: 0.95,
        publishedDate: "2026-02-10",
      },
      {
        title: "Verra VCS Forestry and ARR (Afforestation/Reforestation) Pricing Index",
        url: "https://verra.org/vcs-forestry-pricing",
        content:
          "VCS-certified Forestry and Nature-Based ARR carbon credit benchmarks traded between $9 - $25 per tCO2e for 2024-2026 issuance vintages.",
        score: 0.92,
        publishedDate: "2026-03-01",
      },
      {
        title: "Gold Standard Clean Cookstoves and Household Energy Credits",
        url: "https://goldstandard.org/cookstoves-vcm",
        content:
          "Clean cookstoves VCM benchmarks maintained pricing between $7 - $14 per tCO2e, incorporating audited SDG health and gender impact metrics.",
        score: 0.9,
        publishedDate: "2026-02-20",
      },
      {
        title: "EU CBAM & POJK Scope 1, 2, 3 Emissions Accounting Guidelines",
        url: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en",
        content:
          "European Union Carbon Border Adjustment Mechanism (EU CBAM) and Indonesia OJK (POJK) regulatory standards require rigorous Scope 1 direct and Scope 2 indirect energy emissions reporting.",
        score: 0.88,
        publishedDate: "2026-01-05",
      },
    ];

    if (q.includes("biochar")) {
      mockResults = mockResults.filter(
        (r) =>
          r.title.toLowerCase().includes("biochar") || r.content.toLowerCase().includes("biochar"),
      );
    } else if (q.includes("dac") || q.includes("direct air capture")) {
      mockResults = mockResults.filter(
        (r) =>
          r.title.toLowerCase().includes("dac") ||
          r.content.toLowerCase().includes("dac") ||
          r.content.toLowerCase().includes("direct air capture"),
      );
    } else if (q.includes("forest") || q.includes("arr")) {
      mockResults = mockResults.filter(
        (r) =>
          r.title.toLowerCase().includes("forest") ||
          r.content.toLowerCase().includes("forestry") ||
          r.content.toLowerCase().includes("arr"),
      );
    } else if (q.includes("cookstove")) {
      mockResults = mockResults.filter(
        (r) =>
          r.title.toLowerCase().includes("cookstove") ||
          r.content.toLowerCase().includes("cookstove"),
      );
    } else if (q.includes("cbam") || q.includes("pojk") || q.includes("scope")) {
      mockResults = mockResults.filter(
        (r) =>
          r.title.toLowerCase().includes("cbam") ||
          r.content.toLowerCase().includes("cbam") ||
          r.title.toLowerCase().includes("scope"),
      );
    }

    return {
      answer: `Found ${mockResults.length} voluntary carbon market intelligence benchmarks for "${query}".`,
      results: mockResults.slice(0, limit),
    };
  },

  fetchPage: async (url: string, options: FetchPageOptions = {}): Promise<FetchPageResponse> => {
    const content =
      MOCK_PAGES[url] ??
      `Registry document content for: ${url}\n\nThis publication outlines voluntary carbon market (VCM) methodologies, carbon removal credits, and ESG compliance frameworks (POJK, ISO 14064, GHG Protocol, EU CBAM).`;
    const trimmed =
      options.maxLength && content.length > options.maxLength
        ? content.slice(0, options.maxLength) + "\n\n...[Content truncated for length]"
        : content.trim();

    return {
      url,
      content: trimmed,
    };
  },
};
