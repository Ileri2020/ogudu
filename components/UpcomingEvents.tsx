import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import { API_URL } from '@/constants/Config';

interface Event {
  id: string;
  title: string;
  post: string;
  url: string;
  updatedAt: string;
  user: {
    username: string;
    avatarUrl: string;
  };
}

export const UpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/dbhandler`, {
          params: { model: 'posts' },
        });
        const filteredEvents = response.data.filter(
          (event: any) => event.for === 'event' && event.type === 'image'
        );
        setEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const min = Math.floor(diff / 60000);
    const hrs = Math.floor(min / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) return `last ${days} d`;
    if (hrs > 0) return `last ${hrs} h`;
    if (min > 0) return `last ${min} m`;
    return 'just now';
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#F97316" className="mt-10" />;
  }

  if (events.length === 0) return null;

  return (
    <View className="flex flex-col items-center mt-8">
      <Text className="text-3xl font-bold text-center">Upcoming Events</Text>
      <View className="w-20 h-1 bg-accent my-4 rounded-full" />
      
      {events.map((event) => (
        <View key={event.id} className="mb-8 w-full max-w-sm bg-secondary rounded-xl overflow-hidden shadow-sm">
          {/* Header */}
          <View className="flex-row items-center p-3">
            <Image
              source={{ uri: event.user?.avatarUrl || 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png' }}
              className="w-10 h-10 rounded-full"
            />
            <View className="ml-3 flex-1">
              <Text className="font-semibold text-foreground">{event.user?.username}</Text>
              <Text className="text-xs text-muted-foreground">{formatDate(event.updatedAt)}</Text>
            </View>
          </View>

          {/* Image */}
          <Image source={{ uri: event.url }} className="w-full aspect-square" resizeMode="cover" />

          {/* Body */}
          <View className="p-4">
            {event.title && <Text className="font-bold text-lg mb-1">{event.title}</Text>}
            <Text className="text-foreground/80">{event.post}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};
