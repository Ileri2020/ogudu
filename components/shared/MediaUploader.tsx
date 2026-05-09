import React, { useState } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, Alert, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useAppContext } from '@/context/AppContext';
import { Button, Input, Select } from '@/components/ui';
import { Camera, Plus, X, FileText, Music, Video as VideoIcon } from 'lucide-react-native';
import { postService } from '@/services/posts';
import { useUpload } from '@/hooks/useUpload';

interface MediaUploaderProps {
  onSuccess?: () => void;
  isProfileImage?: boolean;
}

interface MediaFormData {
  title: string;
  description: string;
  for: string;
  type: 'image' | 'video' | 'audio' | 'document';
}

export const MediaUploader = ({ onSuccess, isProfileImage = false }: MediaUploaderProps) => {
  const { user, setUser } = useAppContext();
  const { uploadToCloudinary, uploading } = useUpload();
  const [file, setFile] = useState<ImagePicker.ImagePickerAsset | DocumentPicker.DocumentPickerAsset | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<MediaFormData>({
    title: '',
    description: '',
    for: 'post',
    type: 'image'
  });

  const CATEGORY_OPTIONS = [
    { label: 'Post', value: 'post' },
    { label: 'Event', value: 'event' },
    { label: 'Project', value: 'project' },
    { label: 'Praise Video', value: 'praisevideo' },
    { label: 'Worship Video', value: 'worshipvideo' },
  ];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setFile(asset);
      setPreview(asset.uri);
      setFormData({ ...formData, type: asset.type === 'video' ? 'video' : 'image' });
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setFile(asset);
      setPreview(null);
      setFormData({ ...formData, type: 'document', title: asset.name });
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    try {
      const fileUrl = await uploadToCloudinary(file, formData.type);

      const postData = {
        ...formData,
        userId: user.id,
        url: fileUrl,
        profileImage: isProfileImage ? 'true' : 'false'
      };

      await postService.create(postData);

      if (isProfileImage) {
        setUser({ ...user, avatarUrl: fileUrl });
      }

      Alert.alert('Success', 'Upload completed successfully');
      setFile(null);
      setPreview(null);
      onSuccess?.();
    } catch (err) {
      Alert.alert('Error', 'Upload failed. Please try again.');
    }
  };

  return (
    <ScrollView className="p-4 bg-white rounded-t-3xl" showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-black text-gray-900 tracking-tighter">
          {isProfileImage ? 'Profile Picture' : 'New Creation'}
        </Text>
        <Button variant="ghost" size="icon" onPress={() => { setFile(null); setPreview(null); }}>
          <X size={24} color="#6b7280" />
        </Button>
      </View>

      <View className="flex-row gap-4 mb-6">
        <TouchableOpacity 
          onPress={pickImage}
          className="flex-1 aspect-square bg-gray-50 rounded-3xl items-center justify-center border-2 border-dashed border-gray-200"
        >
          <Camera size={32} color="#f59e0b" />
          <Text className="text-xs font-bold text-gray-400 mt-2">Media</Text>
        </TouchableOpacity>
        {!isProfileImage && (
          <TouchableOpacity 
            onPress={pickDocument}
            className="flex-1 aspect-square bg-gray-50 rounded-3xl items-center justify-center border-2 border-dashed border-gray-200"
          >
            <FileText size={32} color="#f59e0b" />
            <Text className="text-xs font-bold text-gray-400 mt-2">Document</Text>
          </TouchableOpacity>
        )}
      </View>

      {preview ? (
        <View className="relative mb-6 rounded-3xl overflow-hidden aspect-video bg-gray-100">
          <Image source={{ uri: preview }} className="w-full h-full" resizeMode="cover" />
          <View className="absolute top-2 right-2">
            <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onPress={() => { setFile(null); setPreview(null); }}>
              <X size={16} color="white" />
            </Button>
          </View>
        </View>
      ) : file && (
        <View className="mb-6 p-4 bg-blue-50 rounded-2xl flex-row items-center gap-3">
          <FileText size={24} color="#3b82f6" />
          <Text className="flex-1 text-blue-700 font-medium" numberOfLines={1}>
            {'name' in file ? file.name : 'Selected File'}
          </Text>
          <Button variant="ghost" size="icon" className="h-8 w-8" onPress={() => setFile(null)}>
            <X size={16} color="#3b82f6" />
          </Button>
        </View>
      )}

      {!isProfileImage && (
        <View className="gap-5 mb-6">
          <Input 
            placeholder="Post Title"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
          <Input 
            placeholder="Description..."
            multiline
            containerClassName="h-32"
            className="h-full pt-4"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
          />
          
          <Select 
            placeholder="Select Category"
            options={CATEGORY_OPTIONS}
            value={formData.for}
            onValueChange={(val) => setFormData({ ...formData, for: val })}
          />
        </View>
      )}

      <Button 
        onPress={handleUpload}
        loading={uploading}
        disabled={!file}
        size="lg"
        className="w-full shadow-lg shadow-accent/40"
      >
        {isProfileImage ? 'Update Image' : 'Publish to Feed'}
      </Button>
      <View className="h-10" />
    </ScrollView>
  );
};
