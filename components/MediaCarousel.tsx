import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
const { Image, Dimensions } = require('react-native') as { Image: React.ComponentType<any>; Dimensions: { get: (d: string) => { width: number; height: number } } };
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/constants/Config';

const { width } = Dimensions.get('window');

interface CarouselItem {
  id: string;
  title: string;
  post: string;
  url: string;
  type: string;
  for: string;
}

export const MediaCarousel = () => {
  const router = useRouter();
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 5;

  useEffect(() => {
    fetchMedia(1);
  }, []);

  const fetchMedia = async (pageNum: number) => {
    if (pageNum === 1) setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/dbhandler`, {
        params: {
          model: 'posts',
          page: pageNum,
          limit: LIMIT,
        },
      });
      const newItems = response.data || [];
      
      if (pageNum === 1) {
        setItems(newItems);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
      
      setHasMore(newItems.length === LIMIT);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onEndReached = () => {
    if (!loadingMore && hasMore && !loading) {
      setLoadingMore(true);
      fetchMedia(page + 1);
    }
  };

  const renderItem = ({ item }: { item: CarouselItem }) => (
    <TouchableOpacity
      onPress={() => router.push(`/detail/${item.id}?type=${encodeURIComponent(item.for)}` as any)}
      activeOpacity={0.85}
      className="mr-4"
    >
      <Image
        source={{ uri: item.url }}
        className="rounded-3xl"
        style={{ width: width * 0.72, height: 190 }}
      />
      <View className="mt-3 px-3">
        <Text className="text-lg font-bold text-foreground">{item.title || 'Featured Media'}</Text>
        <Text className="text-sm text-muted-foreground mt-1">{item.post?.substring(0, 50) || 'Tap to view details'}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4 px-4 items-center" style={{ width: width * 0.72 + 16 }}>
        <ActivityIndicator size="small" color="#F97316" />
      </View>
    );
  };

  if (loading) {
    return (
      <View className="mt-6">
        <View className="px-6 mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-foreground">Featured Media</Text>
        </View>
        <ActivityIndicator size="large" color="#F97316" style={{ marginVertical: 20 }} />
      </View>
    );
  }

  if (items.length === 0) return null;

  return (
    <View className="mt-6">
      <View className="px-6 mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-foreground">Featured Media</Text>
        <Text className="text-sm text-muted-foreground">See all</Text>
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
      />
    </View>
  );
};
