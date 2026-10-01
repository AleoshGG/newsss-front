// Mock configuration - stored in memory only
interface GithubSearchConfig {
  id?: number;
  keywords?: string | string[];
  daysActive?: number;
  minStars?: number;
  minForks?: number;
  requireLicense?: boolean;
  selectedTopics?: string | string[];
  selectedLanguages?: string | string[];
  maxResults?: number;
  lastSearchAt?: Date | null;
}

let mockConfig: GithubSearchConfig = {
  id: 1,
  keywords: '[]',
  daysActive: 0,
  minStars: 0,
  minForks: 0,
  requireLicense: false,
  selectedTopics: '[]',
  selectedLanguages: '[]',
  maxResults: 50,
  lastSearchAt: undefined,
};

export async function getGithubSearchConfig(): Promise<GithubSearchConfig> {
  return { ...mockConfig };
}

export async function updateGithubSearchConfig(data: Partial<GithubSearchConfig>) {
  mockConfig = { ...mockConfig, ...data };
  return mockConfig;
}
