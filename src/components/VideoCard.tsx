import { Play, Plus, Check } from 'lucide-react';
import { Video } from '../lib/supabase';

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
  onToggleList?: (video: Video) => void;
  isInList?: boolean;
}

export default function VideoCard({ video, onPlay, onToggleList, isInList }: VideoCardProps) {
  return (
    <div className="group relative flex-shrink-0 w-64 cursor-pointer transition-transform hover:scale-105">
      <div className="relative overflow-hidden rounded-md">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full h-36 object-cover"
        />

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onPlay(video)}
            className="p-3 bg-white rounded-full hover:bg-gray-200 transition-colors mr-2"
          >
            <Play size={24} className="text-black fill-black" />
          </button>

          {onToggleList && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleList(video);
              }}
              className="p-3 bg-gray-800 border-2 border-gray-600 rounded-full hover:border-white transition-colors"
            >
              {isInList ? (
                <Check size={20} className="text-white" />
              ) : (
                <Plus size={20} className="text-white" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-2">
        <h3 className="text-white font-semibold truncate">{video.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
          {video.year && <span>{video.year}</span>}
          <span>•</span>
          <span>{video.rating}</span>
          <span>•</span>
          <span>{Math.floor(video.duration / 60)}m</span>
        </div>
      </div>
    </div>
  );
}
