import React from 'react';
import { View, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 border',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-accent',
        secondary: 'border-transparent bg-gray-100',
        destructive: 'border-transparent bg-red-500',
        outline: 'border-gray-200 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const badgeTextVariants = cva('text-[10px] font-bold uppercase tracking-wider', {
  variants: {
    variant: {
      default: 'text-white',
      secondary: 'text-gray-900',
      destructive: 'text-white',
      outline: 'text-gray-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: string;
  className?: string;
}

function Badge({ className, variant, children }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)}>
      <Text className={cn(badgeTextVariants({ variant }))}>
        {children}
      </Text>
    </View>
  );
}

export { Badge, badgeVariants };
