export interface YouTubeVideoMetrics {
  views: number;
  likes: number;
  comments: number;
}

export class YouTubeVideo {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly channel: string,
    public readonly publishedAt: Date,
    public readonly url: string,
    public readonly metrics: YouTubeVideoMetrics,
    public readonly thumbnailUrl: string,
    public readonly transcript: string
  ) {}
}
