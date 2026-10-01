// Mock configuration - stored in memory only
export interface YouTubeSearchConfig {
  id?: number;
  keywords?: string[];
  channelIds?: string[];
  languages?: string[];
  maxResults?: number;
  lastSearchAt?: Date | null;
}

let mockConfig: YouTubeSearchConfig = {
  id: 1,
  keywords: [],
  channelIds: [],
  languages: ['es', 'en'],
  maxResults: 2,
  lastSearchAt: undefined,
};

export async function getSearchConfig(): Promise<YouTubeSearchConfig> {
  return { ...mockConfig };
}

export async function saveSearchConfig(config: Partial<YouTubeSearchConfig>): Promise<YouTubeSearchConfig> {
  mockConfig = { ...mockConfig, ...config };
  return mockConfig;
}
