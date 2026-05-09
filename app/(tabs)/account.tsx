import React, { useRef } from 'react';
import { View, Text, Alert } from 'react-native';
import { Screen, Section, PageHeader } from '@/components/layout';
import { ProfileHeader, InfoItem } from '@/components/account';
import { Button } from '@/components/ui';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import { User, Mail, Phone, Users, Shield, LogOut, Settings, HelpCircle } from 'lucide-react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { MediaUploader } from '@/components/shared';

export default function AccountScreen() {
  const { user, logout } = useAppContext();
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  if (!user) {
    return (
      <Screen safe={true} scrollable={false} className="justify-center items-center px-10">
        <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
          <User size={48} color="#94a3b8" />
        </View>
        <Text className="text-3xl font-black text-gray-900 text-center tracking-tighter">Join the Community</Text>
        <Text className="text-base text-gray-500 text-center mt-3 mb-10 leading-relaxed">
          Sign in to access your profile, track your contributions, and stay connected with CCC Ogudu.
        </Text>
        <Button size="lg" className="w-full h-16 rounded-3xl" onPress={() => router.push('/login')}>
          Sign In / Sign Up
        </Button>
      </Screen>
    );
  }

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <Screen safe={true}>
      <PageHeader title="My" accentTitle="Account" />

      <ProfileHeader 
        user={user} 
        onEditAvatar={() => bottomSheetRef.current?.present()} 
      />

      <Section title="Personal Information" className="pt-0">
        <InfoItem icon={<User size={20} color="#f59e0b" />} label="Username" value={user.username} />
        <InfoItem icon={<Mail size={20} color="#f59e0b" />} label="Email" value={user.email} />
        <InfoItem icon={<Phone size={20} color="#f59e0b" />} label="Contact" value={user.contact || 'Not set'} />
        <InfoItem icon={<Users size={20} color="#f59e0b" />} label="Department" value={user.department || 'General Member'} />
      </Section>

      <Section title="Settings & Support">
        <Button variant="ghost" className="justify-start h-16 px-6 mb-2 rounded-3xl bg-gray-50" onPress={() => router.push('/contact')}>
          <View className="flex-row items-center flex-1">
            <HelpCircle size={20} color="#64748b" />
            <Text className="ml-4 font-bold text-gray-700">Support & Help</Text>
          </View>
        </Button>
        
        {user.role === 'admin' && (
          <Button variant="ghost" className="justify-start h-16 px-6 mb-2 rounded-3xl bg-accent/5" onPress={() => router.push('/admin' as any)}>
            <View className="flex-row items-center flex-1">
              <Shield size={20} color="#f59e0b" />
              <Text className="ml-4 font-bold text-accent">Admin Dashboard</Text>
            </View>
          </Button>
        )}

        <Button variant="ghost" className="justify-start h-16 px-6 rounded-3xl bg-red-50" onPress={handleLogout}>
          <View className="flex-row items-center flex-1">
            <LogOut size={20} color="#ef4444" />
            <Text className="ml-4 font-bold text-red-500">Log Out</Text>
          </View>
        </Button>
      </Section>

      <View className="h-20" />

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['80%']}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />}
      >
        <BottomSheetView className="flex-1">
          <MediaUploader isProfileImage={true} onSuccess={() => bottomSheetRef.current?.dismiss()} />
        </BottomSheetView>
      </BottomSheetModal>
    </Screen>
  );
}
