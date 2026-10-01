// Mock configuration - stored in memory only
export interface GoogleNewsConfig {
  id?: number;
  q?: string;
  hl?: string;
  gl?: string;
  ceid?: string;
  when?: string;
  site?: string;
  intitle?: string;
  maxResults?: number;
  lastSearchAt?: Date | null;
}

let mockConfig: GoogleNewsConfig = {
  id: 1,
  q: '',
  hl: 'es',
  gl: 'ES',
  ceid: 'ES:es',
  when: '',
  site: '',
  intitle: '',
  maxResults: 50,
  lastSearchAt: undefined,
};

export async function getGoogleNewsConfig(): Promise<GoogleNewsConfig> {
  return { ...mockConfig };
}

export async function updateGoogleNewsConfig(data: Partial<GoogleNewsConfig>): Promise<GoogleNewsConfig> {
  mockConfig = { ...mockConfig, ...data };
  return mockConfig;
}
