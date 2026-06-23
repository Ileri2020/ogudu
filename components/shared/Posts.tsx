import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Post } from './Post';
import axios from 'axios';
import { API_URL } from '@/constants/Config';

interface PostsProps {
  category?: string;
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

export const Posts = ({ category, limit = 10, onPostUpdate }: PostsProps) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = category
        ? `${API_URL}/api/dbhandler?model=posts&category=${category}&limit=${limit}`
        : `${API_URL}/api/dbhandler?model=posts&limit=${limit}`;

      const response = await axios.get(query);
      setPosts(response.data || []);
    } catch (err) {
      setError('Failed to load posts');
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

  if (error) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <Text className="text-slate-500">No posts available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <Post post={item} />
      )}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      className="w-full"
    />
  );
};
