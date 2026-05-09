import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface InfoItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}

export const InfoItem = ({ label, value, icon, className }: InfoItemProps) => {
  return (
    <View className={cn("flex-row items-center p-5 bg-gray-50 rounded-3xl mb-4 border border-gray-100", className)}>
      <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm">
        {icon}
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{label}</Text>
        <Text className="text-base text-gray-900 font-bold mt-0.5">{value}</Text>
      </View>
    </View>
  );
};
