import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'lucide-react-native';

interface ProfileHeaderProps {
  user: any;
  onEditAvatar: () => void;
}

export const ProfileHeader = ({ user, onEditAvatar }: ProfileHeaderProps) => {
  return (
    <View className="items-center mt-8 mb-10">
      <View className="relative">
        <Image
          source={{ uri: user.avatarUrl || 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png' }}
          className="w-32 h-32 rounded-full border-4 border-accent shadow-lg"
        />
        <TouchableOpacity 
          onPress={onEditAvatar}
          className="absolute bottom-0 right-0 bg-accent p-2 rounded-full border-2 border-white shadow-sm"
        >
          <Camera size={20} color="white" />
        </TouchableOpacity>
      </View>
      <Text className="text-3xl font-black text-gray-900 mt-4 tracking-tighter">
        {user.name || user.username}
      </Text>
      <View className="bg-accent/10 px-4 py-1 rounded-full mt-2">
        <Text className="text-accent text-xs font-bold uppercase tracking-widest">{user.role}</Text>
      </View>
    </View>
  );
};
