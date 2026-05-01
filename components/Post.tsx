import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Share, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { API_URL } from '@/constants/Config';
import { useAppContext } from '@/context/AppContext';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface PostData {
  id: string;
  title?: string;
  post: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  for: string;
  updatedAt: string;
  isVerified?: boolean;
  user?: {
    username: string;
    avatarUrl: string;
  };
}

export const Post = ({ post, onUpdate }: { post: PostData, onUpdate?: () => void }) => {
  const { user } = useAppContext();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeId, setLikeId] = useState<string | null>(null);

  useEffect(() => {
    fetchLikes();
  }, [post.id]);

  const fetchLikes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dbhandler?model=likes&id=${post.id}`);
      setLikeCount(res.data.length);
      const userLike = res.data.find((l: { userId: string, id: string }) => l.userId === user?.id);
      if (userLike) {
        setLiked(true);
        setLikeId(userLike.id);
      }
    } catch (e) {}
  };

  const handleLike = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please sign in to like posts.');
      return;
    }
    try {
      if (!liked) {
        const res = await axios.post(`${API_URL}/api/dbhandler?model=likes`, {
          userId: user.id,
          contentId: post.id,
        });
        setLiked(true);
        setLikeId(res.data.id);
        setLikeCount(c => c + 1);
      } else {
        await axios.delete(`${API_URL}/api/dbhandler?model=likes&id=${likeId}`);
        setLiked(false);
        setLikeId(null);
        setLikeCount(c => c - 1);
      }
    } catch (e) {}
  };

  const handleDelete = async () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/api/dbhandler?model=posts&id=${post.id}`);
            if (onUpdate) onUpdate();
          } catch (e) {
            Alert.alert('Error', 'Failed to delete post');
          }
        },
      },
    ]);
  };

  const handleVerify = async () => {
    try {
      await axios.put(`${API_URL}/api/dbhandler?model=posts&id=${post.id}`, {
        isVerified: true
      });
      Alert.alert('Success', 'Post approved!');
      if (onUpdate) onUpdate();
    } catch (e) {
      Alert.alert('Error', 'Failed to approve post');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this post from CCC Ogudu: ${post.title || ''} ${API_URL}/blog/${post.id}`,
      });
    } catch (e) {}
  };

  const renderMedia = () => {
    if (post.for === 'service' && post.url?.includes('youtube')) {
      const videoId = post.url.split('v=')[1]?.split('&')[0];
      return (
        <View style={{ height: 200, width: '100%' }}>
          <WebView
            source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
            allowsFullscreenVideo
            scrollEnabled={false}
          />
        </View>
      );
    }

    if (post.type === 'image') {
      return (
        <Image
          source={{ uri: post.url }}
          className="w-full aspect-square"
          resizeMode="cover"
        />
      );
    }

    if (post.type === 'video') {
      return (
        <Video
          source={{ uri: post.url }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          useNativeControls
          style={{ width: '100%', height: 300 }}
        />
      );
    }

    if (post.type === 'audio') {
      return (
        <View className="bg-secondary p-4 flex-row items-center">
          <Ionicons name="musical-notes" size={24} color="#F97316" />
          <Text className="ml-2 flex-1 font-semibold text-foreground">Audio Content</Text>
          <Video
            source={{ uri: post.url }}
            useNativeControls
            style={{ width: 0, height: 0 }}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <View className="mb-8 w-full max-w-sm bg-secondary rounded-2xl overflow-hidden shadow-sm self-center">
      {/* Header */}
      <View className="flex-row items-center p-3">
        <Image
          source={{ uri: post.user?.avatarUrl || 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png' }}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-foreground">{post.user?.username}</Text>
          <Text className="text-xs text-muted-foreground">{new Date(post.updatedAt).toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity onPress={handleShare}>
          <MaterialIcons name="share" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Admin Actions */}
      {user?.role === 'admin' && (
        <View className="flex-row gap-2 px-3 pb-3">
          {post.isVerified === false && (
            <TouchableOpacity 
              className="flex-1 bg-yellow-500/10 py-1 rounded-lg items-center"
              onPress={handleVerify}
            >
              <Text className="text-yellow-600 text-xs font-bold">Approve</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            className="flex-1 bg-accent/10 py-1 rounded-lg items-center"
            onPress={() => {/* TODO: Edit */}}
          >
            <Text className="text-accent text-xs font-bold">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 bg-destructive/10 py-1 rounded-lg items-center"
            onPress={handleDelete}
          >
            <Text className="text-destructive text-xs font-bold">Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Media Content */}
      {renderMedia()}

      {/* Body */}
      <View className="p-4">
        {post.title && <Text className="font-bold text-lg mb-1">{post.title}</Text>}
        <Text className="text-foreground/80 leading-5">{post.post}</Text>

        <View className="flex-row items-center mt-4 pt-4 border-t border-border/50">
          <TouchableOpacity 
            className="flex-row items-center mr-6" 
            onPress={handleLike}
          >
            <MaterialIcons 
              name={liked ? "thumb-up" : "thumb-up-off-alt"} 
              size={22} 
              color={liked ? "#F97316" : "#6B7280"} 
            />
            <Text className={`ml-1 font-semibold ${liked ? 'text-accent' : 'text-muted-foreground'}`}>{likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center">
            <MaterialIcons name="chat-bubble-outline" size={20} color="#6B7280" />
            <Text className="ml-1 text-muted-foreground font-semibold">Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
