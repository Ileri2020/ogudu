import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
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
    department: 'none',
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.username) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, formData);
      setUser(response.data);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Signup Failed', e.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6">
        <View className="items-center mt-10 mb-10">
          <Text className="text-4xl font-extrabold text-accent">Create Account</Text>
          <Text className="text-muted-foreground mt-2">Join the CCC Ogudu community</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-bold text-foreground/70 mb-1 ml-1">Full Name</Text>
            <TextInput
              className="bg-secondary p-4 rounded-2xl border border-border/50 text-foreground"
              placeholder="John Doe"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-foreground/70 mb-1 ml-1">Username</Text>
            <TextInput
              className="bg-secondary p-4 rounded-2xl border border-border/50 text-foreground"
              placeholder="johndoe123"
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-foreground/70 mb-1 ml-1">Email</Text>
            <TextInput
              className="bg-secondary p-4 rounded-2xl border border-border/50 text-foreground"
              placeholder="example@gmail.com"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-foreground/70 mb-1 ml-1">Contact (Phone)</Text>
            <TextInput
              className="bg-secondary p-4 rounded-2xl border border-border/50 text-foreground"
              placeholder="+234..."
              value={formData.contact}
              onChangeText={(text) => setFormData({ ...formData, contact: text })}
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-foreground/70 mb-1 ml-1">Password</Text>
            <TextInput
              className="bg-secondary p-4 rounded-2xl border border-border/50 text-foreground"
              placeholder="••••••••"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
            />
          </View>

          <TouchableOpacity onPress={handleSignup} disabled={loading} className="mt-6 mb-10">
            <LinearGradient
              colors={['#F97316', '#FB923C']}
              className="py-4 rounded-2xl items-center shadow-md shadow-accent/20"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Sign Up</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mb-10">
          <Text className="text-muted-foreground">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-accent font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
