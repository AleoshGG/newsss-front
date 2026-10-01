import { gqlFetch } from '@/lib/graphql-client';
import { GET_GITHUB_CONFIG } from '@/lib/graphql-queries';

interface GithubSearchConfig {
  id?: number;
  keywords?: string[];
  daysActive?: number;
  minStars?: number;
  minForks?: number;
  requireLicense?: boolean;
  selectedTopics?: string[];
  selectedLanguages?: string[];
  maxResults?: number;
  lastSearchAt?: Date | null;
}

export async function getGithubSearchConfig(): Promise<GithubSearchConfig> {
  const data = await gqlFetch<{ getGithubConfig: GithubSearchConfig }>(
    GET_GITHUB_CONFIG
  );
  return data.getGithubConfig;
}

import { UPDATE_GITHUB_CONFIG } from '@/lib/graphql-queries';

export async function updateGithubSearchConfig(
  data: Partial<GithubSearchConfig>
) {
  const inputConfig = {
    keywords: data.keywords || [],
    daysActive: data.daysActive ?? 2,
    minStars: data.minStars ?? 50,
    minForks: data.minForks ?? 10,
    requireLicense: data.requireLicense ?? false,
    selectedTopics: data.selectedTopics || [],
    selectedLanguages: data.selectedLanguages || [],
    maxResults: data.maxResults ?? 50,
  };

  const response = await gqlFetch<{ updateGithubConfig: GithubSearchConfig }>(
    UPDATE_GITHUB_CONFIG,
    { config: inputConfig }
  );
  
  return response.updateGithubConfig;
}
