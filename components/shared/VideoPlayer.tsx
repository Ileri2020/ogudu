// components/shared/VideoPlayer.tsx
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Platform,
  Text,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Slider } from '@miblanchard/react-native-slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  Volume2,
  VolumeX,
} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoPlayerProps {
  uri: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onProgress?: (progress: { currentTime: number; duration: number }) => void;
  onComplete?: () => void;
}

export function VideoPlayer({
  uri,
  poster,
  title,
  autoPlay = false,
  onFullscreenChange,
  onProgress,
  onComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsOpacity = useSharedValue(1);
  const controlsTimeoutRef = useRef<number | null>(null);

  const isPlaying = status?.isLoaded ? status.isPlaying : false;
  const duration = status?.isLoaded ? status.durationMillis ?? 0 : 0;
  const position = status?.isLoaded ? status.positionMillis ?? 0 : 0;

  const controlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  const showControlsTemporarily = useCallback(() => {
    controlsOpacity.value = withTiming(1, { duration: 200 });
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        controlsOpacity.value = withTiming(0, { duration: 200 });
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying, controlsOpacity]);

  const handlePlaybackStatusUpdate = useCallback(
    (newStatus: AVPlaybackStatus) => {
      setStatus(newStatus);
      setIsLoading(false);

      if (newStatus.isLoaded) {
        onProgress?.({
          currentTime: newStatus.positionMillis / 1000,
          duration: (newStatus.durationMillis ?? 0) / 1000,
        });

        if (newStatus.didJustFinish) {
          onComplete?.();
        }
      }
    },
    [onProgress, onComplete]
  );

  const togglePlayPause = useCallback(async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    showControlsTemporarily();
  }, [isPlaying, showControlsTemporarily]);

  const seekTo = useCallback(
    async (value: number) => {
      if (!videoRef.current || !status?.isLoaded) return;
      await videoRef.current.setPositionAsync(value);
      showControlsTemporarily();
    },
    [status, showControlsTemporarily]
  );

  const skip = useCallback(
    async (seconds: number) => {
      if (!videoRef.current || !status?.isLoaded) return;
      const newPosition = Math.max(
        0,
        Math.min(duration, position + seconds * 1000)
      );
      await videoRef.current.setPositionAsync(newPosition);
      showControlsTemporarily();
    },
    [status, duration, position, showControlsTemporarily]
  );

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Pressable
      onPress={showControlsTemporarily}
      className="w-full bg-black relative"
      style={{ aspectRatio: 16 / 9 }}
    >
      <Video
        ref={videoRef}
        source={{ uri }}
        className="w-full h-full"
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={autoPlay}
        isMuted={isMuted}
        posterSource={poster ? { uri: poster } : undefined}
        usePoster={!!poster}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onLoadStart={() => setIsLoading(true)}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View className="absolute inset-0 justify-center items-center">
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      )}

      {/* Controls Overlay */}
      <Animated.View
        style={[controlsStyle, { position: 'absolute', inset: 0 }]}
        pointerEvents={showControls ? 'auto' : 'none'}
      >
        {/* Top gradient */}
        <View className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Center Play/Pause */}
        <View className="absolute inset-0 justify-center items-center">
          <Pressable
            onPress={togglePlayPause}
            className="w-16 h-16 rounded-full bg-black/50 justify-center items-center"
          >
            {isPlaying ? (
              <Pause color="white" size={32} fill="white" />
            ) : (
              <Play color="white" size={32} fill="white" />
            )}
          </Pressable>
        </View>

        {/* Bottom Controls */}
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          {/* Progress Bar */}
          <Slider
            value={position}
            minimumValue={0}
            maximumValue={duration}
            onSlidingComplete={(value) => seekTo(Array.isArray(value) ? value[0] : value)}
            minimumTrackTintColor="#f59e0b"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#f59e0b"
            trackStyle={{ height: 4 }}
          />

          {/* Time & Buttons */}
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center gap-4">
              <Pressable onPress={() => skip(-10)}>
                <SkipBack color="white" size={20} />
              </Pressable>

              <Pressable onPress={togglePlayPause}>
                {isPlaying ? (
                  <Pause color="white" size={20} fill="white" />
                ) : (
                  <Play color="white" size={20} fill="white" />
                )}
              </Pressable>

              <Pressable onPress={() => skip(10)}>
                <SkipForward color="white" size={20} />
              </Pressable>

              <Text className="text-white text-xs ml-2">
                {formatTime(position)} / {formatTime(duration)}
              </Text>
            </View>

            <View className="flex-row items-center gap-3">
              <Pressable onPress={() => setIsMuted(!isMuted)}>
                {isMuted ? (
                  <VolumeX color="white" size={20} />
                ) : (
                  <Volume2 color="white" size={20} />
                )}
              </Pressable>

              <Pressable onPress={() => onFullscreenChange?.(true)}>
                <Maximize2 color="white" size={20} />
              </Pressable>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}