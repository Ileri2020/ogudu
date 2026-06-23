import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '@/constants/Config';

interface AudioItem {
  id: string;
  name: string;
  position: string;
  audioUrl?: string;
  image?: string;
}

interface AudioProps {
  category?: string;
  limit?: number;
}

export const Audio = ({ category = 'worship', limit = 10 }: AudioProps) => {
  const [audioItems, setAudioItems] = useState<AudioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAudioItems();
  }, [category]);

  const fetchAudioItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}/api/media?type=audio&category=${category}&limit=${limit}`
      );
      setAudioItems(response.data || []);
    } catch (err) {
      setError('Failed to load audio');
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

  return (
    <View className="w-full">
      <FlatList
        data={audioItems}
        renderItem={({ item }) => (
          <View className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-3 flex-row items-center gap-3">
            <View className="w-12 h-12 bg-blue-600 rounded-lg items-center justify-center">
              <Text className="text-white text-2xl">♪</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-slate-900 dark:text-white">
                {item.name}
              </Text>
              <Text className="text-xs text-slate-600 dark:text-slate-400">
                {item.position}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
};
