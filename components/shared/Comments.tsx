import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext';

interface Comment {
  id: string;
  username: string;
  comment: string;
  createdAt: string;
  contentId: string;
}

interface CommentsProps {
  videoId: string;
  reload?: boolean;
}

export const Comments = ({ videoId, reload }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const getComments = async (id: string) => {
    try {
      const res = await axios.get(`/api/dbhandler?model=comments&id=${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    if (!videoId) return;

    setLoading(true);
    getComments(videoId)
      .then((res) => {
        setComments(res.filter((c: any) => c.contentId === videoId));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [videoId, reload]);

  if (loading) {
    return (
      <View className="py-4 justify-center items-center">
        <ActivityIndicator size="small" color="#f59e0b" />
      </View>
    );
  }

  if (comments.length === 0) {
    return (
      <View className="py-4 justify-center items-center">
        <Text className="text-gray-500 text-sm">No comments yet...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {comments.map((comment) => (
        <View key={comment.id} className="border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50">
          <Text className="font-bold text-gray-900">@{comment.username}</Text>
          <Text className="text-gray-700 mt-1">{comment.comment}</Text>
          <Text className="text-xs text-gray-400 mt-2">{new Date(comment.createdAt).toLocaleDateString()}</Text>
        </View>
      ))}
    </View>
  );
};
