import { YouTubeVideo } from './youtube.entity';

// Mock data - no database persistence
const mockYoutubeVideos: Map<string, YouTubeVideo> = new Map();

export async function saveVideo(video: YouTubeVideo): Promise<void> {
  mockYoutubeVideos.set(video.id, video);
}

export async function getVideos(limit?: number): Promise<YouTubeVideo[]> {
  const videos = Array.from(mockYoutubeVideos.values())
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  if (limit) {
    return videos.slice(0, limit);
  }
  return videos;
}

export async function countVideos(): Promise<number> {
  return mockYoutubeVideos.size;
}
