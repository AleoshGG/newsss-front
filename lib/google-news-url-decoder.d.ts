declare module 'google-news-url-decoder' {
  export class GoogleDecoder {
    decode(url: string): Promise<{ status: number; decoded_url: string } | null>;
  }
}
