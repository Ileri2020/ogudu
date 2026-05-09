import React from 'react';
import { View, ScrollView, SafeAreaView, StatusBar, ViewStyle } from 'react-native';
import { cn } from '@/lib/utils';

interface ScreenProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
  safe?: boolean;
  style?: ViewStyle;
}

export const Screen = ({ 
  children, 
  className, 
  scrollable = true, 
  safe = true,
  style 
}: ScreenProps) => {
  const Container = safe ? SafeAreaView : View;
  const Wrapper = scrollable ? ScrollView : View;

  return (
    <Container className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <Wrapper 
        className={cn("flex-1", className)}
        showsVerticalScrollIndicator={false}
        style={style}
      >
        {children}
      </Wrapper>
    </Container>
  );
};
