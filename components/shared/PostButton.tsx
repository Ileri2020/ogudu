import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext';
import { API_URL } from '@/constants/Config';

interface PostButtonProps {
  onPostCreated?: () => void;
  visible: boolean;
  onClose: () => void;
}

type MediaType = 'image' | 'video' | 'audio';

export const PostButton = ({
  onPostCreated,
  visible,
  onClose,
}: PostButtonProps) => {
  const { user } = useAppContext();
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    uri: string;
    type: MediaType;
    name: string;
  } | null>(null);
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    category: 'worship',
  });

  const mediaCategories = [
    { id: 'worship', label: 'Worship', icon: 'music' },
    { id: 'praise', label: 'Praise', icon: 'music' },
    { id: 'preaching', label: 'Preaching', icon: 'mic' },
    { id: 'prayer', label: 'Prayer', icon: 'favorite' },
    { id: 'testimony', label: 'Testimony', icon: 'person' },
  ];

  const handleSelectMedia = async (type: MediaType) => {
    try {
      let result;
      const mediaTypes =
        type === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : type === 'video'
            ? ImagePicker.MediaTypeOptions.Videos
            : ImagePicker.MediaTypeOptions.Audio;

      if (type === 'audio') {
        result = await DocumentPicker.getDocumentAsync({
          type: 'audio/*',
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes,
          quality: 0.8,
          aspect: [16, 9],
        });
      }

      if (!result.canceled) {
        const media = result.assets
          ? result.assets[0]
          : (result as any);
        setSelectedMedia({
          uri: media.uri,
          type,
          name: media.name || `${type}_${Date.now()}`,
        });
        setStep('details');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select media');
    }
  };

  const handlePostCreation = async () => {
    if (!selectedMedia || !postData.title || !postData.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('description', postData.description);
      formData.append('category', postData.category);
      formData.append('type', selectedMedia.type);
      formData.append('file', {
        uri: selectedMedia.uri,
        type: `${selectedMedia.type}/*`,
        name: selectedMedia.name,
      } as any);

      const response = await axios.post(
        `${API_URL}/api/posts`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Post created successfully');
        resetForm();
        onClose();
        onPostCreated?.();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedMedia(null);
    setPostData({ title: '', description: '', category: 'worship' });
    setStep('select');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (step === 'select') {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-slate-800 rounded-t-2xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-900 dark:text-white">
                Create Post
              </Text>
              <Pressable onPress={handleClose}>
                <MaterialIcons name="close" size={24} color="#94a3b8" />
              </Pressable>
            </View>

            <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Select Media Type
            </Text>

            <View className="gap-3">
              <Pressable
                onPress={() => handleSelectMedia('image')}
                className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 flex-row items-center gap-3"
              >
                <MaterialIcons
                  name="image"
                  size={32}
                  color="#3b82f6"
                />
                <View className="flex-1">
                  <Text className="font-semibold text-slate-900 dark:text-white">
                    Image
                  </Text>
                  <Text className="text-sm text-slate-600 dark:text-slate-400">
                    Share a photo
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => handleSelectMedia('video')}
                className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-4 flex-row items-center gap-3"
              >
                <MaterialIcons
                  name="video-library"
                  size={32}
                  color="#9333ea"
                />
                <View className="flex-1">
                  <Text className="font-semibold text-slate-900 dark:text-white">
                    Video
                  </Text>
                  <Text className="text-sm text-slate-600 dark:text-slate-400">
                    Share a video
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => handleSelectMedia('audio')}
                className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 flex-row items-center gap-3"
              >
                <MaterialIcons
                  name="audiotrack"
                  size={32}
                  color="#16a34a"
                />
                <View className="flex-1">
                  <Text className="font-semibold text-slate-900 dark:text-white">
                    Audio
                  </Text>
                  <Text className="text-sm text-slate-600 dark:text-slate-400">
                    Share audio
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-slate-800 rounded-t-2xl p-6 max-h-5/6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-slate-900 dark:text-white">
              Post Details
            </Text>
            <Pressable onPress={handleClose}>
              <MaterialIcons name="close" size={24} color="#94a3b8" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Media Preview */}
            {selectedMedia && (
              <View className="mb-6 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                {selectedMedia.type === 'image' ? (
                  <Image
                    source={{ uri: selectedMedia.uri }}
                    className="w-full h-48"
                  />
                ) : (
                  <View className="w-full h-48 items-center justify-center">
                    <MaterialIcons
                      name={
                        selectedMedia.type === 'video'
                          ? 'video-library'
                          : 'audiotrack'
                      }
                      size={64}
                      color="#94a3b8"
                    />
                  </View>
                )}
              </View>
            )}

            {/* Title Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Title
              </Text>
              <TextInput
                placeholder="Enter post title"
                placeholderTextColor="#cbd5e1"
                value={postData.title}
                onChangeText={(value) =>
                  setPostData({ ...postData, title: value })
                }
                className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white"
              />
            </View>

            {/* Description Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Description
              </Text>
              <TextInput
                placeholder="Enter post description"
                placeholderTextColor="#cbd5e1"
                multiline
                numberOfLines={4}
                value={postData.description}
                onChangeText={(value) =>
                  setPostData({ ...postData, description: value })
                }
                className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white"
                textAlignVertical="top"
              />
            </View>

            {/* Category Selection */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Category
              </Text>
              <FlatList
                data={mediaCategories}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() =>
                      setPostData({
                        ...postData,
                        category: item.id,
                      })
                    }
                    className={`rounded-lg p-3 mr-3 flex-row items-center gap-2 ${
                      postData.category === item.id
                        ? 'bg-blue-600'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <MaterialIcons
                      name={item.icon as any}
                      size={18}
                      color={
                        postData.category === item.id
                          ? 'white'
                          : '#64748b'
                      }
                    />
                    <Text
                      className={`font-semibold ${
                        postData.category === item.id
                          ? 'text-white'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                )}
                keyExtractor={(item) => item.id}
                horizontal
                scrollEnabled={false}
                className="gap-2"
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('select')}
                disabled={loading}
                className="flex-1 bg-slate-300 dark:bg-slate-600 rounded-lg py-3"
              >
                <Text className="text-center font-semibold text-slate-900 dark:text-white">
                  Change Media
                </Text>
              </Pressable>

              <Pressable
                onPress={handlePostCreation}
                disabled={loading}
                className="flex-1 bg-blue-600 dark:bg-blue-500 rounded-lg py-3 flex-row justify-center items-center"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Post</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
