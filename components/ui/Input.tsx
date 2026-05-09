import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentPropsWithoutRef<typeof TextInput> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, label, error, containerClassName, ...props }, ref) => {
    return (
      <View className={cn('w-full gap-1.5', containerClassName)}>
        {label && (
          <Text className="text-sm font-medium text-gray-700 ml-1">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-base text-gray-900',
            error && 'border-red-500',
            className
          )}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        {error && (
          <Text className="text-xs text-red-500 ml-1">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export { Input };
