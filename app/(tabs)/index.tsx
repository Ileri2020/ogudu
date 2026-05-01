import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UpcomingEvents } from '@/components/UpcomingEvents';
import { MediaCarousel } from '@/components/MediaCarousel';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1">
        {/* Hero Section */}
        <View className="items-center mt-10 px-6">
          <Text className="text-5xl font-extrabold text-accent text-center">CCC OGUDU</Text>
          <Text className="text-3xl font-bold text-primary/80 text-center uppercase tracking-tighter">Expressway Cathedral</Text>
          
          <View className="mt-6 items-center">
            <Text className="text-muted-foreground text-center italic">"O Good Forever..."</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-center gap-4 mt-12 px-6">
          <TouchableOpacity 
            onPress={() => router.push('/category/videos')}
            className="flex-1"
          >
            <LinearGradient
              colors={['#F97316', '#FB923C']}
              className="rounded-2xl py-4 items-center shadow-md"
            >
              <Text className="text-white font-bold text-lg">Praise</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/category/videos')}
            className="flex-1"
          >
            <LinearGradient
              colors={['#F97316', '#FB923C']}
              className="rounded-2xl py-4 items-center shadow-md"
            >
              <Text className="text-white font-bold text-lg">Worship</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Featured Image or Banner */}
        <View className="mt-12 px-6">
          <View className="bg-secondary rounded-3xl overflow-hidden h-48 relative">
            <Image 
              source={{ uri: 'https://cccogudu.vercel.app/crown.webp' }} 
              className="w-full h-full opacity-60"
              resizeMode="contain"
            />
            <View className="absolute inset-0 justify-center items-center">
               <Text className="text-2xl font-bold text-foreground text-center px-10">Worship and Pray With Us</Text>
            </View>
          </View>
        </View>

        {/* Featured Media Carousel */}
        <MediaCarousel />

        {/* Upcoming Events */}
        <UpcomingEvents />

        {/* Testimonials Placeholder */}
        <View className="mt-16 px-6 mb-10">
          <Text className="text-3xl font-bold text-center">Testimonials</Text>
          <View className="w-20 h-1 bg-accent my-4 mx-auto rounded-full" />
          <View className="bg-muted/50 p-6 rounded-2xl border border-border italic">
            <Text className="text-foreground/80 text-center">"A place of miracles and divine intervention. Truly a blessed community."</Text>
            <Text className="text-accent font-bold mt-4 text-center">- Faithful Member</Text>
          </View>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
