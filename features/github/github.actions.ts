'use server';

import { revalidatePath } from 'next/cache';
import { updateGithubSearchConfig } from './data/github.config.db';

export async function saveGithubConfigAction(data: {
  keywords: string;
  daysActive: number;
  minStars: number;
  minForks: number;
  requireLicense: boolean;
  selectedTopics: string;
  selectedLanguages: string;
  maxResults: number;
}) {
  await updateGithubSearchConfig(data);
  revalidatePath('/');
  return { success: true };
}

import { syncGithubRepos } from './github.controller';
import { getGithubSearchConfig } from './data/github.config.db';

export async function syncGithubReposAction() {
  await syncGithubRepos(true); // force sync if clicked manually (though client checks timer)
  revalidatePath('/');
}

export async function getGithubLastSearchAtAction() {
  const config = await getGithubSearchConfig();
  return config.lastSearchAt ? config.lastSearchAt.toISOString() : null;
}
