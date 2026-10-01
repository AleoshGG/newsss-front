import { gqlFetch } from '@/lib/graphql-client';
import { GET_RECENT_YOUTUBE_VIDEOS } from '@/lib/graphql-queries';
import { YouTubeVideo, YouTubeVideoMetrics } from './youtube.entity';

interface ApiVideo {
  id: string;
  title: string;
  channel: string;
  publishedAt: string;
  url: string;
  thumbnailUrl: string;
  transcript: string;
  metrics: YouTubeVideoMetrics;
}

export async function getVideos(limit = 50): Promise<YouTubeVideo[]> {
  const data = await gqlFetch<{ getRecentYoutubeVideos: ApiVideo[] }>(
    GET_RECENT_YOUTUBE_VIDEOS,
    { limit }
  );
  return data.getRecentYoutubeVideos.map(
    (v) =>
      new YouTubeVideo(
        v.id,
        v.title,
        v.channel,
        new Date(v.publishedAt),
        v.url,
        v.metrics,
        v.thumbnailUrl,
        v.transcript
      )
  );
}
