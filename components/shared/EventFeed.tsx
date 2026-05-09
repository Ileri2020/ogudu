import React from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PostData } from './Post';
import { Badge } from '@/components/ui';

const PAGE_SIZE = 5;

export const EventFeed = () => {
  const fetchEvents = async ({ pageParam = 1 }) => {
    const response = await axios.get('/api/dbhandler', {
      params: {
        model: 'posts',
        page: pageParam,
        limit: PAGE_SIZE,
        for: 'event',
        type: 'image',
      },
    });
    
    return {
      events: response.data,
      nextPage: response.data.length === PAGE_SIZE ? pageParam + 1 : undefined,
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const allEvents = data?.pages.flatMap((page) => page.events) ?? [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    return 'Just now';
  };

  const renderEvent = ({ item }: { item: PostData }) => (
    <View className="mb-8 bg-white overflow-hidden shadow-sm border border-gray-100 rounded-2xl">
      <View className="flex-row items-center p-4 gap-3">
        <Image 
          source={{ uri: item.user?.avatarUrl || 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png' }} 
          className="w-10 h-10 rounded-full"
        />
        <View className="flex-1">
          <Text className="font-bold text-gray-900">{item.user?.username || 'Admin'}</Text>
          <View className="flex-row items-center mt-0.5">
            <Badge variant="outline" className="px-2 py-0 border-gray-100">
              {formatDate(item.updatedAt)}
            </Badge>
          </View>
        </View>
      </View>
      
      <Image 
        source={{ uri: item.url }} 
        className="w-full aspect-[4/3]"
        resizeMode="cover"
      />
      
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-900 mb-2">{item.title}</Text>
        <Text className="text-gray-700 leading-relaxed">{item.post}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View className="py-10 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <View className="flex-1 px-4">
      <Text className="text-2xl font-bold text-gray-900 mb-6 mt-4">Upcoming Events</Text>
      <FlatList
        data={allEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator className="my-4" /> : null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
