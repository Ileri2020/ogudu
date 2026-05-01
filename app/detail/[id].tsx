import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
const { Image, Dimensions } = require('react-native') as { Image: React.ComponentType<any>; Dimensions: { get: (d: string) => { width: number } } };
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';
import { MediaCarousel } from '@/components/MediaCarousel';
import { useState } from 'react';

import { API_URL } from '@/constants/Config';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (id) {
      axios.get(`${API_URL}/api/dbhandler`, { params: { model: 'posts' } })
        .then(res => {
          const found = res.data.find((p: any) => String(p.id) === String(id));
          setItem(found);
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
        <Text className="text-muted-foreground mt-3">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
        <Text className="text-2xl font-bold text-foreground">Content not found</Text>
        <Text className="text-muted-foreground mt-3 text-center">
          The item you are looking for does not exist or has been removed.
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 rounded-full bg-secondary px-6 py-3">
          <Text className="text-foreground font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1">
        <View className="px-6 pt-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-4 rounded-full bg-secondary/80 px-4 py-2 self-start">
            <Text className="text-sm font-semibold text-foreground">Back</Text>
          </TouchableOpacity>
          <Text className="text-4xl font-extrabold text-accent">{item.title}</Text>
          <Text className="text-base text-muted-foreground mt-3">{item.post}</Text>
        </View>

        <View className="mt-6 px-6">
          {item.type === 'image' && item.url && (
            <Image
              source={{ uri: item.url }}
              className="w-full h-72 rounded-3xl"
              resizeMode="cover"
            />
          )}

          {item.type === 'video' && item.url && !item.url.includes('youtube') && (
            <Video
              source={{ uri: item.url }}
              rate={1.0}
              isMuted={false}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              style={{ width: width - 32, height: 240, borderRadius: 24 }}
            />
          )}

          {item.type === 'audio' && item.url && (
            <View className="rounded-3xl bg-secondary p-6 mt-4">
              <Text className="text-xl font-bold text-foreground">Listen Now</Text>
              <Video
                source={{ uri: item.url }}
                useNativeControls
                style={{ width: '100%', height: 56, marginTop: 16 }}
              />
            </View>
          )}

          {item.url && item.url.includes('youtube') && (
            <View className="mt-4 rounded-3xl overflow-hidden shadow-sm" style={{ height: 240, width: width - 32 }}>
              <WebView
                source={{ uri: `https://www.youtube.com/embed/${item.url.split('v=')[1]?.split('&')[0]}` }}
                allowsFullscreenVideo
              />
            </View>
          )}
        </View>

        <View className="mt-8 px-6">
          <Text className="text-2xl font-bold text-foreground">About this content</Text>
          <Text className="text-base text-muted-foreground mt-3 leading-7">
            {item.post}
          </Text>
        </View>

        <View className="mt-8 px-6">
          <Text className="text-2xl font-bold text-foreground mb-4">Related Media</Text>
          <MediaCarousel />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
