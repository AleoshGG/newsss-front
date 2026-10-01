import { getGithubSearchConfig, updateGithubSearchConfig } from './data/github.config.db';
import { GitHubData } from './data/github.entity';

export async function syncGithubRepos(force = false) {
  const config = await getGithubSearchConfig();

  // 1 hour throttle
  if (!force && config.lastSearchAt) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (new Date(config.lastSearchAt) > oneHourAgo) {
      console.log('Skipping GitHub sync, last search was less than an hour ago.');
      return { status: 'skipped', reason: 'throttled' };
    }
  }

  // Config arrays come directly from the API as string[] (no JSON.parse needed)
  const keywords: string[] = Array.isArray(config.keywords) ? config.keywords : [];
  const topics: string[] = Array.isArray(config.selectedTopics) ? config.selectedTopics : [];
  const languages: string[] = Array.isArray(config.selectedLanguages) ? config.selectedLanguages : [];

  // Build base query constraints
  const baseQueryParts = [];
  if ((config.minStars || 0) > 0) baseQueryParts.push(`stars:>=${config.minStars}`);
  if ((config.minForks || 0) > 0) baseQueryParts.push(`forks:>=${config.minForks}`);
  if ((config.daysActive || 0) > 0) {
    const activeDate = new Date();
    activeDate.setDate(activeDate.getDate() - (config.daysActive || 0));
    baseQueryParts.push(`pushed:>=${activeDate.toISOString().split('T')[0]}`);
  }

  // GitHub search limits OR operators to 5. We take up to 5 keywords for the API query.
  let keywordQuery = '';
  if (keywords.length > 0) {
    const apiKeywords = keywords.slice(0, 5);
    // If only one, no parenthesis needed. If multiple, group them so they don't break the AND conditions.
    keywordQuery = apiKeywords.length === 1 ? apiKeywords[0] : `(${apiKeywords.join(' OR ')})`;
  }

  const baseQ = baseQueryParts.join(' ');
  const perPage = config.maxResults || 50;
  
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Newsss-App'
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  let allItems: any[] = [];
  const queriesToRun = [];

  // Si hay topics, hacemos una petición por cada topic porque GitHub no soporta "topic:A OR topic:B"
  // Si pedimos todos en una sola query (topic:A topic:B), GitHub exige que el repo tenga TODOS los topics a la vez.
  if (topics.length > 0) {
    for (const t of topics) {
      const q = [keywordQuery, `topic:${t}`, baseQ].filter(Boolean).join(' ');
      queriesToRun.push(q);
    }
  } else {
    // Si no hay topics, solo corremos una query con los keywords y restricciones base
    const q = [keywordQuery, baseQ].filter(Boolean).join(' ');
    queriesToRun.push(q);
  }

  try {
    // Run all queries concurrently to save time, but map them gracefully
    await Promise.all(queriesToRun.map(async (q) => {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${perPage}`;
      console.log('Fetching from GitHub:', url);
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        console.error(`GitHub API Error for query [${q}]: ${response.status} ${response.statusText}`);
        return; // skip this one if it fails
      }

      const data = await response.json();
      if (data.items) {
        allItems = allItems.concat(data.items);
      }
    }));

    // Deduplicate by repo ID
    const uniqueMap = new Map();
    allItems.forEach(item => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    let items = Array.from(uniqueMap.values());
    console.log(`Found ${items.length} unique items before post-filtering.`);

    // Post-fetch filters
    if (languages.length > 0) {
      items = items.filter((item: any) => 
        item.language && languages.some(l => l.toLowerCase() === item.language.toLowerCase())
      );
    }

    if (config.requireLicense) {
      items = items.filter((item: any) => item.license && item.license.key !== 'other');
    }
    
    // Sort by stars descending and slice to maxResults
    items.sort((a, b) => b.stargazers_count - a.stargazers_count);
    items = items.slice(0, perPage);

    console.log(`After post-fetch filtering and limits: ${items.length} items to save.`);

    // Note: Data is fetched but not persisted - only visual display is supported
    // For persistence, call the API endpoints instead
    
    // Update lastSearchAt
    await updateGithubSearchConfig({
      lastSearchAt: new Date()
    });

    return { status: 'success', count: items.length };
  } catch (error) {
    console.error('Error syncing GitHub repos:', error);
    return { status: 'error', error };
  }
}
