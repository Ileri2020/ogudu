import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext';
import { API_URL } from '@/constants/Config';

interface EditUserProps {
  onSuccess?: () => void;
}

export const EditUser = ({ onSuccess }: EditUserProps) => {
  const { user, setUser } = useAppContext();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    department: '',
    contact: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        department: user.department || '',
        contact: user.contact || '',
      });
    }
  }, [user]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!formData.username || !formData.email) {
      Alert.alert('Error', 'Username and email are required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/auth/user/${user?.id}`, formData);
      const updatedUser = response.data;
      setUser({
        username: updatedUser.username,
        id: updatedUser.id,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
        role: updatedUser.role,
        department: updatedUser.department,
        contact: updatedUser.contact,
      });
      Alert.alert('Success', 'Profile updated successfully');
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        'Failed to update profile';
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
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Edit Profile
          </Text>
          <Text className="text-slate-600 dark:text-slate-400">
            Update your information
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
              placeholder="Enter username"
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
              placeholder="Enter email"
              placeholderTextColor="#cbd5e1"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              className="flex-1 py-3 ml-3 text-slate-900 dark:text-white"
            />
          </View>
        </View>

        {/* Department Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Department
          </Text>
          <View className="flex-row items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4">
            <MaterialIcons name="business" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Enter department"
              placeholderTextColor="#cbd5e1"
              value={formData.department}
              onChangeText={(value) => handleChange('department', value)}
              className="flex-1 py-3 ml-3 text-slate-900 dark:text-white"
            />
          </View>
        </View>

        {/* Contact Input */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Contact
          </Text>
          <View className="flex-row items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4">
            <MaterialIcons name="phone" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Enter phone or contact"
              placeholderTextColor="#cbd5e1"
              keyboardType="phone-pad"
              value={formData.contact}
              onChangeText={(value) => handleChange('contact', value)}
              className="flex-1 py-3 ml-3 text-slate-900 dark:text-white"
            />
          </View>
        </View>

        {/* Update Button */}
        <Pressable
          onPress={handleUpdate}
          disabled={loading}
          className="bg-blue-600 dark:bg-blue-500 rounded-lg py-3 flex-row justify-center items-center mb-4"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Update Profile
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
