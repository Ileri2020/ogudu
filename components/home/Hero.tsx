import React from 'react';
import { View, Text } from 'react-native';
import { ZoomInText, TextCarousel } from '@/components/shared';

export const Hero = () => {
  return (
    <View className="pt-10 pb-6 bg-white overflow-hidden">
      <View className="items-center px-6 mb-8">
        <Text className="text-[48px] leading-[52px] font-black text-accent tracking-tighter text-center">
          CCC OGUDU
        </Text>
        <Text className="text-[36px] leading-[40px] font-bold text-gray-400 text-center uppercase tracking-widest mt-1">
          Expressway Cathedral
        </Text>
      </View>

      <View className="my-4">
        <TextCarousel 
          text="O GOOD FOREVER *** O GOOD FOREVER *** " 
          imageUrl="https://cccogudu.vercel.app/crown.webp"
        />
      </View>
      
      <View className="h-12 justify-center items-center px-10">
        <ZoomInText 
          text="Where Miracles Happen and Faith Grows" 
          className="text-gray-500 text-center italic text-lg" 
        />
      </View>
    </View>
  );
};
