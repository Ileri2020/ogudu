import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { Screen } from '@/components/layout';
import { ChevronDown, Search, X, Book as BookIcon, Globe, ChevronLeft, ChevronRight } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { BIBLE_METADATA } from '@/constants/BibleData';

const { width } = Dimensions.get('window');

// We use require for assets to ensure they are bundled correctly
const BIBLE_FILES: Record<string, any> = {
  en: require('@/assets/bible/en_kjv.json'),
  yo: require('@/assets/bible/yo_mimo.json'),
};

export default function BibleScreen() {
  const [lang, setLang] = useState<'en' | 'yo'>('en');
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [chapterModalVisible, setChapterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedBook, setSelectedBook] = useState({ id: 'gen', name: 'Genesis' });
  const [selectedChapter, setSelectedChapter] = useState(1);
  
  const [passage, setPassage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Load last saved passage
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await SecureStore.getItemAsync('last_bible_passage');
        if (saved) {
          const { l, b, c, bn } = JSON.parse(saved);
          if (l) setLang(l);
          if (b && bn) setSelectedBook({ id: b, name: bn });
          if (c) setSelectedChapter(c);
        }
      } catch (e) {
        console.error('Failed to load Bible state', e);
      }
    };
    loadState();
  }, []);

  // Save current passage
  useEffect(() => {
    const saveState = async () => {
      try {
        await SecureStore.setItemAsync('last_bible_passage', JSON.stringify({
          l: lang,
          b: selectedBook.id,
          c: selectedChapter,
          bn: selectedBook.name
        }));
      } catch (e) {
        console.error('Failed to save Bible state', e);
      }
    };
    saveState();
    fetchPassage();
  }, [lang, selectedBook, selectedChapter]);

  const fetchPassage = useCallback(() => {
    setLoading(true);
    try {
      const bibleData = BIBLE_FILES[lang];
      if (bibleData && bibleData.books && bibleData.books[selectedBook.id]) {
        const chapterData = bibleData.books[selectedBook.id][selectedChapter];
        if (chapterData) {
          setPassage(chapterData);
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        } else {
          setPassage([`Chapter ${selectedChapter} not found in ${selectedBook.name}.`]);
        }
      } else {
        setPassage([`Book ${selectedBook.name} not found in the ${lang.toUpperCase()} version.`]);
      }
    } catch (e) {
      console.error('Error fetching passage', e);
      setPassage(['Error loading passage. Please try again.']);
    } finally {
      setLoading(false);
    }
  }, [lang, selectedBook, selectedChapter]);

  const filteredBooks = [...BIBLE_METADATA[lang].old, ...BIBLE_METADATA[lang].new].filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNextChapter = () => {
    const currentBookMeta = [...BIBLE_METADATA[lang].old, ...BIBLE_METADATA[lang].new].find(b => b.id === selectedBook.id);
    if (currentBookMeta && selectedChapter < currentBookMeta.chapters) {
      setSelectedChapter(selectedChapter + 1);
    } else {
      // Logic for next book could be added here
    }
  };

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    }
  };

  return (
    <Screen safe={true} className="bg-white">
      <View className="px-6 flex-row items-center justify-between mb-4 mt-2">
        <View>
          <Text className="text-4xl font-black text-gray-900 tracking-tighter">
            {lang === 'en' ? 'Bible' : 'Bíbélì'}
          </Text>
          <Text className="text-accent font-bold text-[10px] uppercase tracking-[3px] mt-1">
            {lang === 'en' ? 'Holy Scripture' : 'Bibeli Mimo'}
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => setLang(lang === 'en' ? 'yo' : 'en')}
          className="flex-row items-center bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100"
        >
          <Globe size={16} color="#f59e0b" />
          <Text className="ml-3 font-black text-gray-700 text-xs tracking-widest">{lang === 'en' ? 'ENGLISH' : 'YORÙBÁ'}</Text>
        </TouchableOpacity>
      </View>

      {/* Selectors */}
      <View className="px-6 flex-row gap-3 mb-6">
        <TouchableOpacity 
          onPress={() => setBookModalVisible(true)}
          className="flex-1 flex-row items-center justify-between bg-gray-50 p-5 rounded-3xl border border-gray-100 shadow-sm"
        >
          <View className="flex-row items-center">
            <BookIcon size={20} color="#f59e0b" />
            <Text className="ml-4 font-bold text-gray-900 text-base">{selectedBook.name}</Text>
          </View>
          <ChevronDown size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setChapterModalVisible(true)}
          className="w-28 flex-row items-center justify-between bg-gray-50 p-5 rounded-3xl border border-gray-100 shadow-sm"
        >
          <Text className="font-bold text-gray-900 text-base">Ch. {selectedChapter}</Text>
          <ChevronDown size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView ref={scrollViewRef} className="flex-1 px-8" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="mt-20"><ActivityIndicator size="large" color="#f59e0b" /></View>
        ) : (
          <View className="pb-32">
            {passage.map((text, i) => (
              <View key={i} className="flex-row mb-8">
                <View className="w-8">
                  <Text className="text-accent font-black mt-1.5 text-xs">{i + 1}</Text>
                </View>
                <Text className="flex-1 text-xl leading-10 text-gray-800 font-medium">
                  {text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Navigation Footer */}
      <View className="absolute bottom-6 left-6 right-6 flex-row gap-4">
        <TouchableOpacity 
          onPress={handlePrevChapter}
          disabled={selectedChapter === 1}
          className={`flex-1 flex-row items-center justify-center p-5 rounded-3xl border ${selectedChapter === 1 ? 'bg-gray-50 border-gray-100 opacity-50' : 'bg-white border-gray-200 shadow-lg'}`}
        >
          <ChevronLeft size={20} color="#64748b" />
          <Text className="ml-2 font-bold text-gray-600">Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleNextChapter}
          className="flex-1 flex-row items-center justify-center bg-accent p-5 rounded-3xl shadow-xl shadow-orange-500/30"
        >
          <Text className="mr-2 font-black text-white">Next Chapter</Text>
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Book Selection Modal */}
      <Modal visible={bookModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[50px] h-[90%] p-8 shadow-2xl">
            <View className="flex-row items-center justify-between mb-8">
              <Text className="text-3xl font-black text-gray-900 tracking-tighter">Select Book</Text>
              <TouchableOpacity onPress={() => setBookModalVisible(false)} className="bg-gray-100 p-3 rounded-full">
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View className="bg-gray-50 flex-row items-center px-6 rounded-3xl border border-gray-100 mb-8 h-16">
              <Search size={22} color="#9ca3af" />
              <TextInput 
                className="flex-1 ml-4 font-bold text-gray-900 text-lg"
                placeholder="Search books..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-[4px] mb-6 ml-2">Old Testament</Text>
              <View className="flex-row flex-wrap gap-3 mb-10">
                {BIBLE_METADATA[lang].old.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())).map((b) => (
                  <TouchableOpacity 
                    key={b.id} 
                    onPress={() => { setSelectedBook({ id: b.id, name: b.name }); setSelectedChapter(1); setBookModalVisible(false); }}
                    className={`px-6 py-4 rounded-2xl border ${selectedBook.id === b.id ? 'bg-accent border-accent' : 'bg-white border-gray-100'}`}
                  >
                    <Text className={`font-bold text-base ${selectedBook.id === b.id ? 'text-white' : 'text-gray-700'}`}>{b.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-xs font-bold text-gray-400 uppercase tracking-[4px] mb-6 ml-2">New Testament</Text>
              <View className="flex-row flex-wrap gap-3 mb-12">
                {BIBLE_METADATA[lang].new.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())).map((b) => (
                  <TouchableOpacity 
                    key={b.id} 
                    onPress={() => { setSelectedBook({ id: b.id, name: b.name }); setSelectedChapter(1); setBookModalVisible(false); }}
                    className={`px-6 py-4 rounded-2xl border ${selectedBook.id === b.id ? 'bg-accent border-accent' : 'bg-white border-gray-100'}`}
                  >
                    <Text className={`font-bold text-base ${selectedBook.id === b.id ? 'text-white' : 'text-gray-700'}`}>{b.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Chapter Selection Modal */}
      <Modal visible={chapterModalVisible} animationType="fade" transparent={true}>
        <View className="flex-1 bg-black/60 justify-center items-center p-8">
          <View className="bg-white w-full max-h-[70%] rounded-[40px] p-8 shadow-2xl">
            <View className="flex-row items-center justify-between mb-8">
              <Text className="text-2xl font-black text-gray-900">{selectedBook.name} Chapters</Text>
              <TouchableOpacity onPress={() => setChapterModalVisible(false)} className="bg-gray-100 p-2 rounded-full">
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {Array.from({ length: ([...BIBLE_METADATA[lang].old, ...BIBLE_METADATA[lang].new].find(b => b.id === selectedBook.id)?.chapters || 0) }).map((_, i) => (
                <TouchableOpacity 
                  key={i}
                  onPress={() => { setSelectedChapter(i + 1); setChapterModalVisible(false); }}
                  className={`w-14 h-14 items-center justify-center rounded-2xl border ${selectedChapter === i + 1 ? 'bg-accent border-accent' : 'bg-gray-50 border-gray-100'}`}
                >
                  <Text className={`font-bold text-lg ${selectedChapter === i + 1 ? 'text-white' : 'text-gray-900'}`}>{i + 1}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
