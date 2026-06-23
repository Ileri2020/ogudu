import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Post } from './Post';
import axios from 'axios';
import { API_URL } from '@/constants/Config';

interface SimilarProps {
  postId: string;
  category: string;
  limit?: number;
  onPostUpdate?: () => void;
}

interface PostData {
  id: string;
  title?: string;
  post: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  for: string;
  createdAt: string;
  updatedAt: string;
  isVerified?: boolean;
  user?: {
    id: string;
    username: string;
    avatarUrl: string;
  };
}

export const Similar = ({
  postId,
  category,
  limit = 5,
  onPostUpdate,
}: SimilarProps) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSimilarPosts();
  }, [postId, category]);

  const fetchSimilarPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}/api/dbhandler?model=posts&category=${category}&limit=${limit}`
      );
      const filtered = response.data.filter(
        (post: PostData) => post.id !== postId
      );
      setPosts(filtered.slice(0, limit));
    } catch (err) {
      setError('Failed to load similar posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || posts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <Text className="text-slate-500">
          {error || 'No similar posts found'}
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full">
      <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Similar Posts
      </Text>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Post post={item} />
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
};
