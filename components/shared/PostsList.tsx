// components/shared/PostsList.tsx
import React, { useCallback, useState, useRef } from 'react';
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
  Dimensions,
} from 'react-native';
import { Post, PostData } from './Post';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

interface PostsListProps {
  page: 'praisevideo' | 'worshipvideo' | 'post' | 'event' | 'project' | 'preaching' | 'service' | 'unverified';
  media?: string;
  sortOrder?: 'asc' | 'desc' | 'random';
  postTypes?: {
    video?: boolean;
    audio?: boolean;
    document?: boolean;
  };
  onPostPress?: (post: PostData) => void;
  onUserPress?: (userId: string) => void;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
}

const PAGE_SIZE = 10;

export function PostsList({
  page,
  media,
  sortOrder = 'desc',
  postTypes = { video: true, audio: true, document: true },
  onPostPress,
  onUserPress,
  ListHeaderComponent,
  ListEmptyComponent,
}: PostsListProps) {
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const fetchPosts = async ({ pageParam = 1 }) => {
    const response = await axios.get('/api/dbhandler', {
      params: {
        model: 'posts',
        page: pageParam,
        limit: PAGE_SIZE,
        for: page === 'unverified' ? undefined : page,
        isVerified: page === 'unverified' ? 'false' : undefined,
      },
    });

    let posts: PostData[] = response.data;

    // Client-side filtering for types
    if (page !== 'unverified') {
      posts = posts.filter((post) => {
        if (post.type === 'image' && postTypes.document) return true;
        return postTypes[post.type as keyof typeof postTypes] ?? false;
      });
    }

    // Sorting
    if (sortOrder === 'asc') {
      posts.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
    } else if (sortOrder === 'desc') {
      posts.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } else {
      posts.sort(() => Math.random() - 0.5);
    }

    // Prioritize media if specified
    if (media) {
      const index = posts.findIndex((p) => p.id === media);
      if (index > -1) {
        const [item] = posts.splice(index, 1);
        posts.unshift(item);
      }
    }

    return {
      posts,
      nextPage: posts.length === PAGE_SIZE ? pageParam + 1 : undefined,
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['posts', page, sortOrder, postTypes, media],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: PostData }) => (
      <Post
        post={item}
        onMediaPress={onPostPress}
        onUserPress={onUserPress}
        variant="feed"
      />
    ),
    [onPostPress, onUserPress]
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 justify-center items-center">
        <ActivityIndicator size="small" color="#f59e0b" />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={allPosts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingVertical: 8 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#f59e0b"
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        ListEmptyComponent || (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg">
              No posts available
            </Text>
          </View>
        )
      }
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={5}
    />
  );
}