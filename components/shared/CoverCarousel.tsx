import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Dimensions, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CoverItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  onPress?: () => void;
}

interface CoverCarouselProps {
  items: CoverItem[];
  title?: string;
}

const { width } = Dimensions.get('window');

export const CoverCarousel = ({ items, title = 'Featured' }: CoverCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View className="w-full">
      {title && (
        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4 px-4">
          {title}
        </Text>
      )}

      {/* Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const slide = Math.ceil(
            e.nativeEvent.contentOffset.x / (width - 32)
          );
          setActiveIndex(slide === 0 ? 0 : slide);
        }}
        scrollEventThrottle={16}
        className="gap-4"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            className="mb-4"
            style={{ width: width - 32 }}
          >
            <View className="rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
              <Image
                source={{ uri: item.image }}
                className="w-full h-56"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black/20 justify-end p-4">
                <Text className="text-white font-bold text-lg">{item.title}</Text>
                {item.subtitle && (
                  <Text className="text-white/80 text-sm">{item.subtitle}</Text>
                )}
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Indicators */}
      <View className="flex-row justify-center gap-2 mt-4">
        {items.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${
              index === activeIndex
                ? 'w-6 bg-blue-600'
                : 'w-2 bg-slate-300 dark:bg-slate-600'
            }`}
          />
        ))}
      </View>
    </View>
  );
};
