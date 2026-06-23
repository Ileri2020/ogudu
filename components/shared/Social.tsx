import React from 'react';
import { View, Pressable, Linking } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

interface SocialProps {
  size?: number;
  gap?: number;
  color?: string;
  includeIcons?: ('facebook' | 'instagram' | 'twitter' | 'youtube' | 'whatsapp')[];
}

const socialLinks = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  twitter: 'https://twitter.com',
  youtube: 'https://youtube.com',
  whatsapp: 'https://wa.me/1234567890',
};

export const Social = ({
  size = 24,
  gap = 4,
  color = '#3b82f6',
  includeIcons = ['facebook', 'instagram', 'twitter', 'youtube', 'whatsapp'],
}: SocialProps) => {
  const handleSocialPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <View className={`flex-row gap-${gap} justify-center items-center`}>
      {includeIcons.includes('facebook') && (
        <Pressable onPress={() => handleSocialPress(socialLinks.facebook)}>
          <FontAwesome name="facebook" size={size} color={color} />
        </Pressable>
      )}
      {includeIcons.includes('instagram') && (
        <Pressable onPress={() => handleSocialPress(socialLinks.instagram)}>
          <FontAwesome name="instagram" size={size} color={color} />
        </Pressable>
      )}
      {includeIcons.includes('twitter') && (
        <Pressable onPress={() => handleSocialPress(socialLinks.twitter)}>
          <FontAwesome name="twitter" size={size} color={color} />
        </Pressable>
      )}
      {includeIcons.includes('youtube') && (
        <Pressable onPress={() => handleSocialPress(socialLinks.youtube)}>
          <FontAwesome name="youtube" size={size} color={color} />
        </Pressable>
      )}
      {includeIcons.includes('whatsapp') && (
        <Pressable onPress={() => handleSocialPress(socialLinks.whatsapp)}>
          <MaterialCommunityIcons name="whatsapp" size={size} color={color} />
        </Pressable>
      )}
    </View>
  );
};
