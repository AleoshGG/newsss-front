import { GoogleNewsArticleData } from '../data/googlenews.entity';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import { ExternalLink, Newspaper, BookOpen } from 'lucide-react';
import { ArticleModal } from './article-modal';

export function GoogleNewsHighlightCard({ article }: { article: GoogleNewsArticleData }) {
  return (
    <Card className="w-[320px] sm:w-[450px] flex-shrink-0 snap-start flex flex-row overflow-hidden h-[160px] border-primary/20 hover:border-primary/50 transition-colors">
      <div className="w-1/3 flex flex-col items-center justify-center bg-primary/5 p-4 flex-shrink-0 border-r border-border/50 gap-2">
        {article.imageUrl ? (
          <img 
            src={article.imageUrl} 
            alt={article.sourceName} 
            className="w-16 h-16 rounded-full object-cover shadow-sm border border-border/50"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Newspaper className="w-8 h-8 text-primary/70" />
          </div>
        )}
        <div className="text-xs text-center font-medium line-clamp-1 mt-1 text-primary/90">
          {article.sourceName}
        </div>
      </div>
      <div className="w-2/3 flex flex-col justify-between p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-sm leading-tight line-clamp-3">{article.title}</CardTitle>
        </CardHeader>
        <div className="flex justify-between text-[11px] text-muted-foreground font-medium pt-2 border-t border-border/30 mt-2">
          <span>{formatDate(new Date(article.pubDate))}</span>
          <ArticleModal title={article.title} content={article.content} link={article.link}>
            <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
              Leer aquí <BookOpen className="w-3 h-3" />
            </span>
          </ArticleModal>
        </div>
      </div>
    </Card>
  );
}

export function GoogleNewsFeaturedCard({ article }: { article: GoogleNewsArticleData }) {
  return (
    <Card className="w-full flex flex-col md:flex-row overflow-hidden mt-2 border border-border/50 hover:border-border transition-colors group">
      <div className="md:w-1/4 bg-primary/5 flex-shrink-0 flex flex-col items-center justify-center p-6 border-r border-border/50 min-h-[160px]">
        {article.imageUrl ? (
          <img 
            src={article.imageUrl} 
            alt={article.sourceName} 
            className="w-24 h-24 rounded-2xl object-cover shadow-md mb-4 group-hover:scale-105 transition-transform duration-300 border border-border/50"
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform duration-300">
            <Newspaper className="w-12 h-12 text-primary/70" />
          </div>
        )}
        <div className="text-center w-full">
          <div className="font-semibold text-lg text-foreground line-clamp-1">{article.sourceName}</div>
          <a 
            href={article.sourceUrl || article.link} 
            target="_blank" 
            rel="noreferrer" 
            className="text-xs text-primary hover:underline line-clamp-1 mt-1"
          >
            Visitar fuente
          </a>
        </div>
      </div>

      <div className="md:w-3/4 flex flex-col p-6 sm:p-8 justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <CardTitle className="text-xl text-foreground leading-relaxed max-w-2xl">
              {article.title}
            </CardTitle>
            <div className="flex gap-2 flex-shrink-0">
              <ArticleModal title={article.title} content={article.content} link={article.link}>
                <span className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-semibold bg-primary/10 px-3 py-1.5 rounded-md transition-colors hover:bg-primary/20 cursor-pointer">
                  <BookOpen className="w-4 h-4" />
                  Leer aquí
                </span>
              </ArticleModal>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium mb-6">
            <span className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md">
              Publicado: {formatDate(new Date(article.pubDate))}
            </span>
            {article.fetchedAt && (
              <span className="flex items-center gap-1.5 border border-border/50 px-2.5 py-1 rounded-md">
                Obtenido: {formatDate(new Date(article.fetchedAt))}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
