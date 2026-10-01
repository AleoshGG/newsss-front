import { GoogleNewsArticleData } from './googlenews.entity';

// Mock data - no database persistence
const mockGoogleNewsArticles: Map<string, GoogleNewsArticleData> = new Map();

export async function saveGoogleNewsArticle(article: GoogleNewsArticleData): Promise<void> {
  mockGoogleNewsArticles.set(article.id, article);
}

export async function saveManyGoogleNewsArticles(articles: GoogleNewsArticleData[]): Promise<void> {
  for (const article of articles) {
    mockGoogleNewsArticles.set(article.id, article);
  }
}

export async function getGoogleNewsArticles(limit?: number): Promise<GoogleNewsArticleData[]> {
  const articles = Array.from(mockGoogleNewsArticles.values())
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  if (limit) {
    return articles.slice(0, limit);
  }
  return articles;
}

export async function countGoogleNewsArticles(): Promise<number> {
  return mockGoogleNewsArticles.size;
}
