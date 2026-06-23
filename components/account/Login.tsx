import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext';
import { API_URL } from '@/constants/Config';

interface LoginProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export const Login = ({ onSuccess, onSwitchToSignup }: LoginProps) => {
  const { setUser } = useAppContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      const userData = response.data;
      setUser({
        name: userData.name || '',
        username: userData.username,
        id: userData.id,
        email: userData.email,
        avatarUrl: userData.avatarUrl,
        role: userData.role,
        department: userData.department,
        contact: userData.contact,
      });
      Alert.alert('Success', 'Logged in successfully');
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        'Login failed. Please check your credentials.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className="flex-1 justify-center px-6 py-8">
        {/* Header */}
        <View className="mb-8 items-center">
          <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome Back
          </Text>
          <Text className="text-slate-600 dark:text-slate-400">
            Sign in to your account
          </Text>
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Email
          </Text>
          <View className="flex-row items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4">
            <MaterialIcons name="email" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#cbd5e1"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              className="flex-1 py-3 ml-3 text-slate-900 dark:text-white"
            />
          </View>
        </View>

        {/* Password Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Password
          </Text>
          <View className="flex-row items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4">
            <MaterialIcons name="lock" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#cbd5e1"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              className="flex-1 py-3 ml-3 text-slate-900 dark:text-white"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={20}
                color="#94a3b8"
              />
            </Pressable>
          </View>
        </View>

        {/* Login Button */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="bg-blue-600 dark:bg-blue-500 rounded-lg py-3 flex-row justify-center items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">Sign In</Text>
          )}
        </Pressable>

        {/* Signup Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
          </Text>
          <Pressable onPress={onSwitchToSignup}>
            <Text className="text-blue-600 dark:text-blue-400 font-semibold">
              Sign up
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
