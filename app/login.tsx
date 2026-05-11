import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
const { Alert } = require('react-native') as { Alert: { alert: (t: string, m?: string, b?: any[]) => void } };
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '@/constants/Config';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { setUser } = useAppContext();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    // You should put your actual client IDs here from Google Cloud Console
    androidClientId: "GOOGLE_ANDROID_CLIENT_ID",
    iosClientId: "GOOGLE_IOS_CLIENT_ID",
    webClientId: "GOOGLE_WEB_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleLogin(authentication?.accessToken);
    }
  }, [response]);

  const handleGoogleLogin = async (token?: string) => {
    if (!token) return;
    setSocialLoading(true);
    try {
      // 1. Fetch user info from Google
      const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await userInfoResponse.json();

      // 2. Send to our backend
      const res = await axios.post(`${API_URL}/api/auth/social`, {
        email: userInfo.email,
        name: userInfo.name,
        avatarUrl: userInfo.picture,
        providerId: userInfo.id,
        provider: 'google'
      });

      setUser(res.data);
      router.replace('/(tabs)');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Google Login Error', 'Failed to authenticate with Google');
    } finally {
      setSocialLoading(false);
    }
  };

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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-center">
        <View className="mb-12">
          <Text className="text-5xl font-black text-gray-900 tracking-tighter">Welcome</Text>
          <Text className="text-lg text-gray-500 mt-2 font-medium">Sign in to your account</Text>
        </View>

        <View className="gap-y-5">
          <View>
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</Text>
            <TextInput
              className="bg-gray-50 p-5 rounded-3xl border border-gray-100 text-gray-900 font-semibold"
              placeholder="name@example.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</Text>
            <TextInput
              className="bg-gray-50 p-5 rounded-3xl border border-gray-100 text-gray-900 font-semibold"
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            onPress={handleLogin} 
            disabled={loading || socialLoading} 
            className="mt-4 active:opacity-80"
          >
            <LinearGradient
              colors={['#f59e0b', '#fbbf24']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-5 rounded-3xl items-center shadow-xl shadow-orange-500/30"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-black text-lg">Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center my-10 px-4">
          <View className="flex-1 h-[1px] bg-gray-100" />
          <Text className="mx-4 text-gray-400 font-bold text-xs">OR CONTINUE WITH</Text>
          <View className="flex-1 h-[1px] bg-gray-100" />
        </View>

        <View className="flex-row gap-4">
          <TouchableOpacity 
            onPress={() => promptAsync()}
            disabled={!request || socialLoading}
            className="flex-1 flex-row bg-white p-5 rounded-3xl border border-gray-100 items-center justify-center shadow-sm active:bg-gray-50"
          >
            {socialLoading ? (
              <ActivityIndicator color="#EA4335" />
            ) : (
              <>
                <FontAwesome name="google" size={20} color="#EA4335" />
                <Text className="ml-3 font-bold text-gray-700">Google</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-12">
          <Text className="text-gray-500 font-medium">New member? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text className="text-accent font-black">Join now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
