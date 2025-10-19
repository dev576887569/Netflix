import { Video } from '../lib/supabase';
import VideoCard from './VideoCard';

interface CategoryRowProps {
  title: string;
  videos: Video[];
  onPlay: (video: Video) => void;
  onToggleList?: (video: Video) => void;
  myListVideoIds?: Set<string>;
}

export default function CategoryRow({ title, videos, onPlay, onToggleList, myListVideoIds }: CategoryRowProps) {
  if (videos.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 px-8">{title}</h2>
      <div className="flex gap-4 overflow-x-auto px-8 pb-4 scrollbar-hide">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onPlay={onPlay}
            onToggleList={onToggleList}
            isInList={myListVideoIds?.has(video.id)}
          />
        ))}
      </div>
    </div>
  );
}
