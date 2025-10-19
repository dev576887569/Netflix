import { useState, useEffect } from 'react';
import { supabase, Video, MyListItem } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useMyList() {
  const { user } = useAuth();
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const [myListVideoIds, setMyListVideoIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMyList();
    } else {
      setMyList([]);
      setMyListVideoIds(new Set());
      setLoading(false);
    }
  }, [user]);

  const loadMyList = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('my_list')
        .select('*, video:videos(*)')
        .eq('user_id', user.id);

      if (error) throw error;

      setMyList(data || []);
      setMyListVideoIds(new Set(data?.map(item => item.video_id) || []));
    } catch (error) {
      console.error('Error loading my list:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToMyList = async (video: Video) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('my_list')
        .insert({
          user_id: user.id,
          video_id: video.id,
        });

      if (error) throw error;

      setMyListVideoIds(prev => new Set([...prev, video.id]));
      await loadMyList();
    } catch (error) {
      console.error('Error adding to my list:', error);
    }
  };

  const removeFromMyList = async (videoId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('my_list')
        .delete()
        .eq('user_id', user.id)
        .eq('video_id', videoId);

      if (error) throw error;

      setMyListVideoIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });
      await loadMyList();
    } catch (error) {
      console.error('Error removing from my list:', error);
    }
  };

  const toggleMyList = async (video: Video) => {
    if (myListVideoIds.has(video.id)) {
      await removeFromMyList(video.id);
    } else {
      await addToMyList(video);
    }
  };

  return {
    myList,
    myListVideoIds,
    loading,
    toggleMyList,
    addToMyList,
    removeFromMyList,
  };
}
