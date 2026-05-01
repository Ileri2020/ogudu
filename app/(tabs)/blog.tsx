import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '@/constants/Config';
import { Post } from '@/components/Post';
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
  const tabs = getTabs(user?.role === 'admin');
  const [activeTab, setActiveTab] = useState('praisevideo');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/dbhandler`, {
        params: { model: 'posts' },
      });
      let filtered = [];
      if (activeTab === 'unverified') {
        filtered = response.data.filter((p: { isVerified?: boolean }) => p.isVerified === false);
      } else {
        filtered = response.data.filter((p: { for: string, isVerified?: boolean }) => p.for === activeTab && p.isVerified !== false);
      }
      setPosts(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
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

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="py-4">
        <FlatList
          data={tabs}
          renderItem={renderTab}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <Post post={item} onUpdate={fetchPosts} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
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
