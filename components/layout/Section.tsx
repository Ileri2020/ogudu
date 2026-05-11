import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface SectionProps {
  title?: string;
  accentTitle?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  rightElement?: React.ReactNode;
}

export const Section = ({ 
  title, 
  accentTitle,
  description, 
  children, 
  className,
  titleClassName,
  rightElement
}: SectionProps) => {
  return (
    <View className={cn("py-8 px-6", className)}>
      {(title || description) && (
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-1">
            {title && (
              <Text className={cn("text-3xl font-black text-gray-900 tracking-tighter", titleClassName)}>
                {title} {accentTitle && <Text className="text-accent">{accentTitle}</Text>}
              </Text>
            )}
            {description && (
              <Text className="text-base text-gray-500 mt-2 leading-relaxed">
                {description}
              </Text>
            )}
          </View>
          {rightElement && (
            <View className="ml-4">
              {rightElement}
            </View>
          )}
        </View>
      )}
      {children}
    </View>
  );
};
