import { gqlFetch } from '@/lib/graphql-client';
import { GET_YOUTUBE_CONFIG } from '@/lib/graphql-queries';

export interface YouTubeSearchConfig {
  id?: number;
  keywords?: string[];
  channelIds?: string[];
  languages?: string[];
  maxResults?: number;
  lastSearchAt?: Date | null;
}

export async function getSearchConfig(): Promise<YouTubeSearchConfig> {
  const data = await gqlFetch<{ getYoutubeConfig: YouTubeSearchConfig }>(
    GET_YOUTUBE_CONFIG
  );
  return data.getYoutubeConfig;
}

import { UPDATE_YOUTUBE_CONFIG } from '@/lib/graphql-queries';

// Stub: write-back pending a Mutation endpoint in the backend
export async function saveSearchConfig(
  config: Partial<YouTubeSearchConfig>
): Promise<YouTubeSearchConfig> {
  const inputConfig = {
    keywords: config.keywords || [],
    channelIds: config.channelIds || [],
    languages: config.languages || [],
    maxResults: config.maxResults || 5,
  };

  const data = await gqlFetch<{ updateYoutubeConfig: YouTubeSearchConfig }>(
    UPDATE_YOUTUBE_CONFIG,
    { config: inputConfig }
  );

  return data.updateYoutubeConfig;
}
