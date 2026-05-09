// components/shared/Carousel.tsx
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue,
  SharedValue,
} from 'react-native-reanimated';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 0.85;
const ITEM_SPACING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

interface CarouselItem {
  id: string;
  url: string;
  title?: string;
  subtitle?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
  onItemPress?: (item: CarouselItem, index: number) => void;
  variant?: 'cards' | 'full-width' | 'coverflow';
}

export function Carousel({
  items,
  autoPlay = false,
  autoPlayInterval = 3000,
  showPagination = true,
  showNavigation = true,
  onItemPress,
  variant = 'cards',
}: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<CarouselItem>>(null);
  const scrollX = useSharedValue(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollX.value = event.nativeEvent.contentOffset.x;
      const index = Math.round(
        event.nativeEvent.contentOffset.x / (ITEM_WIDTH + 20)
      );
      setActiveIndex(index);
    },
    [scrollX]
  );

  const goToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= items.length) return;
      flatListRef.current?.scrollToOffset({
        offset: index * (ITEM_WIDTH + 20),
        animated: true,
      });
    },
    [items.length]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: CarouselItem; index: number }) => {
      if (variant === 'coverflow') {
        return (
          <CoverflowItem
            item={item}
            index={index}
            scrollX={scrollX}
            onPress={() => onItemPress?.(item, index)}
          />
        );
      }

      return (
        <Pressable
          onPress={() => onItemPress?.(item, index)}
          className="rounded-2xl overflow-hidden bg-gray-100"
          style={{
            width: ITEM_WIDTH,
            marginHorizontal: 10,
          }}
        >
          <Image
            source={{ uri: item.url }}
            className="w-full aspect-[4/3]"
            resizeMode="cover"
          />
          {(item.title || item.subtitle) && (
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              {item.title && (
                <Text className="text-white font-bold text-lg">
                  {item.title}
                </Text>
              )}
              {item.subtitle && (
                <Text className="text-white/80 text-sm mt-1">
                  {item.subtitle}
                </Text>
              )}
            </View>
          )}
        </Pressable>
      );
    },
    [variant, onItemPress, scrollX]
  );

  return (
    <View className="w-full">
      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + 20}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: ITEM_SPACING - 10,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Pagination Dots */}
      {showPagination && (
        <View className="flex-row justify-center items-center mt-4 space-x-2">
          {items.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-6 bg-accent'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </View>
      )}

      {/* Navigation Arrows */}
      {showNavigation && (
        <>
          <Pressable
            onPress={() => goToIndex(activeIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg justify-center items-center"
            style={{ display: activeIndex === 0 ? 'none' : 'flex' }}
          >
            <ChevronLeft size={24} color="#374151" />
          </Pressable>
          <Pressable
            onPress={() => goToIndex(activeIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg justify-center items-center"
            style={{
              display: activeIndex === items.length - 1 ? 'none' : 'flex',
            }}
          >
            <ChevronRight size={24} color="#374151" />
          </Pressable>
        </>
      )}
    </View>
  );
}

// Coverflow variant with 3D effect
function CoverflowItem({
  item,
  index,
  scrollX,
  onPress,
}: {
  item: CarouselItem;
  index: number;
  scrollX: SharedValue<number>;
  onPress?: () => void;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * (ITEM_WIDTH + 20),
      index * (ITEM_WIDTH + 20),
      (index + 1) * (ITEM_WIDTH + 20),
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      'clamp'
    );
    const rotateY = interpolate(
      scrollX.value,
      inputRange,
      [45, 0, -45],
      'clamp'
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      'clamp'
    );

    return {
      transform: [
        { perspective: 1000 },
        { scale },
        { rotateY: `${rotateY}deg` },
      ],
      opacity,
    };
  });

  return (
    <Animated.View style={[{ width: ITEM_WIDTH, marginHorizontal: 10 }, animatedStyle]}>
      <Pressable onPress={onPress} className="rounded-2xl overflow-hidden">
        <Image
          source={{ uri: item.url }}
          className="w-full aspect-[4/3]"
          resizeMode="cover"
        />
      </Pressable>
    </Animated.View>
  );
}