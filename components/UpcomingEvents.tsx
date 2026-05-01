import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
const { Image } = require('react-native') as { Image: React.ComponentType<any> };
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/constants/Config';

interface Event {
  id: string;
  title: string;
  post: string;
  url: string;
  updatedAt: string;
  user: {
    username: string;
    avatarUrl: string;
  };
}

export const UpcomingEvents = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 6;

  useEffect(() => {
    fetchEvents(1);
  }, []);

  const fetchEvents = async (pageNum: number) => {
    if (pageNum === 1) setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/dbhandler`, {
        params: { 
          model: 'posts', 
          for: 'event', 
          type: 'image',
          page: pageNum,
          limit: LIMIT,
        },
      });
      const newEvents = response.data || [];
      
      if (pageNum === 1) {
        setEvents(newEvents);
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }
      
      setHasMore(newEvents.length === LIMIT);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onEndReached = () => {
    if (!loadingMore && hasMore && !loading) {
      setLoadingMore(true);
      fetchEvents(page + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const min = Math.floor(diff / 60000);
    const hrs = Math.floor(min / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) return `last ${days} d`;
    if (hrs > 0) return `last ${hrs} h`;
    if (min > 0) return `last ${min} m`;
    return 'just now';
  };

  const renderEventCard = ({ item }: { item: Event }) => (
    <TouchableOpacity
      onPress={() => router.push(`/detail/${item.id}?type=event` as any)}
      activeOpacity={0.88}
      className="mb-8 w-full max-w-sm bg-secondary rounded-xl overflow-hidden shadow-sm"
    >
      {/* Header */}
      <View className="flex-row items-center p-3">
        <Image
          source={{ uri: item.user?.avatarUrl || 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png' }}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-foreground">{item.user?.username}</Text>
          <Text className="text-xs text-muted-foreground">{formatDate(item.updatedAt)}</Text>
        </View>
      </View>

      {/* Image */}
      <Image source={{ uri: item.url }} className="w-full aspect-square" resizeMode="cover" />

      {/* Body */}
      <View className="p-4">
        {item.title && <Text className="font-bold text-lg mb-1">{item.title}</Text>}
        <Text className="text-foreground/80">{item.post}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#F97316" className="mt-10" />;
  }

  if (events.length === 0) return null;

  return (
    <View className="flex flex-col items-center mt-8 w-full px-6">
      <Text className="text-3xl font-bold text-center">Upcoming Events</Text>
      <View className="w-20 h-1 bg-accent my-4 rounded-full" />
      
      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};
