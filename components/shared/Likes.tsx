import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext';
import { API_URL } from '@/constants/Config';

interface LikesProps {
  postId: string;
  onUpdate?: () => void;
}

interface LikeData {
  id: string;
  userId: string;
  postId: string;
}

export const Likes = ({ postId, onUpdate }: LikesProps) => {
  const { user } = useAppContext();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeId, setLikeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingLikes, setFetchingLikes] = useState(true);

  useEffect(() => {
    fetchLikes();
  }, [postId]);

  const fetchLikes = async () => {
    setFetchingLikes(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/dbhandler?model=likes&id=${postId}`
      );
      const likes = response.data || [];
      setLikeCount(likes.length);

      if (user?.id) {
        const userLike = likes.find((like: LikeData) => like.userId === user.id);
        if (userLike) {
          setLikeId(userLike.id);
          setLiked(true);
        } else {
          setLikeId(null);
          setLiked(false);
        }
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setFetchingLikes(false);
    }
  };

  const handleLike = async () => {
    if (!user || user.username === 'visitor') {
      alert('Please log in to like this post');
      return;
    }

    setLoading(true);
    try {
      if (liked && likeId) {
        // Unlike
        await axios.delete(
          `${API_URL}/api/dbhandler?model=likes&id=${likeId}`
        );
        setLiked(false);
        setLikeCount(Math.max(0, likeCount - 1));
        setLikeId(null);
      } else {
        // Like
        const response = await axios.post(
          `${API_URL}/api/dbhandler?model=likes`,
          {
            postId,
            userId: user.id,
          }
        );
        setLiked(true);
        setLikeCount(likeCount + 1);
        setLikeId(response.data.id);
      }
      onUpdate?.();
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingLikes) {
    return (
      <View className="flex-row items-center gap-2">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <Pressable
      onPress={handleLike}
      disabled={loading}
      className="flex-row items-center gap-2 p-2 rounded-lg"
    >
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <>
          <MaterialIcons
            name={liked ? 'favorite' : 'favorite-border'}
            size={24}
            color={liked ? '#ef4444' : '#94a3b8'}
          />
          <Text
            className={`font-semibold ${
              liked
                ? 'text-red-500'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {likeCount}
          </Text>
        </>
      )}
    </Pressable>
  );
};
