import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Social } from './Social';

interface FooterProps {
  variant?: 'default' | 'minimal' | 'extended';
}

const CATEGORIES = [
  { title: 'CATEGORIES', items: ['First Link', 'Second Link', 'Third Link', 'Fourth Link'] },
  { title: 'PRODUCT', items: ['Audio', 'Video', 'Books', 'Services'] },
  { title: 'COMPANY', items: ['About Us', 'Contact', 'Blog', 'Help'] },
];

export const Footer = ({ variant = 'default' }: FooterProps) => {
  return (
    <View className="bg-slate-50 dark:bg-slate-900 py-12 px-4">
      {/* Main Footer Content */}
      <View className="max-w-6xl mx-auto">
        {/* Logo Section */}
        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <MaterialIcons name="music-note" size={24} color="white" />
            </View>
            <Text className="text-xl font-bold text-slate-900 dark:text-white">
              OguduMusic
            </Text>
          </View>
          <Text className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">
            Discover inspiring content through worship and preaching
          </Text>
        </View>

        {/* Categories */}
        {variant !== 'minimal' && (
          <View className="flex-row gap-8 mb-8 flex-wrap">
            {CATEGORIES.map((category, idx) => (
              <View key={idx}>
                <Text className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">
                  {category.title}
                </Text>
                {category.items.map((item, itemIdx) => (
                  <Pressable key={itemIdx} className="mb-2">
                    <Text className="text-slate-600 dark:text-slate-400 text-sm">
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Bottom Section */}
        <View className="border-t border-slate-200 dark:border-slate-700 pt-8">
          <View className="flex-row justify-between items-center flex-wrap gap-4">
            <Text className="text-sm text-slate-600 dark:text-slate-400">
              © 2024 OguduMusic - All rights reserved
            </Text>
            <Social size={20} />
          </View>
        </View>
      </View>
    </View>
  );
};

export const Footer1 = () => {
  return (
    <View className="bg-slate-100 dark:bg-slate-800 py-8 px-4">
      <View className="max-w-6xl mx-auto">
        <View className="flex-row justify-between items-center flex-wrap gap-4">
          <Text className="text-sm font-semibold text-slate-900 dark:text-white">
            Follow Us on Social Media
          </Text>
          <Social size={24} />
        </View>
      </View>
    </View>
  );
};

export const Footer2 = () => {
  return (
    <View className="bg-slate-900 dark:bg-black py-12 px-4">
      <View className="max-w-6xl mx-auto">
        {/* Quick Links */}
        <View className="flex-row justify-around mb-8 flex-wrap gap-4">
          {['Privacy', 'Terms', 'FAQ', 'Support'].map((link) => (
            <Pressable key={link}>
              <Text className="text-blue-400 font-semibold">{link}</Text>
            </Pressable>
          ))}
        </View>

        {/* Copyright */}
        <View className="items-center gap-4">
          <Social size={24} color="white" />
          <Text className="text-slate-400 text-xs text-center">
            © 2024 OguduMusic. All rights reserved.
          </Text>
        </View>
      </View>
    </View>
  );
};
