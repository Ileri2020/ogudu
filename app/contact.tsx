import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
const { Alert } = require('react-native') as { Alert: { alert: (t: string, m?: string, b?: any[]) => void } };
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function ContactScreen() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Your message has been sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-6">
        <View className="items-center mt-8 mb-10">
          <Text className="text-4xl font-bold text-accent">Contact Us</Text>
          <Text className="text-muted-foreground mt-2 text-center">
            We'd love to hear from you. Send us a message or find us on social media.
          </Text>
        </View>

        {/* Contact Form */}
        <View className="bg-secondary/30 p-6 rounded-3xl border border-border/50 shadow-sm shadow-black/5">
          <Text className="text-2xl font-bold text-foreground mb-6">Let's talk</Text>
          
          <View className="space-y-4">
            <View>
              <Text className="text-sm font-bold text-foreground/70 mb-1 ml-1">Name</Text>
              <TextInput
                className="bg-secondary p-4 rounded-2xl border border-border/50 text-foreground"
                placeholder="Your Name"
                placeholderTextColor="#9CA3AF"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            <View>
              <Text className="text-sm font-bold text-foreground/70 mb-1 ml-1">Email</Text>
              <TextInput
                className="bg-secondary p-4 rounded-2xl border border-border/50 text-foreground"
                placeholder="example@gmail.com"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-sm font-bold text-foreground/70 mb-1 ml-1">Message</Text>
              <TextInput
                className="bg-secondary p-4 rounded-2xl border border-border/50 text-foreground h-32"
                placeholder="How can we help?"
                placeholderTextColor="#9CA3AF"
                value={formData.message}
                onChangeText={(text) => setFormData({ ...formData, message: text })}
                multiline
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity onPress={handleSubmit} disabled={loading} className="mt-4">
              <LinearGradient
                colors={['#F97316', '#FB923C']}
                className="py-4 rounded-2xl items-center"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">Send Message</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Info */}
        <View className="mt-10 mb-10">
          <View className="flex-row items-center mb-6">
             <View className="w-12 h-12 bg-accent/10 rounded-full items-center justify-center">
                <MaterialIcons name="location-on" size={24} color="#F97316" />
             </View>
             <View className="ml-4 flex-1">
                <Text className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Address</Text>
                <Text className="text-foreground font-semibold">Ogudu Expressway, Lagos, Nigeria</Text>
             </View>
          </View>

          <View className="flex-row items-center mb-6">
             <View className="w-12 h-12 bg-accent/10 rounded-full items-center justify-center">
                <MaterialIcons name="phone" size={24} color="#F97316" />
             </View>
             <View className="ml-4 flex-1">
                <Text className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Phone</Text>
                <Text className="text-foreground font-semibold">+234 123 456 7890</Text>
             </View>
          </View>

          <View className="flex-row items-center mb-10">
             <View className="w-12 h-12 bg-accent/10 rounded-full items-center justify-center">
                <MaterialIcons name="email" size={24} color="#F97316" />
             </View>
             <View className="ml-4 flex-1">
                <Text className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Email</Text>
                <Text className="text-foreground font-semibold">contact@cccogudu.org</Text>
             </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
