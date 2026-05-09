import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui';

export const QuickActions = () => {
  const router = useRouter();
  
  return (
    <View className="flex-row justify-center gap-4 mt-6 px-6">
      <Button 
        className="flex-1 shadow-lg shadow-accent/40"
        onPress={() => router.push('/category/praisevideo')}
      >
        Praise
      </Button>
      <Button 
        className="flex-1 shadow-lg shadow-accent/40"
        variant="outline"
        onPress={() => router.push('/category/worshipvideo')}
      >
        Worship
      </Button>
    </View>
  );
};
