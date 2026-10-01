import { getVideos } from '@/features/youtube/data/youtube.db';
import { YoutubeHighlightCard, YoutubeFeaturedCard } from '@/features/youtube/presentation/youtube-cards';
import { GithubHighlightCard, GithubFeaturedCard } from '@/features/github/presentation/github-cards';
import { GoogleNewsHighlightCard, GoogleNewsFeaturedCard } from '@/features/googlenews/presentation/googlenews-cards';
import { FeedSection } from '@/components/feed-section';
import { getGithubRepos } from '@/features/github/data/github.db';
import { getGoogleNewsArticles } from '@/features/googlenews/data/googlenews.db';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedParams = await searchParams;
  const tab = resolvedParams.tab || 'youtube';

  // Fetch all data based on current tab
  const youtubeVideos = tab === 'youtube' ? await getVideos() : [];
  const githubRepos = tab === 'github' ? await getGithubRepos() : [];
  const googleNewsArticles = tab === 'googlenews' ? await getGoogleNewsArticles() : [];

  return (
    <div className="flex flex-col min-h-screen p-6 sm:p-12 gap-12 bg-background text-foreground">
      <header className="w-full max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
          Noticias sobre Inteligencia Artificial
        </h1>
      </header>

      <div className="w-full max-w-7xl mx-auto flex flex-col gap-16">
        <FeedSection
          currentTab={tab}
          highlights={
            <>
              {tab === 'youtube' && youtubeVideos.length > 0 && (
                <YoutubeHighlightCard video={youtubeVideos[0]} />
              )}
              {tab === 'github' && githubRepos.length > 0 && (
                <GithubHighlightCard repo={githubRepos[0]} />
              )}
              {tab === 'googlenews' && googleNewsArticles.length > 0 && (
                <GoogleNewsHighlightCard article={googleNewsArticles[0]} />
              )}
            </>
          }
        >
          {tab === 'youtube' && youtubeVideos.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-sm">
              No hay videos. Verifica tu <code className="bg-muted px-1 rounded">YOUTUBE_API_KEY</code>
            </p>
          )}
          {tab === 'youtube' && youtubeVideos.map(video => (
            <YoutubeFeaturedCard key={video.id} video={video} />
          ))}

          {tab === 'github' && githubRepos.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-sm">
              No hay repositorios sincronizados aún.
            </p>
          )}
          {tab === 'github' && githubRepos.map(repo => (
            <GithubFeaturedCard key={repo.id} repo={repo} />
          ))}

          {tab === 'googlenews' && googleNewsArticles.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-sm">
              No hay noticias sincronizadas aún.
            </p>
          )}
          {tab === 'googlenews' && googleNewsArticles.map(article => (
            <GoogleNewsFeaturedCard key={article.id} article={article} />
          ))}

          {(tab === 'x' || tab === 'linkedin') && (
            <p className="text-center text-muted-foreground py-10 text-sm">
              Próximamente...
            </p>
          )}
        </FeedSection>
      </div>
    </div>
  );
}
