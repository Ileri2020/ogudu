import React from 'react';
import { View, Text } from 'react-native';
const { Image } = require('react-native') as { Image: React.ComponentType<any> };

interface ProfileCardProps {
  name: string;
  title: string;
  image: string;
}

export const ProfileCard = ({ name, title, image }: ProfileCardProps) => {
  return (
    <View className="bg-secondary rounded-3xl overflow-hidden w-[46%] h-64 mb-8 shadow-md border border-border">
      <View className="h-[40%] w-full bg-accent/30 items-center justify-center">
        <View className="w-32 h-32 bg-white rounded-full overflow-hidden translate-y-12 border-4 border-secondary shadow-lg">
          <Image
            source={{ uri: image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>
      <View className="mt-16 items-center px-2">
        <Text className="font-bold text-center text-accent text-base" numberOfLines={2}>{name}</Text>
        <Text className="text-[10px] text-center text-muted-foreground uppercase tracking-widest mt-1">{title}</Text>
      </View>
    </View>
  );
};
