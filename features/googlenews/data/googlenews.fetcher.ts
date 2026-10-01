import { XMLParser } from 'fast-xml-parser';
import { getGoogleNewsConfig } from './googlenews.config.db';
import { GoogleNewsArticleData } from './googlenews.entity';
import { JSDOM, VirtualConsole } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { GoogleDecoder } from 'google-news-url-decoder';

interface GoogleNewsItem {
  title?: string;
  link?: string;
  pubDate?: string;
  guid?: string | { '#text'?: string; '@_isPermaLink'?: string };
  source?: string | { '#text'?: string; '@_url'?: string };
}

async function fetchArticleData(url: string): Promise<{ imageUrl?: string, content?: string }> {
  try {
    let finalUrl = url;
    if (url.includes('news.google.com/rss/articles')) {
      try {
        const decoder = new GoogleDecoder();
        const decoded = await decoder.decode(url);
        if (decoded && decoded.status && decoded.decoded_url) {
          finalUrl = decoded.decoded_url;
        }
      } catch (err) {
        console.error("Error decoding Google News URL", url, err);
      }
    }

    const res = await fetch(finalUrl, { redirect: 'follow', signal: AbortSignal.timeout(8000) });
    const html = await res.text();
    
    let imageUrl: string | undefined = undefined;
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) 
                      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i);
    
    if (ogImageMatch && ogImageMatch[1]) {
      imageUrl = ogImageMatch[1];
    }

    let content: string | undefined = undefined;
    try {
      const virtualConsole = new VirtualConsole();
      // Silenciar errores de parseo de CSS y otros del JSDOM
      virtualConsole.on("error", () => { /* no-op */ });
      virtualConsole.on("jsdomError", () => { /* no-op */ });
      
      const dom = new JSDOM(html, { url: res.url, virtualConsole });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();
      if (article && article.textContent) {
        content = article.textContent.trim();
      }
    } catch (err) {
      console.error("Error parsing article content for url", url, err);
    }

    return { imageUrl, content };
  } catch (_err) {
    // ignore
    return {};
  }
}

async function fetchGoogleNewsForLocale(
  query: string, 
  hl: string, 
  gl: string, 
  ceid: string, 
  maxResults: number,
  fetchedAt: Date
): Promise<GoogleNewsArticleData[]> {
  const url = new URL('https://news.google.com/rss/search');
  url.searchParams.set('q', query);
  url.searchParams.set('hl', hl);
  url.searchParams.set('gl', gl);
  url.searchParams.set('ceid', ceid);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      throw new Error(`Google News RSS fetch failed with status: ${res.status}`);
    }

    const xmlText = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonObj = parser.parse(xmlText) as any;
    
    const items = jsonObj?.rss?.channel?.item;
    if (!items) return [];

    const itemArray: GoogleNewsItem[] = Array.isArray(items) ? items : [items];
    
    return itemArray.slice(0, maxResults).map((item) => {
      let id = "";
      if (typeof item.guid === 'object') {
        id = item.guid?.["#text"] || "";
      } else if (typeof item.guid === 'string') {
        id = item.guid;
      }
      if (!id && item.link) id = item.link;

      let sourceName = "";
      let sourceUrl = "";
      if (typeof item.source === 'object') {
        sourceName = item.source?.["#text"] || "";
        sourceUrl = item.source?.["@_url"] || "";
      } else if (typeof item.source === 'string') {
        sourceName = item.source;
      }

      return new GoogleNewsArticleData(
        id,
        item.title || "",
        item.link || "",
        item.pubDate ? new Date(item.pubDate) : new Date(),
        sourceName,
        sourceUrl,
        fetchedAt
      );
    });
  } catch (error) {
    console.error("Error fetching Google News RSS for locale", hl, ":", error);
    return [];
  }
}

export async function fetchGoogleNewsRSS(): Promise<GoogleNewsArticleData[]> {
  const config = await getGoogleNewsConfig();
  
  // Construct the base search query
  let baseQuery = config.q || 'Inteligencia Artificial';
  if (config.site) baseQuery += ` site:${config.site}`;
  if (config.intitle) baseQuery += ` intitle:${config.intitle}`;
  if (config.when) baseQuery += ` when:${config.when}`;

  const maxResults = config.maxResults || 50;
  const fetchedAt = new Date();
  
  // Create an English version of the query if the original is Spanish AI related
  let enQuery = baseQuery;
  if (baseQuery && baseQuery.includes('Inteligencia Artificial')) {
    enQuery = enQuery.replace(/Inteligencia Artificial/gi, 'Artificial Intelligence')
                     .replace(/\bIA\b/g, 'AI');
  } else {
    // Just append AI to ensure tech news
    enQuery = (baseQuery || '') + ' OR "AI"';
  }

  // Fetch from both Spanish (from config) and English (US) locales concurrently
  const [esArticles, enArticles] = await Promise.all([
    fetchGoogleNewsForLocale(baseQuery, config.hl || 'es', config.gl || 'ES', config.ceid || 'ES:es', maxResults, fetchedAt),
    fetchGoogleNewsForLocale(enQuery, 'en-US', 'US', 'US:en', maxResults, fetchedAt)
  ]);

  // Combine and remove duplicates
  const uniqueArticles = new Map<string, GoogleNewsArticleData>();
  for (const article of [...esArticles, ...enArticles]) {
    uniqueArticles.set(article.id, article);
  }
  
  // Sort by date descending and slice to maxResults (or maxResults * 2 if you want more since we combine 2 sources)
  // Let's return maxResults total, so the frontend isn't overwhelmed, or maybe maxResults per locale.
  // We'll return maxResults * 2 to give a rich combined feed.
  const finalArticles = Array.from(uniqueArticles.values())
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, maxResults * 2);

  // Fetch images and content in chunks to avoid overwhelming the network
  const chunkSize = 10;
  for (let i = 0; i < finalArticles.length; i += chunkSize) {
    const chunk = finalArticles.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (article) => {
        if (article.link) {
          const { imageUrl, content } = await fetchArticleData(article.link);
          article.imageUrl = imageUrl;
          article.content = content;
        }
      })
    );
  }
  
  return finalArticles;
}
