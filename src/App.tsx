import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase, Video } from './lib/supabase';
import { useMyList } from './hooks/useMyList';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import CategoryRow from './components/CategoryRow';
import VideoPlayer from './components/VideoPlayer';
import { Play } from 'lucide-react';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { myListVideoIds, toggleMyList } = useMyList();

  useEffect(() => {
    if (user) {
      loadVideos();
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos(videos);
    }
  }, [searchQuery, videos]);

  const loadVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading videos:', error);
      return;
    }

    setVideos(data || []);
    setFilteredVideos(data || []);
    if (data && data.length > 0) {
      setFeaturedVideo(data[0]);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
  };

  const getVideosByCategory = (category: string) => {
    return filteredVideos.filter(video => video.category === category);
  };

  const categories = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance'];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar onOpenAuth={handleOpenAuth} onSearch={handleSearch} />

        <div className="flex items-center justify-center min-h-screen px-8">
          <div className="text-center max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Unlimited movies, TV shows, and more
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Watch anywhere. Cancel anytime.
            </p>
            <button
              onClick={() => handleOpenAuth('signup')}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold rounded transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar onOpenAuth={handleOpenAuth} onSearch={handleSearch} />

      {selectedVideo ? (
        <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      ) : (
        <>
          {featuredVideo && !searchQuery && (
            <div className="relative h-screen">
              <div className="absolute inset-0">
                <img
                  src={featuredVideo.thumbnail_url}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              <div className="relative h-full flex items-center px-8 md:px-16">
                <div className="max-w-2xl">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                    {featuredVideo.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-6 line-clamp-3">
                    {featuredVideo.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handlePlayVideo(featuredVideo)}
                      className="flex items-center gap-2 px-8 py-3 bg-white hover:bg-gray-200 text-black font-semibold rounded transition-colors"
                    >
                      <Play size={24} className="fill-black" />
                      Play
                    </button>
                    <button
                      onClick={() => toggleMyList(featuredVideo)}
                      className="px-8 py-3 bg-gray-700 bg-opacity-70 hover:bg-opacity-100 text-white font-semibold rounded transition-all"
                    >
                      {myListVideoIds.has(featuredVideo.id) ? 'Remove from List' : 'Add to My List'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={searchQuery ? 'pt-24' : '-mt-32 relative z-10'}>
            {searchQuery && filteredVideos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-400">No videos found for "{searchQuery}"</p>
              </div>
            ) : searchQuery && filteredVideos.length > 0 ? (
              <CategoryRow
                title={`Search Results for "${searchQuery}"`}
                videos={filteredVideos}
                onPlay={handlePlayVideo}
                onToggleList={toggleMyList}
                myListVideoIds={myListVideoIds}
              />
            ) : (
              categories.map(category => (
                <CategoryRow
                  key={category}
                  title={category}
                  videos={getVideosByCategory(category)}
                  onPlay={handlePlayVideo}
                  onToggleList={toggleMyList}
                  myListVideoIds={myListVideoIds}
                />
              ))
            )}
          </div>

          <footer className="bg-black border-t border-gray-900 py-8 px-8 mt-20">
            <div className="max-w-6xl mx-auto">
              <p className="text-gray-500 text-center">
                © 2024 StreamFlix. Built with React, Supabase & Tailwind CSS
              </p>
            </div>
          </footer>
        </>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
