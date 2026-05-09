import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Share,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Audio } from 'expo-av';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileText,
  Download,
  CheckCircle,
  Trash2,
  Edit,
} from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Comments } from './Comments';
import { useAppContext } from '@/context/AppContext';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { usePostActions } from '@/hooks/usePosts';
import { useCommentActions } from '@/hooks/useComments';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface PostUser {
  id: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  role?: string;
}

export interface PostData {
  id: string;
  title?: string;
  description?: string;
  post?: string;
  url?: string;
  type: 'image' | 'video' | 'audio' | 'document';
  for: 'praisevideo' | 'worshipvideo' | 'post' | 'event' | 'project' | 'preaching' | 'service' | string;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  user?: PostUser;
  userId?: string;
  likes?: Array<{ id: string; userId: string; user?: PostUser }>;
  comments?: Array<any>;
}

interface PostProps {
  post: PostData;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (post: PostData) => void;
  onUserPress?: (userId: string) => void;
  onMediaPress?: (post: PostData) => void;
  variant?: 'feed' | 'detail' | 'compact';
}

export const Post = memo(function Post({
  post,
  onLike,
  onShare,
  onUserPress,
  onMediaPress,
  variant = 'feed',
}: PostProps) {
  const { user } = useAppContext();
  const { verify, remove, like } = usePostActions();
  const { addComment } = useCommentActions(post.id);
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showFullText, setShowFullText] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [reloadComments, setReloadComments] = useState(false);

  const videoRef = useRef<Video>(null);
  const audioRef = useRef<Audio.Sound | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);
  const lastTapRef = useRef(0);

  useEffect(() => {
    if (user && post.likes) {
      const userLike = post.likes.find((l) => l.userId === user.id);
      if (userLike) {
        setIsLiked(true);
      }
    }
  }, [user, post.likes]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  const handleLike = useCallback(async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to like posts');
      return;
    }

    scale.value = withSequence(withSpring(1.2), withSpring(1));
    
    try {
      await like({ postId: post.id, userId: user.id });
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      onLike?.(post.id);
    } catch (err) {
      console.error(err);
    }
  }, [isLiked, post.id, user, like, onLike]);

  const handleDoubleTap = useCallback(() => {
    heartScale.value = 0;
    heartOpacity.value = 1;
    heartScale.value = withSequence(
      withSpring(1.5),
      withTiming(0, { duration: 500 })
    );
    heartOpacity.value = withTiming(0, { duration: 700 });
    
    if (!isLiked) {
      handleLike();
    }
  }, [isLiked, handleLike]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      handleDoubleTap();
    }
    lastTapRef.current = now;
  }, [handleDoubleTap]);

  const handleShare = useCallback(async () => {
    try {
      const postUrl = `https://ogudu.org/blog/${post.id}?page=${post.for}`;
      await Share.share({
        message: `${post.title || 'Check this out'}\n${postUrl}`,
        url: postUrl,
        title: post.title,
      });
      onShare?.(post);
    } catch (error) {
      Alert.alert('Error', 'Failed to share content');
    }
  }, [post, onShare]);

  const handleDelete = async () => {
    Alert.alert('Delete Post', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(post.id);
            Alert.alert('Success', 'Post deleted');
          } catch (err) {
            Alert.alert('Error', 'Failed to delete post');
          }
        }
      }
    ]);
  };

  const handleVerify = async () => {
    try {
      await verify(post.id);
      Alert.alert('Success', 'Post approved!');
    } catch (err) {
      Alert.alert('Error', 'Failed to approve post');
    }
  };

  const toggleAudioPlayback = useCallback(async () => {
    if (!post.url) return;

    if (isPlaying && audioRef.current) {
      await audioRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: post.url },
          { shouldPlay: true, isMuted },
          (status) => {
            if (status.isLoaded) {
              setAudioProgress(status.positionMillis || 0);
              setAudioDuration(status.durationMillis || 0);
              if (status.didJustFinish) {
                setIsPlaying(false);
                setAudioProgress(0);
              }
            }
          }
        );
        audioRef.current = sound;
      } else {
        await audioRef.current.playAsync();
      }
      setIsPlaying(true);
    }
  }, [isPlaying, post.url, isMuted]);

  const saveComment = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to comment');
      return;
    }
    if (commentText.length < 1) return;

    try {
      await addComment({
        userId: user.id,
        username: user.username,
        contentId: post.id,
        comment: commentText,
      });
      setCommentText('');
      setReloadComments(prev => !prev);
    } catch (err) {
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const renderMedia = () => {
    if (!post.url) return null;

    switch (post.type) {
      case 'image':
        return (
          <Pressable onPress={handleTap} className="w-full relative">
            <Image
              source={{ uri: post.url }}
              className="w-full aspect-square bg-gray-100"
              resizeMode="cover"
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
            {isLoading && (
              <View className="absolute inset-0 justify-center items-center bg-gray-50/50">
                <ActivityIndicator size="large" color="#f59e0b" />
              </View>
            )}
            <Animated.View 
              style={[heartAnimatedStyle, { position: 'absolute', top: '50%', left: '50%', marginLeft: -40, marginTop: -40 }]}
              pointerEvents="none"
            >
              <Heart size={80} color="white" fill="white" />
            </Animated.View>
          </Pressable>
        );

      case 'video':
        return (
          <Pressable onPress={handleTap} className="w-full aspect-video bg-black relative">
            <Video
              ref={videoRef}
              source={{ uri: post.url }}
              className="w-full h-full"
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay={isPlaying}
              isMuted={isMuted}
              onLoadStart={() => setIsLoading(true)}
              onLoad={() => setIsLoading(false)}
              useNativeControls={variant === 'detail'}
            />
            {isLoading && (
              <View className="absolute inset-0 justify-center items-center bg-black/50">
                <ActivityIndicator size="large" color="#f59e0b" />
              </View>
            )}
            {!isPlaying && variant === 'feed' && (
              <View className="absolute inset-0 justify-center items-center bg-black/20">
                <Pressable onPress={() => setIsPlaying(true)} className="w-16 h-16 rounded-full bg-black/50 justify-center items-center">
                  <Play color="white" size={32} fill="white" />
                </Pressable>
              </View>
            )}
          </Pressable>
        );

      case 'audio':
        return (
          <View className="w-full p-4 bg-orange-50 border-y border-orange-100">
            <View className="flex-row items-center gap-4">
              <Pressable
                onPress={toggleAudioPlayback}
                className="w-14 h-14 rounded-full bg-accent justify-center items-center shadow-lg"
              >
                {isPlaying ? (
                  <Pause color="white" size={24} fill="white" />
                ) : (
                  <Play color="white" size={24} fill="white" />
                )}
              </Pressable>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800" numberOfLines={1}>{post.title || 'Audio Message'}</Text>
                <View className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <View
                    className="h-full bg-accent"
                    style={{ width: `${audioDuration ? (audioProgress / audioDuration) * 100 : 0}%` }}
                  />
                </View>
              </View>
            </View>
          </View>
        );

      case 'document':
        return (
          <Pressable
            onPress={() => onMediaPress?.(post)}
            className="w-full p-4 bg-blue-50 flex-row items-center gap-4 border-y border-blue-100"
          >
            <View className="w-12 h-12 rounded-xl bg-accent/20 justify-center items-center">
              <FileText color="#f59e0b" size={28} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-gray-900 text-base" numberOfLines={1}>
                {post.title || 'Document'}
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5">Tap to view & download</Text>
            </View>
            <Download color="#6b7280" size={20} />
          </Pressable>
        );

      default:
        return null;
    }
  };

  const shouldTruncate = (post.post?.length || 0) > 150 && !showFullText;

  return (
    <View className="bg-white mb-6 shadow-sm">
      {/* Header */}
      <View className="flex-row items-center p-4 gap-3">
        <Pressable onPress={() => onUserPress?.(post.userId || '')}>
          <Image
            source={{
              uri: post.user?.avatarUrl || 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png',
            }}
            className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200"
          />
        </Pressable>
        <View className="flex-1">
          <Text className="font-bold text-gray-900 text-sm">
            {post.user?.username || 'Anonymous'}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {formatDate(post.updatedAt)}
          </Text>
        </View>
        {user?.role === 'admin' && (
          <View className="flex-row gap-2">
             {!post.isVerified && (
               <Pressable onPress={handleVerify} className="p-2 bg-green-50 rounded-full">
                 <CheckCircle size={20} color="#10b981" />
               </Pressable>
             )}
             <Pressable onPress={handleDelete} className="p-2 bg-red-50 rounded-full">
               <Trash2 size={20} color="#ef4444" />
             </Pressable>
          </View>
        )}
      </View>

      {/* Media */}
      <View className="bg-gray-50">
        {renderMedia()}
      </View>

      {/* Content */}
      <View className="p-4">
        {post.title && post.for !== 'post' && (
          <Text className="font-bold text-gray-900 text-lg mb-2">
            {post.title}
          </Text>
        )}
        
        {post.post && (
          <View>
            <Text className="text-gray-800 text-sm leading-relaxed">
              {shouldTruncate ? `${post.post.slice(0, 150)}...` : post.post}
            </Text>
            {shouldTruncate && (
              <Pressable onPress={() => setShowFullText(true)} className="mt-1">
                <Text className="text-accent font-semibold text-sm">Read more</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Actions Bar */}
        <View className="flex-row items-center mt-6 pt-4 border-t border-gray-100 gap-6">
          <Animated.View style={animatedStyle}>
            <Pressable onPress={handleLike} className="flex-row items-center gap-2">
              <Heart
                size={24}
                color={isLiked ? '#ef4444' : '#6b7280'}
                fill={isLiked ? '#ef4444' : 'transparent'}
              />
              <Text className={`font-semibold text-sm ${isLiked ? 'text-red-500' : 'text-gray-600'}`}>
                {likeCount}
              </Text>
            </Pressable>
          </Animated.View>

          <Pressable onPress={() => bottomSheetModalRef.current?.present()} className="flex-row items-center gap-2">
            <MessageCircle size={24} color="#6b7280" />
            <Text className="font-semibold text-gray-600 text-sm">
              {post.comments?.length || 0}
            </Text>
          </Pressable>

          <Pressable onPress={handleShare} className="ml-auto p-2 bg-gray-50 rounded-full">
            <Share2 size={20} color="#6b7280" />
          </Pressable>
        </View>
      </View>

      {/* Comments Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={['60%', '90%']}
        backdropComponent={(props: any) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
      >
        <BottomSheetView className="flex-1 p-4">
          <View className="flex-row items-center justify-between mb-4 border-b border-gray-100 pb-2">
            <Text className="text-xl font-bold text-gray-900">Comments</Text>
            <Text className="text-gray-500">{post.comments?.length || 0} total</Text>
          </View>
          
          <ScrollView className="flex-1">
             <Comments videoId={post.id} reload={reloadComments} />
          </ScrollView>

          {user ? (
            <View className="flex-row items-center gap-3 pt-4 border-t border-gray-100">
               <Image 
                 source={{ uri: user.avatarUrl || 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png' }}
                 className="w-10 h-10 rounded-full"
               />
               <TextInput 
                 className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm max-h-24"
                 placeholder="Write a comment..."
                 multiline
                 value={commentText}
                 onChangeText={setCommentText}
               />
               <Pressable 
                 onPress={saveComment}
                 disabled={commentText.length < 1}
                 className={`p-2 rounded-full ${commentText.length > 0 ? 'bg-accent' : 'bg-gray-200'}`}
               >
                 <Play color="white" size={20} fill="white" />
               </Pressable>
            </View>
          ) : (
            <View className="py-4 items-center">
               <Text className="text-gray-500 text-sm">Login to leave a comment</Text>
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
});
