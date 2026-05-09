import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { cn } from '@/lib/utils';

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
}

const Checkbox = ({ checked, onCheckedChange, label, className }: CheckboxProps) => {
  return (
    <Pressable
      onPress={() => onCheckedChange?.(!checked)}
      className={cn('flex-row items-center gap-2 py-1', className)}
    >
      <View
        className={cn(
          'h-5 w-5 rounded border border-accent items-center justify-center',
          checked ? 'bg-accent' : 'bg-transparent'
        )}
      >
        {checked && <Check size={14} color="white" strokeWidth={3} />}
      </View>
      {label && (
        <Text className="text-sm font-medium text-gray-900">
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export { Checkbox };
