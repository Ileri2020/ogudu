import React from 'react';
import { View, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LogobgProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'light' | 'dark' | 'gradient';
}

export const Logobg = ({
  size = 'medium',
  showText = true,
  variant = 'light',
}: LogobgProps) => {
  const sizeMap = {
    small: { container: 'w-16 h-16', icon: 32 },
    medium: { container: 'w-24 h-24', icon: 48 },
    large: { container: 'w-32 h-32', icon: 64 },
  };

  const variantClasses = {
    light: 'bg-white dark:bg-slate-700 shadow-lg',
    dark: 'bg-slate-900 dark:bg-black shadow-lg',
    gradient: 'bg-gradient-to-br from-blue-600 to-purple-600',
  };

  const textColorMap = {
    light: 'text-slate-900 dark:text-white',
    dark: 'text-white',
    gradient: 'text-white',
  };

  const current = sizeMap[size];

  return (
    <View className="items-center gap-3">
      {/* Logo Container */}
      <View
        className={`${current.container} ${variantClasses[variant]} rounded-2xl flex items-center justify-center`}
      >
        <MaterialIcons
          name="music-note"
          size={current.icon}
          color={
            variant === 'light'
              ? '#3b82f6'
              : variant === 'dark'
                ? '#60a5fa'
                : 'white'
          }
        />
      </View>

      {/* Text */}
      {showText && (
        <View className="items-center gap-1">
          <Text
            className={`font-bold text-center ${
              size === 'small'
                ? 'text-sm'
                : size === 'medium'
                  ? 'text-lg'
                  : 'text-2xl'
            } ${textColorMap[variant]}`}
          >
            OguduMusic
          </Text>
          <Text
            className={`text-xs text-center ${
              variant === 'light'
                ? 'text-slate-600 dark:text-slate-400'
                : variant === 'dark'
                  ? 'text-slate-400'
                  : 'text-white/80'
            }`}
          >
            Worship & Preaching
          </Text>
        </View>
      )}
    </View>
  );
};
