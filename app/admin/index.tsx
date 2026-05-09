import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Screen, Section, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import { useRouter } from 'expo-router';
import { Shield, Users, FileText, Calendar, Settings, ChevronRight, BarChart3 } from 'lucide-react-native';

const AdminStat = ({ label, value, icon, color }: { label: string, value: string, icon: any, color: string }) => (
  <View className="flex-1 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
    <View className={`w-10 h-10 rounded-2xl items-center justify-center bg-${color}-50`}>
      {React.createElement(icon, { size: 20, color: color === 'accent' ? '#f59e0b' : color })}
    </View>
    <Text className="text-2xl font-black text-gray-900 mt-4 tracking-tighter">{value}</Text>
    <Text className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{label}</Text>
  </View>
);

const AdminLink = ({ label, description, icon, onPress }: { label: string, description: string, icon: any, onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="flex-row items-center p-5 bg-white rounded-3xl mb-4 border border-gray-100 shadow-sm"
  >
    <View className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center">
      {React.createElement(icon, { size: 24, color: '#f59e0b' })}
    </View>
    <View className="ml-4 flex-1">
      <Text className="text-lg font-bold text-gray-900">{label}</Text>
      <Text className="text-xs text-gray-400 mt-0.5">{description}</Text>
    </View>
    <ChevronRight size={20} color="#d1d5db" />
  </TouchableOpacity>
);

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <Screen safe={true}>
      <PageHeader title="Admin" accentTitle="Dashboard" />

      <Section className="pt-0">
        <View className="flex-row gap-4 mb-8">
          <AdminStat label="Total Users" value="1.2k" icon={Users} color="#3b82f6" />
          <AdminStat label="New Posts" value="24" icon={FileText} color="accent" />
        </View>

        <Text className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Management</Text>
        
        <AdminLink 
          label="Church Hierarchy" 
          description="Manage committees, groups, and members" 
          icon={Users}
          onPress={() => router.push('/about')}
        />
        
        <AdminLink 
          label="Pending Verifications" 
          description="Approve or decline new community posts" 
          icon={Shield}
          onPress={() => {}}
        />

        <AdminLink 
          label="Events & Programs" 
          description="Schedule and manage upcoming church events" 
          icon={Calendar}
          onPress={() => {}}
        />

        <AdminLink 
          label="App Settings" 
          description="Configure global application parameters" 
          icon={Settings}
          onPress={() => {}}
        />
      </Section>

      <Section title="System Status">
        <View className="bg-gray-900 p-6 rounded-3xl">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white font-bold">API Performance</Text>
            <View className="bg-green-500 w-2 h-2 rounded-full" />
          </View>
          <View className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <View className="h-full bg-accent w-[85%]" />
          </View>
          <Text className="text-gray-400 text-xs mt-4">All systems operational. Last sync: 2 mins ago.</Text>
        </View>
      </Section>

      <View className="h-20" />
    </Screen>
  );
}
