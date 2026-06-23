import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@/constants/Config';

interface GalleryItem {
  _id: string;
  name: string;
  description: string;
  img: string;
  price: number;
  cost?: number;
  qty?: number;
}

interface GalleryProps {
  limit?: number;
  onAddToCart?: (item: GalleryItem) => void;
}

export const Gallery = ({ limit = 10, onAddToCart }: GalleryProps) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/data/stock?limit=${limit}`);
      const shuffled = response.data.sort(() => Math.random() - 0.5);
      setItems(shuffled);
    } catch (err) {
      setError('Failed to load gallery items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: GalleryItem) => {
    if (onAddToCart) {
      onAddToCart(item);
    } else {
      Alert.alert('Added to Cart', `${item.name} has been added to your cart`);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => (
        <View
          className={`mb-8 overflow-hidden ${
            index % 2 === 1 ? 'flex-row-reverse' : ''
          }`}
        >
          {/* Image */}
          <View className="w-full h-64 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden justify-center items-center mb-4">
            <Image
              source={{ uri: item.img }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          {/* Details */}
          <View className="flex-1 items-center px-4 py-4">
            <Text className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {item.name}
            </Text>
            <Text
              className="text-base text-slate-700 dark:text-slate-200 text-center mb-4 max-h-20"
              numberOfLines={3}
            >
              {item.description}
            </Text>

            {/* Price and Button */}
            <View className="flex-row items-center gap-3">
              <Text className="text-xl font-bold text-blue-600 dark:text-blue-400">
                ${item.price}
              </Text>
              <Pressable
                onPress={() => handleAddToCart(item)}
                className="bg-blue-600 dark:bg-blue-500 px-6 py-2 rounded-lg flex-row items-center gap-2"
              >
                <MaterialIcons name="shopping-cart" size={20} color="white" />
                <Text className="text-white font-semibold">Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
      keyExtractor={(item) => item._id}
      scrollEnabled={false}
    />
  );
};
