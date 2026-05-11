// components/shared/PostsList.tsx
import React, { useCallback, useState, useRef } from 'react';
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
  ViewToken,
} from 'react-native';
import { Post, PostData } from './Post';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/constants/Config';

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

  // ── Intersection observer: track which video is currently visible ──────────
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // A post is considered "viewable" when ≥60% of it is on screen for ≥200ms.
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
    minimumViewTime: 200,
  });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      // Find the first visible video post
      const firstVideo = viewableItems.find(
        (v) => v.isViewable && (v.item as PostData).type === 'video'
      );
      setActiveVideoId(firstVideo ? (firstVideo.item as PostData).id : null);
    }
  );

  // ── Data fetching ─────────────────────────────────────────────────────────

  const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const response = await axios.get(`${API_URL}/api/dbhandler`, {
      params: {
        model: 'posts',
        page: pageParam,
        limit: PAGE_SIZE,
        for: page === 'unverified' ? undefined : page,
        isVerified: page === 'unverified' ? 'false' : undefined,
      },
    });

    let posts: PostData[] = response.data;

    // Client-side type filtering
    if (page !== 'unverified') {
      posts = posts.filter((post) => {
        if (post.type === 'image' && postTypes.document) return true;
        return postTypes[post.type as keyof typeof postTypes] ?? false;
      });
    }

    // Sorting
    if (sortOrder === 'asc') {
      posts.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    } else if (sortOrder === 'desc') {
      posts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else {
      posts.sort(() => Math.random() - 0.5);
    }

    // Prioritize a specific media item if requested
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

  const allPosts = data?.pages.flatMap((p) => p.posts) ?? [];

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── Render ────────────────────────────────────────────────────────────────

  const renderItem = useCallback(
    ({ item }: { item: PostData }) => (
      <Post
        post={item}
        // Pass isActive so VideoPlayer pauses when scrolled out of view
        isActive={item.type !== 'video' || item.id === activeVideoId}
        onMediaPress={onPostPress}
        onUserPress={onUserPress}
        variant="feed"
      />
    ),
    [activeVideoId, onPostPress, onUserPress]
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
            <Text className="text-gray-500 text-lg">No posts available</Text>
          </View>
        )
      }
      // ── Intersection observer ──────────────────────────────────────────────
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewabilityConfig.current}
      // ─────────────────────────────────────────────────────────────────────
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={5}
    />
  );
}