import { GitHubData } from '../data/github.entity';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDate, formatNumber } from '@/lib/format';
import { Star, GitFork, AlertCircle, ExternalLink, Code2 } from 'lucide-react';
import { ReadmeModal } from './readme-modal';

export function GithubHighlightCard({ repo }: { repo: GitHubData }) {
  return (
    <Card className="w-[320px] sm:w-[450px] flex-shrink-0 snap-start flex flex-row overflow-hidden h-[160px] border-primary/20 hover:border-primary/50 transition-colors">
      <div className="w-1/3 flex flex-col items-center justify-center bg-primary/5 p-4 flex-shrink-0 border-r border-border/50 gap-2">
        {repo.ownerAvatarUrl ? (
          <img
            src={repo.ownerAvatarUrl}
            alt={repo.fullName}
            className="w-16 h-16 rounded-full shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Code2 className="w-8 h-8 text-primary/70" />
          </div>
        )}
        <div className="flex items-center gap-1.5 text-sm font-semibold text-primary/90 bg-primary/10 px-2 py-0.5 rounded-md mt-1">
          <Star className="w-3.5 h-3.5" />
          <span>{formatNumber(repo.stargazersCount)}</span>
        </div>
      </div>
      <div className="w-2/3 flex flex-col justify-between p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-sm leading-tight line-clamp-1">{repo.name}</CardTitle>
          <CardDescription className="line-clamp-1 text-xs">{repo.fullName}</CardDescription>
        </CardHeader>
        <div className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed flex-grow">
          {repo.description || "Sin descripción"}
        </div>
        <div className="flex gap-3 text-[11px] text-muted-foreground font-medium pt-2 border-t border-border/30 mt-2">
          {repo.language && <span>{repo.language}</span>}
          {repo.forksCount !== undefined && repo.forksCount > 0 && (
            <span className="flex items-center gap-1"><GitFork className="w-3 h-3"/> {formatNumber(repo.forksCount)}</span>
          )}
          {repo.updatedAt && <span className="opacity-70 truncate">Act: {formatDate(new Date(repo.updatedAt))}</span>}
        </div>
      </div>
    </Card>
  );
}

export function GithubFeaturedCard({ repo }: { repo: GitHubData }) {
  const parsedTopics = typeof repo.topics === 'string' ? JSON.parse(repo.topics) : repo.topics;

  return (
    <Card className="w-full flex flex-col md:flex-row overflow-hidden mt-2 border border-border/50 hover:border-border transition-colors group">
      <div className="md:w-1/4 bg-primary/5 flex-shrink-0 flex flex-col items-center justify-center p-6 border-r border-border/50 min-h-[200px]">
        {repo.ownerAvatarUrl ? (
          <img
            src={repo.ownerAvatarUrl}
            alt={repo.fullName}
            className="w-24 h-24 rounded-2xl shadow-md mb-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform duration-300">
            <Code2 className="w-12 h-12 text-primary/70" />
          </div>
        )}
        <div className="text-center w-full">
          <div className="font-semibold text-lg text-foreground line-clamp-1">{repo.name}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">{repo.fullName}</div>
        </div>
      </div>

      <div className="md:w-3/4 flex flex-col p-6 sm:p-8 justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <CardDescription className="text-base text-foreground/80 leading-relaxed max-w-2xl">
              {repo.description || "Sin descripción proporcionada."}
            </CardDescription>
            <div className="flex gap-2 flex-shrink-0">
              <a 
                href={repo.htmlUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-semibold bg-primary/10 px-3 py-1.5 rounded-md transition-colors hover:bg-primary/20"
              >
                <ExternalLink className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium mb-6">
            <span className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md">
              <Star className="w-4 h-4 text-yellow-500" />
              {formatNumber(repo.stargazersCount)} stars
            </span>
            {repo.forksCount !== undefined && (
              <span className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md">
                <GitFork className="w-4 h-4" />
                {formatNumber(repo.forksCount)} forks
              </span>
            )}
            {repo.openIssuesCount !== undefined && (
              <span className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md">
                <AlertCircle className="w-4 h-4 text-destructive/70" />
                {formatNumber(repo.openIssuesCount)} issues
              </span>
            )}
            {repo.language && (
              <span className="flex items-center gap-1.5 border border-border/50 px-2.5 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {repo.language}
              </span>
            )}
            {repo.license && (
              <span className="flex items-center gap-1.5 border border-border/50 px-2.5 py-1 rounded-md">
                {repo.license}
              </span>
            )}
          </div>
        </div>

        <div>
          {Array.isArray(parsedTopics) && parsedTopics.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {parsedTopics.slice(0, 10).map((topic: string) => (
                <span key={topic} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full border border-border/30">
                  {topic}
                </span>
              ))}
              {parsedTopics.length > 10 && (
                <span className="text-xs bg-muted/50 text-muted-foreground px-2.5 py-1 rounded-full border border-border/30">
                  +{parsedTopics.length - 10} más
                </span>
              )}
            </div>
          )}
        </div>

        {repo.readme && (
          <div className="mt-6 sm:mt-8 border-t pt-4">
            <ReadmeModal readme={repo.readme} repoName={repo.name} />
          </div>
        )}
      </div>
    </Card>
  );
}
