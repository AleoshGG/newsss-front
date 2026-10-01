import { YouTubeVideo } from '../data/youtube.entity';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatNumber } from '@/lib/format';
import { TranscriptModal } from './transcript-modal';

export function YoutubeHighlightCard({ video }: { video: YouTubeVideo }) {
  return (
    <Card className="w-[320px] sm:w-[450px] flex-shrink-0 snap-start flex flex-row overflow-hidden h-[160px]">
      <div className="w-2/5 relative bg-muted overflow-hidden flex-shrink-0">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="w-3/5 flex flex-col justify-between p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-sm leading-tight line-clamp-2">{video.title}</CardTitle>
          <CardDescription className="line-clamp-2 mt-1 text-xs">{video.channel}</CardDescription>
        </CardHeader>
        <div className="flex gap-3 text-xs text-muted-foreground font-medium">
          <span>{formatNumber(video.metrics.views)} views</span>
          <span>{formatNumber(video.metrics.likes)} likes</span>
          <span>{formatNumber(video.metrics.comments)} comments</span>
        </div>
      </div>
    </Card>
  );
}

export function YoutubeFeaturedCard({ video }: { video: YouTubeVideo }) {
  const videoId = new URL(video.url).searchParams.get('v');

  return (
    <Card className="w-full flex flex-col md:flex-row overflow-hidden mt-2 border border-border/50 hover:border-border transition-colors">
      <div className="md:w-1/2 bg-muted/20 flex-shrink-0 flex items-center justify-center p-4 pl-6 md:p-6 md:pl-8">
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-border/50" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <div className="md:w-1/2 flex flex-col justify-between p-6 sm:p-8">
        <div>
          <CardTitle className="text-2xl mb-3 leading-tight">{video.title}</CardTitle>
          <CardDescription className="text-base text-foreground/80 leading-relaxed mb-4">
            {video.channel} · {formatDate(video.publishedAt)}
          </CardDescription>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
            <span className="bg-secondary px-2 py-1 rounded-md">{formatNumber(video.metrics.views)} reproducciones</span>
            <span className="bg-secondary px-2 py-1 rounded-md">{formatNumber(video.metrics.likes)} likes</span>
            <a href={video.url} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold bg-primary/10 px-2 py-1 rounded-md">
              Ver en YouTube
            </a>
          </div>
        </div>

        {video.transcript && video.transcript !== 'Transcripcion no disponible' && (
          <div className="mt-6 sm:mt-8 border-t pt-4">
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 italic mb-2">
              "{video.transcript.slice(0, 200)}..."
            </p>
            <TranscriptModal transcript={video.transcript} title={video.title} />
          </div>
        )}
      </div>
    </Card>
  );
}
