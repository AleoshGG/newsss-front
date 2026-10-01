import { gqlFetch } from '@/lib/graphql-client';
import { FETCH_AND_SAVE_GITHUB_REPOS } from '@/lib/graphql-queries';

export async function syncGithubRepos(force = false) {
  try {
    await gqlFetch(FETCH_AND_SAVE_GITHUB_REPOS);
    return { status: 'success' };
  } catch (error) {
    console.error('Error syncing GitHub repos:', error);
    return { status: 'error', error };
  }
}
