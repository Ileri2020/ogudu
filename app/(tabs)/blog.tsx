import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PostsList, MediaUploader } from '@/components/shared';
import { useAppContext } from '@/context/AppContext';
import { Plus } from 'lucide-react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const TABS = [
  { id: 'praisevideo', label: 'Praise' },
  { id: 'worshipvideo', label: 'Worship' },
  { id: 'post', label: 'Posts' },
  { id: 'event', label: 'Events' },
  { id: 'project', label: 'Projects' },
  { id: 'service', label: 'Sermons' },
];

export default function BlogScreen() {
  const { user } = useAppContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('praisevideo');
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const tabs = user?.role === 'admin' 
    ? [...TABS, { id: 'unverified', label: 'Review' }] 
    : TABS;

  const renderTab = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => setActiveTab(item.id)}
      className={`px-6 py-2.5 rounded-full mr-3 border ${activeTab === item.id ? 'bg-accent border-accent' : 'bg-white border-gray-200'}`}
    >
      <Text className={`font-bold text-sm ${activeTab === item.id ? 'text-white' : 'text-gray-500'}`}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Text className="text-3xl font-black text-gray-900 tracking-tighter">
          {activeTab === 'unverified' ? 'Admin Review' : 'Cathedral Feed'}
        </Text>
        <TouchableOpacity 
          onPress={() => bottomSheetModalRef.current?.present()}
          className="bg-accent p-3 rounded-full shadow-lg shadow-accent/40"
        >
          <Plus color="white" size={24} strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="mb-4">
        <FlatList
          data={tabs}
          renderItem={renderTab}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        />
      </View>

      {/* Feed */}
      <View className="flex-1">
        <PostsList 
          page={activeTab as any}
          onPostPress={(post) => router.push(`/detail/${post.id}`)}
        />
      </View>

      {/* Upload Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={['85%']}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
      >
        <BottomSheetView className="flex-1">
          <MediaUploader onSuccess={() => {
            bottomSheetModalRef.current?.dismiss();
            // PostsList will automatically refetch because its queryKey includes activeTab
          }} />
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
