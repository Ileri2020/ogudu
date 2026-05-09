import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';

interface AnimatedTextProps {
  text: string;
  className?: string;
  type?: 'fade' | 'slide' | 'scale' | 'zoom' | 'fly';
}

export const AnimatedText = ({ text, className, type = 'fade' }: AnimatedTextProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.8);
  const translateX = useSharedValue(-50);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
    translateY.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.back(1.5)) });
    scale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.back(1.5)) });
    translateX.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });
  }, [text]);

  const animatedStyle = useAnimatedStyle(() => {
    switch (type) {
      case 'slide':
        return {
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }],
        };
      case 'scale':
      case 'zoom':
        return {
          opacity: opacity.value,
          transform: [{ scale: scale.value }],
        };
      case 'fly':
        return {
          opacity: opacity.value,
          transform: [{ translateX: translateX.value }],
        };
      default:
        return {
          opacity: opacity.value,
        };
    }
  });

  return (
    <Animated.View style={animatedStyle}>
      <Text className={className}>{text}</Text>
    </Animated.View>
  );
};

export const ZoomInText = ({ text, className }: { text: string; className?: string }) => (
  <AnimatedText text={text} className={className} type="zoom" />
);

export const FlyInText = ({ text, className }: { text: string; className?: string }) => (
  <AnimatedText text={text} className={className} type="fly" />
);

export const SlideUpText = ({ text, className }: { text: string; className?: string }) => (
  <AnimatedText text={text} className={className} type="slide" />
);
