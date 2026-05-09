import React from 'react';
import { View, Text, Image, ScrollView, Dimensions, Pressable } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface Testimonial {
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  text: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  title?: string;
  description?: string;
}

export const TestimonialsCarousel = ({ testimonials, title, description }: TestimonialsCarouselProps) => {
  return (
    <View className="py-12 bg-gray-50">
      {(title || description) && (
        <View className="px-6 mb-8">
          {title && <Text className="text-3xl font-bold text-gray-900">{title}</Text>}
          {description && <Text className="text-base text-gray-500 mt-2">{description}</Text>}
        </View>
      )}

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        snapToInterval={SCREEN_WIDTH * 0.8 + 16}
        decelerationRate="fast"
      >
        {testimonials.map((item, index) => (
          <View 
            key={index} 
            style={{ width: SCREEN_WIDTH * 0.8 }}
            className="mr-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <View className="flex-row items-center gap-4 mb-4">
               <Image 
                 source={{ uri: item.author.avatar }} 
                 className="w-12 h-12 rounded-full bg-gray-200"
               />
               <View>
                 <Text className="font-bold text-gray-900">{item.author.name}</Text>
                 <Text className="text-xs text-gray-500">{item.author.handle}</Text>
               </View>
            </View>
            <Text className="text-gray-700 italic leading-relaxed">
              "{item.text}"
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
