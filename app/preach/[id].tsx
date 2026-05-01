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

export default function PreachDetailScreen() {
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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#F97316" />
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
        <Text className="text-2xl font-bold text-foreground">Content not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 rounded-full bg-secondary px-6 py-3">
          <Text className="text-foreground font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderMedia = () => {
    if (post.for === 'service' && post.url?.includes('youtube')) {
      const videoId = post.url.split('v=')[1]?.split('&')[0];
      return (
        <View className="mt-4 rounded-3xl overflow-hidden shadow-sm" style={{ height: 240, width: width - 32 }}>
          <WebView source={{ uri: `https://www.youtube.com/embed/${videoId}` }} allowsFullscreenVideo />
        </View>
      );
    }

    if (post.type === 'video') {
      return (
        <Video
          source={{ uri: post.url }}
          rate={1.0}
          isMuted={false}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          style={{ width: width - 32, height: 240, borderRadius: 24, marginTop: 16 }}
        />
      );
    }

    if (post.type === 'audio') {
      return (
        <View className="rounded-3xl bg-secondary p-6 mt-4 flex-row items-center">
          <MaterialIcons name="audiotrack" size={32} color="#F97316" />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-foreground">Listen to Sermon</Text>
            <Video source={{ uri: post.url }} useNativeControls style={{ width: '100%', height: 40, marginTop: 8 }} />
          </View>
        </View>
      );
    }

    if (post.type === 'image' || post.url) {
      return (
        <Image
          source={{ uri: post.url }}
          className="w-full h-72 rounded-3xl mt-4"
          resizeMode="cover"
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1">
        <View className="px-6 pt-6 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="rounded-full bg-secondary/80 p-2 mr-4">
            <MaterialIcons name="arrow-back" size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sermon Detail</Text>
        </View>
        
        <View className="px-6 mt-4">
          <Text className="text-3xl font-extrabold text-accent">{post.title || 'Untitled Sermon'}</Text>
          <View className="flex-row items-center mt-3">
            <Image source={{ uri: post.user?.avatarUrl || 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png' }} className="w-6 h-6 rounded-full mr-2" />
            <Text className="text-sm font-medium text-foreground">{post.user?.username || 'Admin'}</Text>
            <Text className="text-sm text-muted-foreground ml-2">• {new Date(post.updatedAt).toLocaleDateString()}</Text>
          </View>
        </View>

        <View className="px-6">
          {renderMedia()}
        </View>

        <View className="mt-8 px-6">
          <Text className="text-xl font-bold text-foreground mb-3">About this message</Text>
          <Text className="text-base text-foreground/80 leading-7">{post.post}</Text>
        </View>

        <View className="mt-12 px-6 mb-10">
          <Text className="text-xl font-bold text-foreground mb-4">More Media</Text>
          <MediaCarousel />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
