import { YouTubeVideo } from '../data/youtube.entity';
import { formatDate, formatNumber } from '@/lib/format';

export function YoutubeCard({ video }: { video: YouTubeVideo }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white">
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="font-bold text-base leading-tight line-clamp-2">{video.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {video.channel} · {formatDate(video.publishedAt)}
          </p>
        </div>

        <div className="flex gap-3 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
          <span>{formatNumber(video.metrics.views)} views</span>
          <span>{formatNumber(video.metrics.likes)} likes</span>
          <span>{formatNumber(video.metrics.comments)} comments</span>
        </div>

        {video.transcript && video.transcript !== 'Transcripcion no disponible' && (
          <p className="text-xs text-gray-500 italic line-clamp-2">
            "{video.transcript.slice(0, 150)}..."
          </p>
        )}

        <a
          href={video.url}
          target="_blank"
          rel="noreferrer"
          className="block text-center bg-red-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition"
        >
          Ver en YouTube
        </a>
      </div>
    </div>
  );
}
