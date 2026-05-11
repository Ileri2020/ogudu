import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
const { Alert } = require('react-native') as { Alert: { alert: (t: string, m?: string, b?: any[]) => void } };
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '@/constants/Config';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

export default function SignupScreen() {
  const { setUser } = useAppContext();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    contact: '',
    department: 'General Member',
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Basic Validation
    if (!formData.name || !formData.email || !formData.password || !formData.username) {
      Alert.alert('Missing Fields', 'Please fill in all required fields (Name, Username, Email, Password)');
      return;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, formData);
      setUser(response.data);
      router.replace('/(tabs)');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Signup Failed', e.response?.data?.error || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
          <View className="mt-12 mb-10">
            <Text className="text-5xl font-black text-gray-900 tracking-tighter">Join Us</Text>
            <Text className="text-lg text-gray-500 mt-2 font-medium">Create your account</Text>
          </View>

          <View className="gap-y-5">
            <View>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</Text>
              <TextInput
                className="bg-gray-50 p-5 rounded-3xl border border-gray-100 text-gray-900 font-semibold"
                placeholder="John Doe"
                placeholderTextColor="#9ca3af"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</Text>
              <TextInput
                className="bg-gray-50 p-5 rounded-3xl border border-gray-100 text-gray-900 font-semibold"
                placeholder="johndoe123"
                placeholderTextColor="#9ca3af"
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</Text>
              <TextInput
                className="bg-gray-50 p-5 rounded-3xl border border-gray-100 text-gray-900 font-semibold"
                placeholder="name@example.com"
                placeholderTextColor="#9ca3af"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Contact (Optional)</Text>
              <TextInput
                className="bg-gray-50 p-5 rounded-3xl border border-gray-100 text-gray-900 font-semibold"
                placeholder="+234..."
                placeholderTextColor="#9ca3af"
                value={formData.contact}
                onChangeText={(text) => setFormData({ ...formData, contact: text })}
                keyboardType="phone-pad"
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</Text>
              <TextInput
                className="bg-gray-50 p-5 rounded-3xl border border-gray-100 text-gray-900 font-semibold"
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              onPress={handleSignup} 
              disabled={loading} 
              className="mt-6 mb-8 active:opacity-80"
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
                  <Text className="text-white font-black text-lg">Sign Up</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mb-16">
            <Text className="text-gray-500 font-medium">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text className="text-accent font-black">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
