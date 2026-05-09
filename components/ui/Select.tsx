import React from 'react';
import { Pressable, Text, View, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Select = ({ options, value, onValueChange, placeholder = 'Select option', className }: SelectProps) => {
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className={cn(
          'flex-row h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 items-center justify-between',
          className
        )}
      >
        <Text className={cn('text-base', !selectedOption ? 'text-gray-400' : 'text-gray-900')}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={20} color="#9ca3af" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl p-6 min-h-[300px]">
                <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-xl font-bold text-gray-900">{placeholder}</Text>
                  <Pressable onPress={() => setOpen(false)}>
                    <Text className="text-accent font-bold">Done</Text>
                  </Pressable>
                </View>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        onValueChange(item.value);
                        setOpen(false);
                      }}
                      className={cn(
                        'py-4 border-b border-gray-50 flex-row justify-between items-center',
                        item.value === value && 'bg-accent/5 px-2 rounded-lg'
                      )}
                    >
                      <Text className={cn('text-base', item.value === value ? 'text-accent font-bold' : 'text-gray-900')}>
                        {item.label}
                      </Text>
                    </Pressable>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export { Select };
