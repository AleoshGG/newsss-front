import { gqlFetch } from '@/lib/graphql-client';
import { GET_GOOGLE_NEWS_CONFIG } from '@/lib/graphql-queries';

export interface GoogleNewsConfig {
  id?: number;
  q?: string;
  hl?: string;
  gl?: string;
  ceid?: string;
  when?: string;
  site?: string | null;
  intitle?: string | null;
  maxResults?: number;
  lastSearchAt?: Date | null;
}

export async function getGoogleNewsConfig(): Promise<GoogleNewsConfig> {
  const data = await gqlFetch<{ getGoogleNewsConfig: GoogleNewsConfig }>(
    GET_GOOGLE_NEWS_CONFIG
  );
  return data.getGoogleNewsConfig;
}

import { UPDATE_GOOGLE_NEWS_CONFIG } from '@/lib/graphql-queries';

export async function updateGoogleNewsConfig(
  data: Partial<GoogleNewsConfig>
): Promise<GoogleNewsConfig> {
  const inputConfig = {
    q: data.q || '',
    hl: data.hl || 'es-419',
    gl: data.gl || 'MX',
    ceid: data.ceid || 'MX:es-419',
    when: data.when || '1d',
    site: data.site || null,
    intitle: data.intitle || null,
    maxResults: data.maxResults ?? 100,
  };

  const response = await gqlFetch<{ updateGoogleNewsConfig: GoogleNewsConfig }>(
    UPDATE_GOOGLE_NEWS_CONFIG,
    { config: inputConfig }
  );
  
  return response.updateGoogleNewsConfig;
}
