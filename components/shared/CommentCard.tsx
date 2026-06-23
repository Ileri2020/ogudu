import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext';
import { API_URL } from '@/constants/Config';

interface CommentCardProps {
  id: string;
  username: string;
  comment: string;
  createdAt: string;
  onDelete?: () => void;
}

export const CommentCard = ({
  id,
  username,
  comment,
  createdAt,
  onDelete,
}: CommentCardProps) => {
  const { user } = useAppContext();
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  const handleDelete = async () => {
    Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/api/dbhandler?model=comments&id=${id}`);
            Alert.alert('Success', 'Comment deleted');
            onDelete?.();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete comment');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <View className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 mb-2">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="font-semibold text-sm text-slate-900 dark:text-white">
            @{username}
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {formatDate(createdAt)}
          </Text>
        </View>
        {isAdmin && (
          <Pressable onPress={handleDelete} className="p-2">
            <MaterialIcons name="delete" size={18} color="red" />
          </Pressable>
        )}
      </View>
      <Text className="text-sm text-slate-700 dark:text-slate-200 mt-2">{comment}</Text>
    </View>
  );
};
