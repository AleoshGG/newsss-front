export class GoogleNewsArticleData {
  constructor(
    public id: string, // guid from RSS
    public title: string,
    public link: string,
    public pubDate: Date | string,
    public sourceName: string,
    public sourceUrl: string,
    public fetchedAt?: Date,
    public imageUrl?: string,
    public content?: string
  ) {}
}
