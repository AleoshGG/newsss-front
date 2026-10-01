'use server';

import { revalidatePath } from 'next/cache';
import { gqlFetch } from '@/lib/graphql-client';
import { FETCH_AND_SAVE_YOUTUBE_VIDEOS } from '@/lib/graphql-queries';
import { getSearchConfig } from './data/youtube.config.db';

export async function syncYouTubeVideos(shouldRevalidate = true): Promise<void> {
  await gqlFetch(FETCH_AND_SAVE_YOUTUBE_VIDEOS);
  
  if (shouldRevalidate) {
    revalidatePath('/');
  }
}

import { saveSearchConfig } from './data/youtube.config.db';

export async function updateSearchConfigAction(_prevState: unknown, formData: FormData): Promise<void> {
  const keywordsStr = formData.get('keywords') as string;
  const keywords = keywordsStr ? keywordsStr.split(',').filter(k => k.trim() !== '') : [];
  const channelIds = formData.getAll('channelIds') as string[];
  const languages = formData.getAll('languages') as string[];
  const maxResults = parseInt(formData.get('maxResults') as string, 10) || 5;

  await saveSearchConfig({
    keywords,
    channelIds,
    languages,
    maxResults
  });
  
  revalidatePath('/settings');
}

export async function getLastSearchAtAction(): Promise<Date | null> {
  const config = await getSearchConfig();
  return config.lastSearchAt ? new Date(config.lastSearchAt) : null;
}
