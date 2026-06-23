import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

export interface TestimonialPropType {
  id: string;
  name: string;
  title: string;
  quote: string;
  profileImage: string;
  rating?: number;
}

interface TestimonialPropProps {
  testimonial: TestimonialPropType;
}

export const TestimonialProp = ({ testimonial }: TestimonialPropProps) => {
  return (
    <View className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4 shadow-sm w-full">
      {/* Quote */}
      <Text className="text-sm italic text-slate-700 dark:text-slate-300 mb-3">
        "{testimonial.quote}"
      </Text>

      {/* Rating */}
      {testimonial.rating && (
        <View className="flex-row gap-1 mb-3">
          {Array(testimonial.rating)
            .fill(0)
            .map((_, i) => (
              <Text key={i} className="text-yellow-400">
                ★
              </Text>
            ))}
        </View>
      )}

      {/* Author */}
      <View className="flex-row items-center gap-3">
        <Image
          source={{ uri: testimonial.profileImage }}
          className="w-10 h-10 rounded-full"
        />
        <View className="flex-1">
          <Text className="font-semibold text-slate-900 dark:text-white text-sm">
            {testimonial.name}
          </Text>
          <Text className="text-xs text-slate-600 dark:text-slate-400">
            {testimonial.title}
          </Text>
        </View>
      </View>
    </View>
  );
};

interface TestimonialsSectionProps {
  testimonials: TestimonialPropType[];
  title?: string;
}

export const TestimonialsSection = ({
  testimonials,
  title = 'What People Say',
}: TestimonialsSectionProps) => {
  return (
    <View className="w-full py-8">
      {title && (
        <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          {title}
        </Text>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="gap-4"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {testimonials.map((testimonial) => (
          <View key={testimonial.id} className="w-80">
            <TestimonialProp testimonial={testimonial} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
