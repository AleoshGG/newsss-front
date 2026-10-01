'use server';

import { revalidatePath } from 'next/cache';
import { updateGoogleNewsConfig } from './data/googlenews.config.db';

export async function saveGoogleNewsConfigAction(formData: FormData) {
  try {
    const q = formData.get('q') as string;
    const hl = formData.get('hl') as string;
    const gl = formData.get('gl') as string;
    const ceid = formData.get('ceid') as string;
    const when = formData.get('when') as string;
    const site = formData.get('site') as string;
    const intitle = formData.get('intitle') as string;
    const maxResults = parseInt(formData.get('maxResults') as string, 10) || 50;

    await updateGoogleNewsConfig({
      q,
      hl,
      gl,
      ceid,
      when,
      site,
      intitle,
      maxResults
    });

    revalidatePath('/settings');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error saving Google News config:', error);
    return { success: false, error: 'Failed to save configuration' };
  }
}

import { fetchGoogleNewsRSS } from './data/googlenews.fetcher';

export async function syncGoogleNewsArticlesAction(shouldRevalidate = true) {
  try {
    const articles = await fetchGoogleNewsRSS();
    
    // Note: Articles are fetched but not persisted - only visual display is supported
    // For persistence, call the API endpoints instead
    
    // Update lastSearchAt
    await updateGoogleNewsConfig({ lastSearchAt: new Date() });
    
    if (shouldRevalidate) {
      revalidatePath('/');
    }
    
    return { success: true, count: articles.length };
  } catch (error) {
    console.error('Error syncing Google News articles:', error);
    return { success: false, error: 'Failed to sync articles' };
  }
}
