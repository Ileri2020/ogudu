import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AccountScreen() {
  const { user, logout } = useAppContext();
  const router = useRouter();

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
        <Ionicons name="person-circle-outline" size={100} color="#E5E7EB" />
        <Text className="text-2xl font-bold text-foreground mt-4">Not Logged In</Text>
        <Text className="text-muted-foreground text-center mt-2 mb-10">
          Sign in to access your profile and join the community.
        </Text>
        <TouchableOpacity 
          className="w-full"
          onPress={() => router.push('/login')}
        >
          <LinearGradient
            colors={['#F97316', '#FB923C']}
            className="py-4 rounded-2xl items-center"
          >
            <Text className="text-white font-bold text-lg">Sign In / Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const InfoRow = ({ icon, label, value, color = '#6B7280' }: { icon: string, label: string, value: string, color?: string }) => (
    <View className="flex-row items-center p-4 bg-secondary/50 rounded-2xl mb-4 border border-border/30">
      <View className="w-10 items-center">
         <MaterialIcons name={icon as any} size={24} color={color} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{label}</Text>
        <Text className="text-base text-foreground font-semibold">{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-6">
        {/* Profile Header */}
        <View className="items-center mt-8 mb-10">
          <View className="relative">
            <Image
              source={{ uri: user.avatarUrl || 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png' }}
              className="w-32 h-32 rounded-full border-4 border-accent shadow-lg"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-accent p-2 rounded-full border-2 border-white">
              <MaterialIcons name="camera-alt" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-bold text-foreground mt-4">{user.name || user.username}</Text>
          <View className="bg-accent/10 px-4 py-1 rounded-full mt-1">
            <Text className="text-accent text-xs font-bold uppercase">{user.role}</Text>
          </View>
        </View>

        {/* Info Sections */}
        <View className="mb-10">
          <InfoRow icon="person" label="Username" value={user.username} color="#F97316" />
          <InfoRow icon="email" label="Email Address" value={user.email} color="#F97316" />
          <InfoRow icon="phone" label="Contact" value={user.contact || 'Not set'} color="#F97316" />
          <InfoRow icon="groups" label="Department" value={user.department || 'General'} color="#F97316" />
        </View>

        {/* App Settings/Actions */}
        <View className="mb-4">
          <TouchableOpacity 
            className="flex-row items-center p-4 bg-secondary/50 rounded-2xl mb-4 border border-border/30"
            onPress={() => router.push('/contact')}
          >
            <MaterialIcons name="contact-support" size={24} color="#F97316" />
            <View className="ml-3 flex-1">
              <Text className="text-base text-foreground font-semibold">Contact & Support</Text>
              <Text className="text-xs text-muted-foreground">Need help? Get in touch with us.</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* Admin Controls Shortcut */}
        {user.role === 'admin' && (
          <TouchableOpacity 
            className="flex-row items-center p-4 bg-accent/10 rounded-2xl mb-4 border border-accent/30"
            onPress={() => Alert.alert('Admin', 'Admin dashboard coming soon!')}
          >
            <FontAwesome5 name="user-shield" size={20} color="#F97316" />
            <Text className="ml-3 text-accent font-bold">Admin Dashboard</Text>
          </TouchableOpacity>
        )}

        {/* Action Buttons */}
        <View className="flex-row gap-4 mb-10">
          <TouchableOpacity className="flex-1 bg-secondary py-4 rounded-2xl items-center border border-border/50">
            <Text className="text-foreground font-bold">Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 bg-destructive/10 py-4 rounded-2xl items-center border border-destructive/30"
            onPress={handleLogout}
          >
            <Text className="text-destructive font-bold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
