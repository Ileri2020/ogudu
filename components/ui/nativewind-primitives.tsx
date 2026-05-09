// components/ui/nativewind-primitives.tsx
import React from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';

// Card
export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <View className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </View>
);

// Button
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  className?: string;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  onPress,
  className = '',
}: ButtonProps) => {
  const variants = {
    primary: 'bg-accent text-white',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-red-500 text-white',
    outline: 'border-2 border-accent text-accent bg-transparent',
    ghost: 'bg-transparent text-accent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-lg flex-row items-center justify-center font-medium active:opacity-80 disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <ActivityIndicator size="small" color={variant === 'primary' ? 'white' : '#f59e0b'} className="mr-2" />}
      {typeof children === 'string' ? (
        <Text className={`font-medium ${variant === 'primary' || variant === 'destructive' ? 'text-white' : ''}`}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

// Input
interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const Input = ({
  className = '',
  multiline,
  numberOfLines,
  ...props
}: InputProps) => (
  <TextInput
    className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-base text-gray-900 placeholder:text-gray-400 focus:border-accent focus:ring-1 focus:ring-accent ${className}`}
    style={multiline ? { minHeight: numberOfLines ? numberOfLines * 24 : 100, textAlignVertical: 'top' } : undefined}
    multiline={multiline}
    numberOfLines={numberOfLines}
    {...props}
  />
);

// Badge
export const Badge = ({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}) => {
  const variants = {
    default: 'bg-accent/10 text-accent',
    secondary: 'bg-gray-100 text-gray-700',
    destructive: 'bg-red-100 text-red-700',
    outline: 'border border-gray-200 text-gray-700',
  };

  return (
    <View className={`px-2.5 py-0.5 rounded-full ${variants[variant]}`}>
      <Text className={`text-xs font-medium ${variant === 'default' ? 'text-accent' : variant === 'destructive' ? 'text-red-700' : 'text-gray-700'}`}>
        {children}
      </Text>
    </View>
  );
};

// Separator
export const Separator = ({ className = '' }: { className?: string }) => (
  <View className={`h-px bg-gray-200 w-full ${className}`} />
);

// Avatar
export const Avatar = ({
  source,
  size = 'md',
  fallback,
}: {
  source?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  return (
    <View className={`${sizes[size]} rounded-full bg-gray-200 overflow-hidden justify-center items-center`}>
      {source ? (
        <Image
          source={{ uri: source }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <Text className="font-bold text-gray-500">
          {fallback?.charAt(0).toUpperCase() || '?'}
        </Text>
      )}
    </View>
  );
};