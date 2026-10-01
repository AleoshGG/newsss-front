import { YouTubeVideo } from '../data/youtube.entity';
import { YoutubeCard } from './youtube-card';
import { SyncButton } from './sync-button';

interface YoutubeListProps {
  videos: YouTubeVideo[];
}

// Server Component: recibe los videos ya hidratados desde page.tsx
// y los renderiza en una grilla horizontal centrada.
export function YoutubeList({ videos }: YoutubeListProps) {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">📺 Videos de Anthropic</h2>
        <SyncButton />
      </div>

      {videos.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <p>No hay videos. Verifica tu <code className="bg-gray-100 px-1 rounded">YOUTUBE_API_KEY</code> en .env</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {videos.map((video) => (
            <div key={video.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm">
              <YoutubeCard video={video} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
