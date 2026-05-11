import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Screen } from '@/components/layout';
import { Search, Music, X, ChevronRight, BookOpen } from 'lucide-react-native';

const SAMPLE_HYMNS = [
  { id: 1, title: 'YAH RAH SARAH', category: 'Morning Prayer', content: 'Yah Rah Sarah, Yah Rah Sarah\nKìí ṣe l’áyé yí, l’ẹ́ni náà wà\nYah Rah Sarah, Yah Rah Sarah\nL’ọ́run ni Olùgbàlà wà.' },
  { id: 2, title: 'YOR YAH RAMO', category: 'General Worship', content: 'Yor Yah Ramo, Yor Yah Ramo\nẸ fẹ́ Olúwa, ẹ kọrin sí I\nYor Yah Ramo, Yor Yah Ramo\nẸ kún fún ìyìn sí Ọlọ́run.' },
  { id: 3, title: 'OLUWA MI', category: 'Thanksgiving', content: 'Olúwa mi, mo dúpẹ́ lọ́wọ́ Rẹ\nFún oore-ọ̀fẹ́ Rẹ tó pọ̀ lórí mi\nMo júbà Rẹ, mo f’ìyìn fún Ọ\nNítorí ìfẹ́ Rẹ sí mi.' },
  { id: 4, title: 'MIMO MIMO MIMO', category: 'Holy Holy Holy', content: 'Mímọ́, Mímọ́, Mímọ́\nOlúwa Ọlọ́run àwọn ọmọ-ogun\nGbogbo ayé kún fún ògo Rẹ\nÒgo fún Ọ lókè ọ̀run.' },
  { id: 5, title: 'WA KA LO', category: 'Morning Prayer', content: 'Wá ká lọ sí ilé Olúwa\nWá ká lọ sin Ọlọ́run wa\nNítorí oore Rẹ tó ju ayé lọ\nẸ f’ìyìn fún Olúwa.' },
  { id: 6, title: 'JERUSALEMA', category: 'Morning Prayer', content: 'Jerusalẹ́mà, Jerusalẹ́mà\nÌlú mímọ́, ìlú àlàáfíà\nÀwa ń fojú sọ́nà fún ọ\nNítorí ògo rẹ kò lẹ́gbẹ́.' },
  { id: 7, title: 'OORE OFE OLUWA', category: 'General Worship', content: 'Oore-ọ̀fẹ́ Olúwa wa\nSì kí ó wà pẹ̀lú wa\nLáti òní lọ àti títí ayé\nÀmín, Àmín, Àmín.' },
];

export default function HymnsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHymn, setSelectedHymn] = useState<any>(null);

  const filteredHymns = SAMPLE_HYMNS.filter(h => 
    h.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.id.toString() === searchQuery
  );

  const renderHymnItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => setSelectedHymn(item)}
      className="bg-white mx-6 mb-3 p-5 rounded-[28px] border border-gray-100 flex-row items-center shadow-sm"
    >
      <View className="w-12 h-12 bg-accent/10 rounded-2xl items-center justify-center">
        <Text className="text-accent font-black text-sm">{item.id}</Text>
      </View>
      <View className="ml-4 flex-1">
        <Text className="font-bold text-gray-900 text-lg" numberOfLines={1}>{item.title}</Text>
        <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">{item.category}</Text>
      </View>
      <ChevronRight size={18} color="#d1d5db" />
    </TouchableOpacity>
  );

  return (
    <Screen safe={true} className="bg-gray-50">
      <View className="px-6 py-6 bg-white rounded-b-[40px] shadow-sm mb-6">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-4xl font-black text-gray-900 tracking-tighter">Hymns</Text>
            <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">CCC Celestial Hymn Book</Text>
          </View>
          <View className="bg-accent/10 p-3 rounded-2xl">
            <Music size={24} color="#f59e0b" />
          </View>
        </View>

        <View className="bg-gray-50 flex-row items-center px-5 rounded-[24px] border border-gray-100 h-16">
          <Search size={20} color="#9ca3af" />
          <TextInput 
            className="flex-1 ml-3 font-bold text-gray-900 text-base"
            placeholder="Search by title or number..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredHymns}
        renderItem={renderHymnItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Text className="text-gray-400 font-bold">No hymns found matching your search</Text>
          </View>
        }
      />

      {/* Hymn Detail Modal */}
      <Modal visible={!!selectedHymn} animationType="fade" transparent={true}>
        <View className="flex-1 bg-black/60 justify-center items-center p-6">
          <View className="bg-white w-full max-h-[85%] rounded-[40px] overflow-hidden shadow-2xl">
            <View className="p-6 border-b border-gray-50 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-accent p-2 rounded-xl mr-3">
                  <BookOpen size={18} color="white" />
                </View>
                <Text className="font-black text-gray-900 text-xl">Hymn {selectedHymn?.id}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedHymn(null)} className="bg-gray-100 p-2 rounded-full">
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-8" showsVerticalScrollIndicator={false}>
              <Text className="text-center font-black text-3xl text-gray-900 mb-2">{selectedHymn?.title}</Text>
              <Text className="text-center text-accent font-bold text-xs uppercase tracking-[4px] mb-10">{selectedHymn?.category}</Text>
              
              <Text className="text-xl text-gray-800 text-center leading-[42px] font-semibold mb-10">
                {selectedHymn?.content}
              </Text>
              
              <View className="h-20" />
            </ScrollView>

            <View className="p-6 bg-gray-50 flex-row justify-center">
              <TouchableOpacity className="bg-white px-8 py-4 rounded-3xl border border-gray-100 shadow-sm">
                <Text className="text-gray-900 font-black">Favorite Hymn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
