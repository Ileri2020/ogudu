import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  accentTitle?: string;
  className?: string;
}

export const PageHeader = ({ title, subtitle, accentTitle, className }: PageHeaderProps) => {
  return (
    <View className={cn("px-6 pt-10 pb-6", className)}>
      <Text className="text-4xl font-black text-gray-900 tracking-tighter">
        {title} <Text className="text-accent">{accentTitle}</Text>
      </Text>
      {subtitle && (
        <Text className="text-lg text-gray-500 mt-2 font-medium">
          {subtitle}
        </Text>
      )}
    </View>
  );
};
