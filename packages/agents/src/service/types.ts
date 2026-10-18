export interface SearchResultItem {
  title: string;
  url: string;
  content: string;
  score?: number;
  publishedDate?: string;
}

export interface SearchOptions {
  maxResults?: number;
  topic?: "general" | "news" | "finance";
}

export interface FetchPageOptions {
  maxLength?: number;
}

export interface SearchResponse {
  answer?: string | null;
  results: SearchResultItem[];
  error?: string;
}

export interface FetchPageResponse {
  url: string;
  content?: string;
  error?: string;
}

export interface ResearchService {
  search(query: string, options?: SearchOptions): Promise<SearchResponse>;
  fetchPage(url: string, options?: FetchPageOptions): Promise<FetchPageResponse>;
}
