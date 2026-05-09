// components/shared/FileUpload.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Pressable,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Video, ResizeMode } from 'expo-av';
import {
  Camera,
  Image as ImageIcon,
  FileText,
  Music,
  X,
  Upload,
} from 'lucide-react-native';

export type UploadFileType = 'image' | 'video' | 'audio' | 'document';

interface FileUploadProps {
  onUpload: (file: {
    uri: string;
    type: UploadFileType;
    name: string;
    size?: number;
    mimeType?: string;
  }) => void;
  onClear?: () => void;
  allowedTypes?: UploadFileType[];
  maxSizeMB?: number;
  value?: {
    uri: string;
    type: UploadFileType;
  } | null;
}

export function FileUpload({
  onUpload,
  onClear,
  allowedTypes = ['image', 'video', 'audio', 'document'],
  maxSizeMB = 50,
  value,
}: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<{
    uri: string;
    type: UploadFileType;
  } | null>(value || null);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant camera and media library permissions to upload files.'
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async (source: 'camera' | 'library') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.8,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.8,
            });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileInfo = {
          uri: asset.uri,
          type: 'image' as UploadFileType,
          name: asset.uri.split('/').pop() || 'image.jpg',
          size: asset.fileSize,
          mimeType: asset.mimeType,
        };

        if (maxSizeMB && fileInfo.size && fileInfo.size > maxSizeMB * 1024 * 1024) {
          Alert.alert('Error', `File size must be less than ${maxSizeMB}MB`);
          return;
        }

        setPreview({ uri: fileInfo.uri, type: 'image' });
        onUpload(fileInfo);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const pickVideo = async () => {
    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileInfo = {
          uri: asset.uri,
          type: 'video' as UploadFileType,
          name: asset.uri.split('/').pop() || 'video.mp4',
          size: asset.fileSize,
          mimeType: asset.mimeType,
        };

        setPreview({ uri: fileInfo.uri, type: 'video' });
        onUpload(fileInfo);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const pickDocument = async () => {
    setIsLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*', 'application/pdf', '*/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const type: UploadFileType = asset.mimeType?.startsWith('audio/')
          ? 'audio'
          : 'document';

        const fileInfo = {
          uri: asset.uri,
          type,
          name: asset.name,
          size: asset.size,
          mimeType: asset.mimeType,
        };

        setPreview({ uri: fileInfo.uri, type });
        onUpload(fileInfo);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onClear?.();
  };

  const renderPreview = () => {
    if (!preview) return null;

    switch (preview.type) {
      case 'image':
        return (
          <View className="relative">
            <Image
              source={{ uri: preview.uri }}
              className="w-full h-48 rounded-xl"
              resizeMode={ResizeMode.COVER}
            />
            <Pressable
              onPress={handleClear}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 justify-center items-center"
            >
              <X size={16} color="white" />
            </Pressable>
          </View>
        );

      case 'video':
        return (
          <View className="relative">
            <Video
              source={{ uri: preview.uri }}
              className="w-full h-48 rounded-xl"
              resizeMode={ResizeMode.COVER}
              useNativeControls
            />
            <Pressable
              onPress={handleClear}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 justify-center items-center"
            >
              <X size={16} color="white" />
            </Pressable>
          </View>
        );

      case 'audio':
      case 'document':
        return (
          <View className="relative p-4 bg-secondary/30 rounded-xl flex-row items-center gap-3">
            {preview.type === 'audio' ? (
              <Music size={40} color="#f59e0b" />
            ) : (
              <FileText size={40} color="#f59e0b" />
            )}
            <View className="flex-1">
              <Text className="font-medium" numberOfLines={1}>
                {preview.uri.split('/').pop()}
              </Text>
              <Text className="text-xs text-gray-500 capitalize">
                {preview.type}
              </Text>
            </View>
            <Pressable onPress={handleClear} className="p-2">
              <X size={20} color="#6b7280" />
            </Pressable>
          </View>
        );
    }
  };

  if (preview) {
    return renderPreview();
  }

  return (
    <View className="w-full">
      {isLoading ? (
        <View className="h-48 justify-center items-center bg-gray-50 rounded-xl">
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text className="mt-2 text-gray-500">Processing...</Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-3">
          {allowedTypes.includes('image') && (
            <>
              <Pressable
                onPress={() => pickImage('camera')}
                className="flex-1 min-w-[100px] h-24 bg-gray-50 rounded-xl justify-center items-center border-2 border-dashed border-gray-300"
              >
                <Camera size={24} color="#6b7280" />
                <Text className="text-xs text-gray-500 mt-1">
                  Camera
                </Text>
              </Pressable>

              <Pressable
                onPress={() => pickImage('library')}
                className="flex-1 min-w-[100px] h-24 bg-gray-50 rounded-xl justify-center items-center border-2 border-dashed border-gray-300"
              >
                <ImageIcon size={24} color="#6b7280" />
                <Text className="text-xs text-gray-500 mt-1">
                  Gallery
                </Text>
              </Pressable>
            </>
          )}

          {allowedTypes.includes('video') && (
            <Pressable
              onPress={pickVideo}
              className="flex-1 min-w-[100px] h-24 bg-gray-50 rounded-xl justify-center items-center border-2 border-dashed border-gray-300"
            >
              <Upload size={24} color="#6b7280" />
              <Text className="text-xs text-gray-500 mt-1">
                Video
              </Text>
            </Pressable>
          )}

          {(allowedTypes.includes('audio') || allowedTypes.includes('document')) && (
            <Pressable
              onPress={pickDocument}
              className="flex-1 min-w-[100px] h-24 bg-gray-50 rounded-xl justify-center items-center border-2 border-dashed border-gray-300"
            >
              <FileText size={24} color="#6b7280" />
              <Text className="text-xs text-gray-500 mt-1">
                File
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}