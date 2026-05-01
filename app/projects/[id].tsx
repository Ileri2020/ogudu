import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/constants/Config';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProjectDetailScreen() {
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
  if (!post) return <SafeAreaView className="flex-1 bg-background justify-center items-center px-6"><Text className="text-2xl font-bold text-foreground">Project not found</Text><TouchableOpacity onPress={() => router.back()} className="mt-6 rounded-full bg-secondary px-6 py-3"><Text className="text-foreground font-semibold">Go Back</Text></TouchableOpacity></SafeAreaView>;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1">
        <Image source={{ uri: post.url }} className="w-full h-80 bg-secondary" resizeMode="cover" />
        <TouchableOpacity onPress={() => router.back()} className="absolute top-6 left-6 rounded-full bg-background/80 p-2 shadow-sm">
          <MaterialIcons name="arrow-back" size={24} color="#F97316" />
        </TouchableOpacity>
        
        <View className="px-6 mt-8">
          <Text className="text-sm font-bold text-accent uppercase tracking-wider mb-2">Church Project</Text>
          <Text className="text-4xl font-extrabold text-foreground">{post.title || 'Untitled Project'}</Text>
          <View className="flex-row items-center mt-4 border-b border-border pb-4">
            <Image source={{ uri: post.user?.avatarUrl || 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png' }} className="w-8 h-8 rounded-full mr-3" />
            <Text className="text-base font-medium text-muted-foreground">Posted by {post.user?.username || 'Admin'}</Text>
          </View>
        </View>

        <View className="mt-6 px-6 mb-10">
          <Text className="text-xl font-bold text-foreground mb-4">Project Details</Text>
          <Text className="text-base text-foreground/80 leading-7">{post.post}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
