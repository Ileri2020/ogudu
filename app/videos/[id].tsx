import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
const { Image, Dimensions } = require('react-native') as { Image: React.ComponentType<any>; Dimensions: { get: (d: string) => { width: number } } };
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { API_URL } from '@/constants/Config';
import { MediaCarousel } from '@/components/MediaCarousel';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function VideoDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`${API_URL}/api/dbhandler`, { params: { model: 'posts' } })
        .then(res => {
          const found = res.data.find((p: any) => String(p.id) === String(id));
          setPost(found);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <SafeAreaView className="flex-1 bg-background justify-center items-center"><ActivityIndicator size="large" color="#F97316" /></SafeAreaView>;
  if (!post) return <SafeAreaView className="flex-1 bg-background justify-center items-center px-6"><Text className="text-2xl font-bold text-foreground">Content not found</Text><TouchableOpacity onPress={() => router.back()} className="mt-6 rounded-full bg-secondary px-6 py-3"><Text className="text-foreground font-semibold">Go Back</Text></TouchableOpacity></SafeAreaView>;

  const renderMedia = () => {
    if (post.url?.includes('youtube')) {
      const videoId = post.url.split('v=')[1]?.split('&')[0];
      return (
        <View className="mt-4 rounded-3xl overflow-hidden shadow-sm" style={{ height: 240, width: width - 32 }}>
          <WebView source={{ uri: `https://www.youtube.com/embed/${videoId}` }} allowsFullscreenVideo />
        </View>
      );
    }

    if (post.type === 'video') {
      return (
        <Video source={{ uri: post.url }} rate={1.0} isMuted={false} resizeMode={ResizeMode.CONTAIN} useNativeControls style={{ width: width - 32, height: 240, borderRadius: 24, marginTop: 16 }} />
      );
    }

    return <Image source={{ uri: post.url }} className="w-full h-72 rounded-3xl mt-4" resizeMode="cover" />;
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1">
        <View className="px-6 pt-6 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="rounded-full bg-secondary/80 p-2 mr-4">
            <MaterialIcons name="arrow-back" size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Video View</Text>
        </View>
        <View className="px-6 mt-4">
          <Text className="text-3xl font-extrabold text-accent">{post.title || 'Video'}</Text>
        </View>
        <View className="px-6">{renderMedia()}</View>
        <View className="mt-8 px-6">
          <Text className="text-xl font-bold text-foreground mb-3">Description</Text>
          <Text className="text-base text-foreground/80 leading-7">{post.post}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
