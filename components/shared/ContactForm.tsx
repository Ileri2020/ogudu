import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '@/constants/Config';

interface ContactFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const ContactForm = ({ onSuccess, onError }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/contact`, formData);
      if (response.status === 200) {
        Alert.alert('Success', 'Your message has been sent successfully');
        setFormData({ name: '', email: '', subject: '', message: '' });
        onSuccess?.();
      }
    } catch (error) {
      const errorMessage = 'Failed to send message. Please try again.';
      Alert.alert('Error', errorMessage);
      onError?.(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full gap-4 p-4">
      {/* Name Input */}
      <View>
        <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Name
        </Text>
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor="#94a3b8"
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white"
        />
      </View>

      {/* Email Input */}
      <View>
        <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Email
        </Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#94a3b8"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white"
        />
      </View>

      {/* Subject Input */}
      <View>
        <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Subject
        </Text>
        <TextInput
          placeholder="Enter subject"
          placeholderTextColor="#94a3b8"
          value={formData.subject}
          onChangeText={(value) => handleChange('subject', value)}
          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white"
        />
      </View>

      {/* Message Input */}
      <View>
        <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Message
        </Text>
        <TextInput
          placeholder="Enter your message"
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={5}
          value={formData.message}
          onChangeText={(value) => handleChange('message', value)}
          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white"
          textAlignVertical="top"
        />
      </View>

      {/* Submit Button */}
      <Pressable
        onPress={handleSubmit}
        disabled={loading}
        className="bg-blue-600 dark:bg-blue-500 rounded-lg py-3 mt-4 flex-row justify-center items-center"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">Send Message</Text>
        )}
      </Pressable>
    </View>
  );
};
