import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
const { Image } = require('react-native') as { Image: React.ComponentType<any> };
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MediaCarousel } from '@/components/MediaCarousel';

const categoryContent = {
  posts: {
    title: 'Latest Posts',
    description: 'Read through the newest reflections, announcements, and church stories.',
    items: [
      { id: 'post-1', title: 'Sunday Devotional', subtitle: 'A fresh word for your week', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80', type: 'image' },
      { id: 'post-2', title: 'Community Outreach', subtitle: 'See how we serve together', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80', type: 'image' },
    ],
  },
  videos: {
    title: 'Video Library',
    description: 'Browse praise clips, sermon highlights, and worship moments.',
    items: [
      { id: 'video-1', title: 'Sunday Praise', subtitle: 'Praise service highlights', image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=800&q=80', type: 'video' },
      { id: 'video-2', title: 'Worship Session', subtitle: 'Live worship and prayer', image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=80', type: 'video' },
    ],
  },
  events: {
    title: 'Event Highlights',
    description: 'Stay informed on upcoming meetings and special gatherings.',
    items: [
      { id: 'event-1', title: 'Prayer Night', subtitle: 'Join us for a powerful worship night', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80', type: 'image' },
      { id: 'event-2', title: 'Children’s Ministry', subtitle: 'Fun, faith, and fellowship for kids', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80', type: 'image' },
    ],
  },
  projects: {
    title: 'Ministry Projects',
    description: 'Explore our ongoing initiatives and community service work.',
    items: [
      { id: 'project-1', title: 'Feeding Program', subtitle: 'Serving families in need', image: 'https://images.unsplash.com/photo-1496409333686-1ae3f535b3ef?auto=format&fit=crop&w=800&q=80', type: 'image' },
      { id: 'project-2', title: 'School Support', subtitle: 'Equipping local learners', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80', type: 'image' },
    ],
  },
  sermons: {
    title: 'Sermon Series',
    description: 'Listen to the latest messages from our pastors and guest speakers.',
    items: [
      { id: 'sermon-1', title: 'Faith Over Fear', subtitle: 'Message for this season', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80', type: 'audio' },
      { id: 'sermon-2', title: 'Hope Restored', subtitle: 'A word of encouragement', image: 'https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=800&q=80', type: 'audio' },
    ],
  },
};

export default function CategoryScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const category = slug && categoryContent[slug as keyof typeof categoryContent];

  if (!category) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
        <Text className="text-2xl font-bold text-foreground">Category not found</Text>
        <Text className="text-muted-foreground mt-3 text-center">
          Use the home feed to explore available sections.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-6 pt-6">
        <Text className="text-3xl font-extrabold text-accent">{category.title}</Text>
        <Text className="text-base text-muted-foreground mt-3">{category.description}</Text>
      </View>

      <MediaCarousel />

      <FlatList
        data={category.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/detail/${item.id}?type=${encodeURIComponent(item.type)}` as any)}
            activeOpacity={0.88}
            className="mt-5 rounded-3xl bg-secondary overflow-hidden shadow-sm"
          >
            <Image
              source={{ uri: item.image }}
              className="w-full h-52"
              resizeMode="cover"
            />
            <View className="p-4">
              <Text className="text-xl font-bold text-foreground">{item.title}</Text>
              <Text className="text-sm text-muted-foreground mt-2">{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
