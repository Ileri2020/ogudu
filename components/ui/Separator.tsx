import React from 'react';
import { View } from 'react-native';
import { cn } from '@/lib/utils';

export interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const Separator = ({ className, orientation = 'horizontal' }: SeparatorProps) => {
  return (
    <View 
      className={cn(
        'bg-gray-100',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'w-[1px] h-full',
        className
      )}
    />
  );
};

export { Separator };
