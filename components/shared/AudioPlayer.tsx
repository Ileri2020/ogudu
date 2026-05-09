// components/shared/AudioPlayer.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Pressable, Image, Dimensions, Text } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Slider } from '@miblanchard/react-native-slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Heart,
  ListMusic,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Track {
  id: string;
  url: string;
  title: string;
  artist?: string;
  artwork?: string;
  duration?: number;
}

interface AudioPlayerProps {
  tracks: Track[];
  initialTrackIndex?: number;
  onTrackChange?: (index: number) => void;
  variant?: 'mini' | 'full';
  onExpand?: () => void;
}

export function AudioPlayer({
  tracks,
  initialTrackIndex = 0,
  onTrackChange,
  variant = 'mini',
  onExpand,
}: AudioPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialTrackIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [isLiked, setIsLiked] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);
  const progressInterval = useRef<number | null>(null);
  const artworkScale = useSharedValue(1);

  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    loadTrack(currentIndex);
    return () => {
      soundRef.current?.unloadAsync();
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  const loadTrack = async (index: number) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: tracks[index].url },
      { shouldPlay: isPlaying },
      onPlaybackStatusUpdate
    );

    soundRef.current = sound;
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        handleNext();
      }
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
      artworkScale.value = withSpring(1);
    } else {
      await soundRef.current.playAsync();
      artworkScale.value = withRepeat(
        withTiming(1.05, { duration: 2000 }),
        -1,
        true
      );
    }
  };

  const handleNext = useCallback(() => {
    let nextIndex: number;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
    }
    setCurrentIndex(nextIndex);
    onTrackChange?.(nextIndex);
    loadTrack(nextIndex);
  }, [currentIndex, isShuffled, tracks.length, onTrackChange]);

  const handlePrevious = useCallback(() => {
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    onTrackChange?.(prevIndex);
    loadTrack(prevIndex);
  }, [currentIndex, tracks.length, onTrackChange]);

  const seekTo = async (value: number) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(value);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const animatedArtworkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: artworkScale.value }],
  }));

  if (variant === 'mini') {
    return (
      <Pressable
        onPress={onExpand}
        className="w-full h-16 bg-white border-t border-gray-200 flex-row items-center px-4 gap-3"
      >
        <Animated.View style={animatedArtworkStyle}>
          <Image
            source={{
              uri:
                currentTrack?.artwork ||
                'https://via.placeholder.com/48',
            }}
            className="w-10 h-10 rounded-lg bg-gray-200"
          />
        </Animated.View>

        <View className="flex-1">
          <Text className="font-semibold text-sm" numberOfLines={1}>
            {currentTrack?.title}
          </Text>
          <Text className="text-xs text-gray-500" numberOfLines={1}>
            {currentTrack?.artist || 'Unknown Artist'}
          </Text>
        </View>

        <Pressable onPress={togglePlayPause} className="p-2">
          {isPlaying ? (
            <Pause size={24} color="#374151" fill="#374151" />
          ) : (
            <Play size={24} color="#374151" fill="#374151" />
          )}
        </Pressable>

        <Pressable onPress={handleNext} className="p-2">
          <SkipForward size={20} color="#6b7280" />
        </Pressable>
      </Pressable>
    );
  }

  // Full Player
  return (
    <View className="flex-1 bg-white">
      {/* Artwork */}
      <View className="flex-1 justify-center items-center px-8">
        <Animated.View style={[animatedArtworkStyle, { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 }]}>
          <Image
            source={{
              uri:
                currentTrack?.artwork ||
                'https://via.placeholder.com/300',
            }}
            className="w-72 h-72 rounded-3xl bg-gray-200"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.25,
              shadowRadius: 30,
              elevation: 10,
            }}
          />
        </Animated.View>
      </View>

      {/* Track Info */}
      <View className="px-8 mb-6">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-4">
            <Text className="text-2xl font-bold" numberOfLines={2}>
              {currentTrack?.title}
            </Text>
            <Text className="text-lg text-gray-500 mt-1">
              {currentTrack?.artist || 'Unknown Artist'}
            </Text>
          </View>
          <Pressable onPress={() => setIsLiked(!isLiked)} className="p-2">
            <Heart
              size={24}
              color={isLiked ? '#ef4444' : '#6b7280'}
              fill={isLiked ? '#ef4444' : 'transparent'}
            />
          </Pressable>
        </View>
      </View>

      {/* Progress */}
      <View className="px-8 mb-4">
        <Slider
          value={position}
          minimumValue={0}
          maximumValue={duration}
          onSlidingComplete={(value) => seekTo(Array.isArray(value) ? value[0] : value)}
          minimumTrackTintColor="#f59e0b"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#f59e0b"
        />
        <View className="flex-row justify-between mt-1">
          <Text className="text-xs text-gray-500">
            {formatTime(position)}
          </Text>
          <Text className="text-xs text-gray-500">
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View className="flex-row justify-center items-center gap-8 mb-8">
        <Pressable onPress={() => setIsShuffled(!isShuffled)}>
          <Shuffle
            size={20}
            color={isShuffled ? '#f59e0b' : '#6b7280'}
          />
        </Pressable>

        <Pressable onPress={handlePrevious}>
          <SkipBack size={32} color="#374151" fill="#374151" />
        </Pressable>

        <Pressable
          onPress={togglePlayPause}
          className="w-16 h-16 rounded-full bg-accent justify-center items-center"
        >
          {isPlaying ? (
            <Pause size={32} color="white" fill="white" />
          ) : (
            <Play size={32} color="white" fill="white" />
          )}
        </Pressable>

        <Pressable onPress={handleNext}>
          <SkipForward size={32} color="#374151" fill="#374151" />
        </Pressable>

        <Pressable
          onPress={() =>
            setRepeatMode(
              repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none'
            )
          }
        >
          <Repeat
            size={20}
            color={repeatMode !== 'none' ? '#f59e0b' : '#6b7280'}
          />
        </Pressable>
      </View>
    </View>
  );
}