import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, KeyboardAvoidingView } from 'react-native';
const { Image, Platform, Alert } = require('react-native') as {
  Image: React.ComponentType<any>;
  Platform: { OS: string; select: <T>(s: Partial<Record<string, T>>) => T };
  Alert: { alert: (title: string, msg?: string, buttons?: any[], opts?: any) => void };
};
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URL } from '@/constants/Config';
import { useAppContext } from '@/context/AppContext';
import { MaterialIcons } from '@expo/vector-icons';

export const PostButton = ({ onPostSuccess }: { onPostSuccess?: () => void }) => {
  const { user } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);
  
  const [file, setFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    for: "post",
    description: "",
    type: "image",
  });

  const categories = [
    { label: 'Post', value: 'post' },
    { label: 'Praise Video', value: 'praisevideo' },
    { label: 'Worship Video', value: 'worshipvideo' },
    { label: 'Event', value: 'event' },
    { label: 'Project', value: 'project' },
    { label: 'Service', value: 'service' },
  ];

  const handlePickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        setFile(pickedFile);
        setFormData({ ...formData, type: pickedFile.type === 'video' ? 'video' : 'image' });
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploadProgress(0);
    setFormData({ title: "", for: "post", description: "", type: "image" });
  };

  const closeAndReset = () => {
    resetForm();
    setModalVisible(false);
  };

  const handleUpload = async () => {
    if (!user || user.username === 'visitor') {
      Alert.alert('Login Required', 'You must be signed in to post.');
      return;
    }
    if (!file) {
      Alert.alert('Missing Media', 'Please select a photo or video to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Get Signature
      const sigRes = await axios.get(`${API_URL}/api/cloudinary-signature`);
      const { signature, timestamp, cloudName, apiKey } = sigRes.data;

      // 2. Prepare FormData for Cloudinary
      const data = new FormData();
      data.append('file', {
        uri: file.uri,
        name: file.fileName || `upload.${file.type === 'video' ? 'mp4' : 'jpg'}`,
        type: file.mimeType || (file.type === 'video' ? 'video/mp4' : 'image/jpeg'),
      } as any);
      data.append("api_key", apiKey);
      data.append("timestamp", timestamp);
      data.append("signature", signature);

      // 3. Upload to Cloudinary
      const cloudRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            }
          },
        }
      );

      const fileUrl = cloudRes.data.secure_url;

      // 4. Save to Database
      await axios.post(`${API_URL}/api/dbhandler?model=posts`, {
        ...formData,
        userId: user.id,
        url: fileUrl,
      });

      Alert.alert('Success', 'Post uploaded successfully!');
      if (onPostSuccess) onPostSuccess();
      closeAndReset();

    } catch (err) {
      console.error(err);
      Alert.alert('Upload Failed', 'An error occurred while uploading your media.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        className="w-full flex-row justify-center items-center py-3 bg-secondary rounded-full border border-accent/20 mb-4 shadow-sm"
      >
        <MaterialIcons name="add-circle-outline" size={24} color="#F97316" />
        <Text className="ml-2 font-bold text-accent text-lg">Create Post</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background">
          <View className="flex-row justify-between items-center p-6 border-b border-border/50">
            <Text className="text-xl font-bold text-foreground">New Post</Text>
            <TouchableOpacity onPress={closeAndReset}>
              <MaterialIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-6">
            {/* Media Picker */}
            <TouchableOpacity 
              onPress={handlePickMedia}
              className="w-full h-48 bg-secondary rounded-2xl justify-center items-center overflow-hidden mb-6 border-2 border-dashed border-border"
            >
              {file ? (
                <Image source={{ uri: file.uri }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <>
                  <MaterialIcons name="cloud-upload" size={48} color="#6B7280" />
                  <Text className="mt-2 text-muted-foreground font-medium">Tap to select photo/video</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Title */}
            <Text className="text-sm font-bold text-foreground mb-2">Title</Text>
            <TextInput
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Enter title..."
              placeholderTextColor="#6B7280"
              className="bg-secondary p-4 rounded-xl text-foreground mb-6"
            />

            {/* Category Selector */}
            <Text className="text-sm font-bold text-foreground mb-2">Category</Text>
            <View className="flex-row flex-wrap mb-4">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() => setFormData({ ...formData, for: cat.value })}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 ${formData.for === cat.value ? 'bg-accent' : 'bg-secondary'}`}
                >
                  <Text className={`font-semibold ${formData.for === cat.value ? 'text-white' : 'text-foreground'}`}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Description */}
            <Text className="text-sm font-bold text-foreground mb-2">Description</Text>
            <TextInput
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Write a description..."
              placeholderTextColor="#6B7280"
              className="bg-secondary p-4 rounded-xl text-foreground mb-6 h-24"
              multiline
              textAlignVertical="top"
            />

            {/* Upload Button */}
            <TouchableOpacity 
              onPress={handleUpload}
              disabled={isUploading || !file}
              className={`w-full py-4 rounded-xl items-center flex-row justify-center mb-10 ${isUploading || !file ? 'bg-accent/50' : 'bg-accent'}`}
            >
              {isUploading ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text className="text-white font-bold text-lg ml-2">Uploading {uploadProgress}%</Text>
                </>
              ) : (
                <Text className="text-white font-bold text-lg">Upload Media</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};
