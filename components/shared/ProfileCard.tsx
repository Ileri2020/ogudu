import React from 'react';
import { View, Text, Image } from 'react-native';

interface ProfileCardProps {
  name: string;
  title: string;
  profileImage: string;
  variant?: 'solid' | 'transparent';
}

export const ProfileCard = ({ name, title, profileImage, variant = 'solid' }: ProfileCardProps) => {
  return (
    <View 
      className={`relative w-44 h-56 items-center justify-between bg-white rounded-2xl m-2 shadow-sm border border-gray-100 overflow-hidden`}
    >
      <View className="h-[40%] w-full bg-accent/30 justify-center items-center">
        <View className="relative w-32 h-32 translate-y-10 bg-white rounded-full overflow-hidden border-4 border-white shadow-md">
          <Image 
            source={{ uri: profileImage || 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png' }} 
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>
      <View className="mb-4 items-center px-2">
        <Text className="font-bold text-base text-accent text-center" numberOfLines={1}>{name}</Text>
        <Text className="font-medium text-xs text-gray-500 text-center" numberOfLines={1}>{title}</Text>
      </View>
    </View>
  );
};

export const ProfileCardSmall = ({ name, title, profileImage }: ProfileCardProps) => {
  return (
    <View className="items-center m-2 w-24">
       <View className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent shadow-sm">
          <Image 
            source={{ uri: profileImage }} 
            className="w-full h-full"
            resizeMode="cover"
          />
       </View>
       <Text className="font-bold text-xs text-center mt-2" numberOfLines={1}>{name}</Text>
       <Text className="text-[10px] text-gray-500 text-center" numberOfLines={1}>{title}</Text>
    </View>
  );
};
