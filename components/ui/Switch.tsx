import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  className?: string;
}

const Switch = ({ value, onValueChange, className }: SwitchProps) => {
  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withTiming(value ? 20 : 0, { duration: 200 }) }
      ],
    };
  });

  const trackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      value ? 1 : 0,
      [0, 1],
      ['#e5e7eb', '#f59e0b']
    );
    return { backgroundColor };
  });

  return (
    <Pressable 
      onPress={() => onValueChange?.(!value)}
      className={cn('w-11 h-6 rounded-full p-1', className)}
    >
      <Animated.View style={[trackStyle]} className="absolute inset-0 rounded-full" />
      <Animated.View 
        style={[thumbStyle]} 
        className="w-4 h-4 bg-white rounded-full shadow-sm" 
      />
    </Pressable>
  );
};

export { Switch };
