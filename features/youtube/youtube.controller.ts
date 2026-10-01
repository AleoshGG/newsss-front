'use server';

import { revalidatePath } from 'next/cache';
import { fetchAnthropicVideos } from './data/youtube.fetcher';

export async function syncYouTubeVideos(shouldRevalidate = true): Promise<void> {
  // Fetch videos but don't persist them (in-memory only)
  const videos = await fetchAnthropicVideos();
  
  if (shouldRevalidate) {
    revalidatePath('/');
  }
}

export async function updateSearchConfigAction(_prevState: unknown, formData: FormData): Promise<void> {
  // Config is stored in memory only, no persistence needed
  
  revalidatePath('/settings');
}

export async function getLastSearchAtAction(): Promise<Date | null> {
  // No persistent config
  return null;
}
