import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/constants/Config';
import { Post } from '@/components/Post';
import { PostButton } from '@/components/PostButton';
import { useAppContext } from '@/context/AppContext';

const getTabs = (isAdmin: boolean) => {
  const tabs = [
    { id: 'praisevideo', label: 'Praise' },
    { id: 'worshipvideo', label: 'Worship' },
    { id: 'post', label: 'Posts' },
    { id: 'event', label: 'Events' },
    { id: 'project', label: 'Projects' },
    { id: 'service', label: 'Sermons' },
  ];
  if (isAdmin) {
    tabs.push({ id: 'unverified', label: 'Unverified' });
  }
  return tabs;
};

interface Tab {
  id: string;
  label: string;
}

export default function BlogScreen() {
  const { user } = useAppContext();
  const router = useRouter();
  const tabs = getTabs(user?.role === 'admin');
  const [activeTab, setActiveTab] = useState('praisevideo');
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  const categoryRoutes = [
    { id: 'posts', label: 'Posts', description: 'Browse sermons, events & updates' },
    { id: 'videos', label: 'Videos', description: 'Watch praise and worship clips' },
    { id: 'events', label: 'Events', description: 'See upcoming church gatherings' },
    { id: 'projects', label: 'Projects', description: 'Review ministry initiatives' },
    { id: 'sermons', label: 'Sermons', description: 'Listen to the latest messages' },
  ];

  const openCategory = (slug: string) => {
    router.push(`/category/${slug}` as any);
  };

  const fetchPosts = async (pageNum: number = 1, isRefresh: boolean = false) => {
    if (pageNum === 1) setLoading(true);
    try {
      const params: Record<string, any> = { 
        model: 'posts',
        page: pageNum,
        limit: LIMIT,
      };
      if (activeTab === 'unverified') {
        params.isVerified = 'false';
      } else {
        params.for = activeTab;
      }
      const response = await axios.get(`${API_URL}/api/dbhandler`, { params });
      const newPosts = response.data || [];
      
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(newPosts.length === LIMIT);
      setPage(pageNum);
    } catch (e) {
      console.error('Error fetching posts:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    fetchPosts(1);
  }, [activeTab]);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setPosts([]);
    setHasMore(true);
    fetchPosts(1, true);
  };

  const onEndReached = () => {
    if (!loadingMore && hasMore && !loading) {
      setLoadingMore(true);
      fetchPosts(page + 1);
    }
  };

  const renderTab = ({ item }: { item: Tab }) => (
    <TouchableOpacity 
      onPress={() => setActiveTab(item.id)}
      className={`px-6 py-2 rounded-full mr-2 ${activeTab === item.id ? 'bg-accent' : 'bg-secondary'}`}
    >
      <Text className={`font-bold ${activeTab === item.id ? 'text-white' : 'text-foreground/70'}`}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: { id: string; label: string; description: string } }) => (
    <TouchableOpacity
      className="mr-4 rounded-3xl bg-secondary p-4 shadow-sm"
      onPress={() => openCategory(item.id)}
    >
      <Text className="font-bold text-foreground mb-1">{item.label}</Text>
      <Text className="text-xs text-muted-foreground leading-5">{item.description}</Text>
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

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-6 pt-4">
        <PostButton onPostSuccess={() => onRefresh()} />
      </View>
      
      <View className="py-2">
        <FlatList
          data={tabs}
          renderItem={renderTab}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      <View className="px-6 mb-4">
        <Text className="text-lg font-bold text-foreground mb-3">Explore dedicated pages</Text>
        <FlatList
          data={categoryRoutes}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <Post post={item} onUpdate={() => onRefresh()} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View className="mt-20 items-center">
              <Text className="text-muted-foreground italic">No posts available in this category.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
