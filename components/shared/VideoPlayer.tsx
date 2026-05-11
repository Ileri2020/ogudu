// components/shared/VideoPlayer.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Text,
  Image,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { WebView } from 'react-native-webview';
import { Slider } from '@miblanchard/react-native-slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── YouTube helpers ──────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function buildYouTubeEmbedHtml(videoId: string, autoplay: boolean): string {
  return `<!DOCTYPE html><html><head>
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"/>
    <style>*{margin:0;padding:0;background:#000}body,html{width:100%;height:100%;overflow:hidden}iframe{width:100%;height:100%;border:none}</style>
  </head><body>
    <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&playsinline=1&rel=0&modestbranding=1"
      allow="autoplay;encrypted-media;fullscreen" allowfullscreen></iframe>
  </body></html>`;
}

// ─── Cloudinary thumbnail ─────────────────────────────────────────────────────

function getCloudinaryThumbnail(videoUrl: string): string | null {
  if (!videoUrl.includes('res.cloudinary.com')) return null;
  return videoUrl
    .replace('/video/upload/', '/video/upload/so_0,f_jpg/')
    .replace(/\.(mp4|mov|webm|avi|mkv|ogg)$/i, '.jpg');
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface VideoPlayerProps {
  uri: string;
  /** Optional poster/thumbnail URL override. Auto-derived for Cloudinary & YouTube if omitted. */
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  /** When false the player pauses – used by PostsList intersection observer */
  isActive?: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onProgress?: (progress: { currentTime: number; duration: number }) => void;
  onComplete?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VideoPlayer({
  uri,
  poster,
  title,
  autoPlay = false,
  isActive = true,
  onFullscreenChange,
  onProgress,
  onComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [youtubeActive, setYoutubeActive] = useState(false);
  const controlsOpacity = useSharedValue(1);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isYT = isYouTubeUrl(uri);
  const ytId = isYT ? extractYouTubeId(uri) : null;

  // Derive thumbnail: explicit poster > YouTube hq > Cloudinary frame grab
  const thumbnailUri =
    poster ||
    (isYT && ytId ? getYouTubeThumbnail(ytId) : null) ||
    (!isYT ? getCloudinaryThumbnail(uri) : null) ||
    undefined;

  const isPlaying = status?.isLoaded ? status.isPlaying : false;
  const duration = status?.isLoaded ? status.durationMillis ?? 0 : 0;
  const position = status?.isLoaded ? status.positionMillis ?? 0 : 0;

  const controlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  // ── Pause when scrolled out of view ──────────────────────────────────────

  useEffect(() => {
    if (!isActive) {
      if (isYT) {
        // Tear down the WebView so YouTube stops playing
        setYoutubeActive(false);
        setShowThumbnail(true);
      } else if (videoRef.current) {
        videoRef.current.pauseAsync().catch(() => {});
      }
    }
  }, [isActive, isYT]);

  // ── Controls auto-hide ────────────────────────────────────────────────────

  const showControlsTemporarily = useCallback(() => {
    controlsOpacity.value = withTiming(1, { duration: 200 });
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        controlsOpacity.value = withTiming(0, { duration: 200 });
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying, controlsOpacity]);

  // ── Cloudinary / direct video ─────────────────────────────────────────────

  const handlePlaybackStatusUpdate = useCallback(
    (newStatus: AVPlaybackStatus) => {
      setStatus(newStatus);
      setIsLoading(false);
      if (newStatus.isLoaded) {
        onProgress?.({
          currentTime: newStatus.positionMillis / 1000,
          duration: (newStatus.durationMillis ?? 0) / 1000,
        });
        if (newStatus.didJustFinish) onComplete?.();
      }
    },
    [onProgress, onComplete]
  );

  const togglePlayPause = useCallback(async () => {
    if (showThumbnail) {
      setShowThumbnail(false);
      setIsLoading(true);
      return;
    }
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    showControlsTemporarily();
  }, [isPlaying, showThumbnail, showControlsTemporarily]);

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
      const newPosition = Math.max(0, Math.min(duration, position + seconds * 1000));
      await videoRef.current.setPositionAsync(newPosition);
      showControlsTemporarily();
    },
    [status, duration, position, showControlsTemporarily]
  );

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  // ─── YouTube Player ────────────────────────────────────────────────────────

  if (isYT) {
    if (!ytId) {
      return (
        <View className="w-full bg-black justify-center items-center" style={{ aspectRatio: 16 / 9 }}>
          <Text className="text-red-400 text-sm font-semibold">Invalid YouTube URL</Text>
        </View>
      );
    }

    return (
      <View className="w-full bg-black relative" style={{ aspectRatio: 16 / 9 }}>
        {/* Thumbnail overlay shown until user taps play */}
        {showThumbnail ? (
          <Pressable
            className="absolute inset-0 justify-center items-center"
            onPress={() => {
              setShowThumbnail(false);
              setYoutubeActive(true);
            }}
          >
            {thumbnailUri ? (
              <Image source={{ uri: thumbnailUri }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="w-full h-full bg-gray-900 justify-center items-center">
                <Text className="text-4xl opacity-40">🎬</Text>
              </View>
            )}
            {/* YouTube-style red play button */}
            <View className="absolute items-center justify-center">
              <View className="w-16 h-12 rounded-xl bg-red-600 justify-center items-center shadow-lg">
                <Play color="white" size={28} fill="white" />
              </View>
              {title ? (
                <Text className="text-white text-xs font-bold mt-2 bg-black/60 px-3 py-1 rounded-full" numberOfLines={1}>
                  {title}
                </Text>
              ) : null}
            </View>
            {/* YouTube badge */}
            <View className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded">
              <Text className="text-white text-[10px] font-bold tracking-wide">▶ YouTube</Text>
            </View>
          </Pressable>
        ) : youtubeActive ? (
          <WebView
            className="flex-1"
            source={{ html: buildYouTubeEmbedHtml(ytId, true) }}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
          />
        ) : null}
      </View>
    );
  }

  // ─── Cloudinary / Direct Video Player ─────────────────────────────────────

  return (
    <Pressable
      onPress={showThumbnail ? togglePlayPause : showControlsTemporarily}
      className="w-full bg-black relative"
      style={{ aspectRatio: 16 / 9 }}
    >
      {/* Actual video – hidden behind thumbnail until first play */}
      {!showThumbnail && (
        <Video
          ref={videoRef}
          source={{ uri }}
          className="w-full h-full"
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={!showThumbnail && (autoPlay || isPlaying)}
          isMuted={isMuted}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
        />
      )}

      {/* Thumbnail */}
      {showThumbnail && (
        <Pressable className="absolute inset-0" onPress={togglePlayPause}>
          {thumbnailUri ? (
            <Image source={{ uri: thumbnailUri }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full bg-gray-900 justify-center items-center">
              <Text className="text-4xl opacity-30">🎬</Text>
            </View>
          )}
          <View className="absolute inset-0 justify-center items-center">
            <View className="w-16 h-16 rounded-full bg-black/50 justify-center items-center">
              <Play color="white" size={32} fill="white" />
            </View>
          </View>
        </Pressable>
      )}

      {/* Loading */}
      {isLoading && !showThumbnail && (
        <View className="absolute inset-0 justify-center items-center bg-black/40">
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      )}

      {/* Controls overlay – only when not on thumbnail */}
      {!showThumbnail && (
        <Animated.View
          style={[controlsStyle, { position: 'absolute', inset: 0 }]}
          pointerEvents={showControls ? 'auto' : 'none'}
        >
          {/* Center play/pause */}
          <View className="absolute inset-0 justify-center items-center">
            <Pressable
              onPress={togglePlayPause}
              className="w-16 h-16 rounded-full bg-black/50 justify-center items-center"
            >
              {isPlaying ? <Pause color="white" size={32} fill="white" /> : <Play color="white" size={32} fill="white" />}
            </Pressable>
          </View>

          {/* Bottom controls */}
          <View className="absolute bottom-0 left-0 right-0 p-4">
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
            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center gap-4">
                <Pressable onPress={() => skip(-10)}>
                  <SkipBack color="white" size={20} />
                </Pressable>
                <Pressable onPress={togglePlayPause}>
                  {isPlaying ? <Pause color="white" size={20} fill="white" /> : <Play color="white" size={20} fill="white" />}
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
                  {isMuted ? <VolumeX color="white" size={20} /> : <Volume2 color="white" size={20} />}
                </Pressable>
                <Pressable onPress={() => onFullscreenChange?.(true)}>
                  <Maximize2 color="white" size={20} />
                </Pressable>
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
}