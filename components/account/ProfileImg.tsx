import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext';
import { API_URL } from '@/constants/Config';

interface ProfileImgProps {
  onImageSelected?: (uri: string) => void;
}

export const ProfileImg = ({ onImageSelected }: ProfileImgProps) => {
  const { user, setUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    user?.avatarUrl || null
  );

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission denied',
          'We need permission to access your photos'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission denied',
          'We need permission to access your camera'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const uploadImage = async (uri: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await axios.post(
        `${API_URL}/api/upload/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.imageUrl) {
        if (user) {
          setUser({
            ...user,
            avatarUrl: response.data.imageUrl,
          });
        }
        Alert.alert('Success', 'Profile image updated');
        onImageSelected?.(response.data.imageUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="items-center py-8">
      {/* Profile Image */}
      <View className="relative mb-4">
        <View className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex items-center justify-center">
          {selectedImage || user?.avatarUrl ? (
            <Image
              source={{ uri: selectedImage || user?.avatarUrl }}
              className="w-full h-full"
            />
          ) : (
            <MaterialIcons name="person" size={64} color="#94a3b8" />
          )}
        </View>

        {/* Edit Button Overlay */}
        {loading && (
          <View className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <ActivityIndicator color="white" />
          </View>
        )}
      </View>

      {/* Info Text */}
      <Text className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        {user?.username}
      </Text>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        <Pressable
          onPress={pickImage}
          disabled={loading}
          className="bg-blue-600 dark:bg-blue-500 rounded-lg px-4 py-2 flex-row items-center gap-2"
        >
          <MaterialIcons name="image" size={20} color="white" />
          <Text className="text-white font-semibold">Gallery</Text>
        </Pressable>

        <Pressable
          onPress={takePhoto}
          disabled={loading}
          className="bg-green-600 dark:bg-green-500 rounded-lg px-4 py-2 flex-row items-center gap-2"
        >
          <MaterialIcons name="camera-alt" size={20} color="white" />
          <Text className="text-white font-semibold">Camera</Text>
        </Pressable>
      </View>
    </View>
  );
};
