import { gqlFetch } from '@/lib/graphql-client';
import { GET_RECENT_NEWS_ARTICLES } from '@/lib/graphql-queries';
import { GoogleNewsArticleData } from './googlenews.entity';

export async function getGoogleNewsArticles(
  limit = 50
): Promise<GoogleNewsArticleData[]> {
  const data = await gqlFetch<{ getRecentNewsArticles: GoogleNewsArticleData[] }>(
    GET_RECENT_NEWS_ARTICLES,
    { limit }
  );
  return data.getRecentNewsArticles.map(
    (a) =>
      new GoogleNewsArticleData(
        a.id,
        a.title,
        a.link,
        a.pubDate,
        a.sourceName,
        a.sourceUrl,
        a.fetchedAt,
        a.imageUrl ?? undefined, // API returns null when absent; entity expects undefined
        a.content
      )
  );
}
