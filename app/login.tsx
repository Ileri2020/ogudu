import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
const { Alert, Image } = require('react-native') as { Alert: { alert: (t: string, m?: string, b?: any[]) => void }; Image: React.ComponentType<any> };
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '@/constants/Config';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen() {
  const { setUser } = useAppContext();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      setUser(response.data);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Login Failed', e.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    Alert.alert('Social Login', `${provider} login is coming soon to the native app!`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        <View className="items-center mb-10">
          <Text className="text-4xl font-extrabold text-accent">Welcome Back</Text>
          <Text className="text-muted-foreground mt-2">Sign in to continue to CCC Ogudu</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-bold text-foreground/70 mb-1 ml-1">Email</Text>
            <TextInput
              className="bg-secondary p-4 rounded-2xl border border-border/50 text-foreground"
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-foreground/70 mb-1 ml-1">Password</Text>
            <TextInput
              className="bg-secondary p-4 rounded-2xl border border-border/50 text-foreground"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity onPress={handleLogin} disabled={loading} className="mt-4">
            <LinearGradient
              colors={['#F97316', '#FB923C']}
              className="py-4 rounded-2xl items-center shadow-md shadow-accent/20"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Login</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center my-8">
          <View className="flex-1 h-[1px] bg-border/50" />
          <Text className="mx-4 text-muted-foreground">OR</Text>
          <View className="flex-1 h-[1px] bg-border/50" />
        </View>

        <View className="flex-row gap-4">
          <TouchableOpacity 
            onPress={() => handleSocialLogin('google')}
            className="flex-1 flex-row bg-secondary p-4 rounded-2xl border border-border/50 items-center justify-center"
          >
            <FontAwesome name="google" size={20} color="#EA4335" />
            <Text className="ml-2 font-bold text-foreground">Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleSocialLogin('facebook')}
            className="flex-1 flex-row bg-secondary p-4 rounded-2xl border border-border/50 items-center justify-center"
          >
            <FontAwesome name="facebook" size={20} color="#1877F2" />
            <Text className="ml-2 font-bold text-foreground">Facebook</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-10">
          <Text className="text-muted-foreground">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text className="text-accent font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
