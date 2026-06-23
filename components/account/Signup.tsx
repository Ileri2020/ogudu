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

interface SignupProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const Signup = ({ onSuccess, onSwitchToLogin }: SignupProps) => {
  const { setUser } = useAppContext();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
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
      Alert.alert('Success', 'Account created successfully');
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        'Signup failed. Please try again.';
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
            Create Account
          </Text>
          <Text className="text-slate-600 dark:text-slate-400">
            Join our community
          </Text>
        </View>

        {/* Username Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Username
          </Text>
          <View className="flex-row items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4">
            <MaterialIcons name="person" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Choose a username"
              placeholderTextColor="#cbd5e1"
              value={formData.username}
              onChangeText={(value) => handleChange('username', value)}
              className="flex-1 py-3 ml-3 text-slate-900 dark:text-white"
            />
          </View>
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
        <View className="mb-4">
          <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Password
          </Text>
          <View className="flex-row items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4">
            <MaterialIcons name="lock" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Create a password"
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

        {/* Confirm Password Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Confirm Password
          </Text>
          <View className="flex-row items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4">
            <MaterialIcons name="lock" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Confirm your password"
              placeholderTextColor="#cbd5e1"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              className="flex-1 py-3 ml-3 text-slate-900 dark:text-white"
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialIcons
                name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                size={20}
                color="#94a3b8"
              />
            </Pressable>
          </View>
        </View>

        {/* Signup Button */}
        <Pressable
          onPress={handleSignup}
          disabled={loading}
          className="bg-blue-600 dark:bg-blue-500 rounded-lg py-3 flex-row justify-center items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Create Account
            </Text>
          )}
        </Pressable>

        {/* Login Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
          </Text>
          <Pressable onPress={onSwitchToLogin}>
            <Text className="text-blue-600 dark:text-blue-400 font-semibold">
              Sign in
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
