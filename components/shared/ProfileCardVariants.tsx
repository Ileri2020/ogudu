import React from 'react';
import { View, Text, Image } from 'react-native';

interface ProfileCardProps {
  name: string;
  title: string;
  profileImage: string;
  transparentBg?: boolean;
  className?: string;
}

export const ProfileCard = ({
  name,
  title,
  profileImage,
  className = '',
}: ProfileCardProps) => {
  return (
    <View className={`bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm w-56 ${className}`}>
      {/* Header with accent background */}
      <View className="h-16 bg-blue-500/20 flex justify-center items-center" />

      {/* Profile image overlapping header */}
      <View className="px-4 -mt-8 items-center">
        <View className="w-32 h-32 bg-white dark:bg-slate-700 rounded-full p-1 overflow-hidden">
          <Image
            source={{ uri: profileImage }}
            className="w-full h-full rounded-full"
          />
        </View>
      </View>

      {/* Info section */}
      <View className="py-4 px-4 items-center">
        <Text className="text-lg font-semibold text-slate-900 dark:text-white text-center">
          {name}
        </Text>
        <Text className="text-sm text-slate-600 dark:text-slate-400 text-center mt-1">
          {title}
        </Text>
      </View>
    </View>
  );
};

export const ProfileCardTransparentBG = ({
  name,
  title,
  profileImage,
  className = '',
}: ProfileCardProps) => {
  return (
    <View className={`rounded-lg overflow-hidden w-44 ${className}`}>
      {/* Profile image */}
      <View className="w-full h-32 items-center">
        <Image
          source={{ uri: profileImage }}
          className="w-full h-full rounded-lg"
        />
      </View>

      {/* Info section */}
      <View className="py-3 px-3 items-center">
        <Text className="text-base font-semibold text-slate-900 dark:text-white text-center">
          {name}
        </Text>
        <Text className="text-xs text-slate-600 dark:text-slate-400 text-center mt-1">
          {title}
        </Text>
      </View>
    </View>
  );
};
