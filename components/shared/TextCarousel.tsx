import React, { useEffect } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  interpolate
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TextCarouselProps {
  text?: string;
  image?: boolean;
  imageUrl?: string;
  speed?: number;
}

export const TextCarousel = ({ 
  text = 'O GOOD FOREVER *** ', 
  image = true, 
  imageUrl = 'https://cccogudu.vercel.app/crown.webp',
  speed = 10000 
}: TextCarouselProps) => {
  const rotation = useSharedValue(0);
  const chars = text.split('');
  const radius = 120; // Distance from center

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: speed, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  return (
    <View className="h-64 justify-center items-center overflow-visible" style={{ transform: [{ perspective: 1000 }] }}>
      {/* Background/Center Image */}
      {image && (
        <View className="z-10 bg-white/20 p-4 rounded-full">
          <Image 
            source={{ uri: imageUrl }} 
            className="w-32 h-32" 
            resizeMode="contain" 
          />
        </View>
      )}

      {/* Rotating Text */}
      {chars.map((char, index) => {
        const angleOffset = (index / chars.length) * 360;
        
        const animatedStyle = useAnimatedStyle(() => {
          const currentAngle = (rotation.value + angleOffset) % 360;
          const rad = (currentAngle * Math.PI) / 180;
          
          // Basic 3D transform simulation
          const translateX = Math.sin(rad) * radius;
          const translateZ = Math.cos(rad) * radius;
          const scale = interpolate(translateZ, [-radius, radius], [0.6, 1.2]);
          const opacity = interpolate(translateZ, [-radius, radius], [0.2, 1]);
          
          return {
            transform: [
              { translateX },
              { scale },
            ],
            opacity,
            zIndex: Math.round(translateZ),
          };
        });

        return (
          <Animated.View 
            key={index} 
            className="absolute"
            style={animatedStyle}
          >
            <Text className="text-3xl font-black text-accent text-outline shadow-sm">
              {char}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
};
