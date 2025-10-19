import { X, ArrowLeft } from 'lucide-react';
import { Video } from '../lib/supabase';

interface VideoPlayerProps {
  video: Video | null;
  onClose: () => void;
}

export default function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  if (!video) return null;

  const isYouTube = video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be');

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent p-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={24} />
          <span className="text-lg">Back</span>
        </button>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        {isYouTube ? (
          <iframe
            src={getYouTubeEmbedUrl(video.video_url)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <video
            src={video.video_url}
            controls
            autoPlay
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
        <h1 className="text-3xl font-bold text-white mb-2">{video.title}</h1>
        <p className="text-gray-300 max-w-3xl">{video.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-400 mt-4">
          {video.year && <span>{video.year}</span>}
          <span>•</span>
          <span>{video.rating}</span>
          <span>•</span>
          <span>{Math.floor(video.duration / 60)} minutes</span>
          <span>•</span>
          <span>{video.category}</span>
        </div>
      </div>
    </div>
  );
}
