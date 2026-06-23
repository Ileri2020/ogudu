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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@/constants/Config';

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  onSubmit?: (data: any) => void;
}

interface BookData {
  title: string;
  author: string;
  description: string;
  price: number;
}

interface PaymentData {
  amount: number;
  method: 'card' | 'transfer' | 'wallet';
  email: string;
}

export const BookDrawer = ({ visible, onClose, title, onSubmit }: DrawerProps) => {
  const [loading, setLoading] = useState(false);
  const [bookData, setBookData] = useState<BookData>({
    title: '',
    author: '',
    description: '',
    price: 0,
  });

  const handleSubmit = async () => {
    if (!bookData.title || !bookData.author || !bookData.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/books`, bookData);
      Alert.alert('Success', 'Book saved successfully');
      setBookData({ title: '', author: '', description: '', price: 0 });
      onClose();
      onSubmit?.(bookData);
    } catch (error) {
      Alert.alert('Error', 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-slate-800 rounded-t-2xl p-6 max-h-5/6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#94a3b8" />
            </Pressable>
          </View>

          <ScrollView>
            {/* Title Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-2">Book Title</Text>
              <TextInput
                placeholder="Enter book title"
                value={bookData.title}
                onChangeText={(value) =>
                  setBookData({ ...bookData, title: value })
                }
                className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white"
              />
            </View>

            {/* Author Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-2">Author</Text>
              <TextInput
                placeholder="Enter author name"
                value={bookData.author}
                onChangeText={(value) =>
                  setBookData({ ...bookData, author: value })
                }
                className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white"
              />
            </View>

            {/* Description Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-2">Description</Text>
              <TextInput
                placeholder="Enter book description"
                multiline
                numberOfLines={4}
                value={bookData.description}
                onChangeText={(value) =>
                  setBookData({ ...bookData, description: value })
                }
                className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white"
              />
            </View>

            {/* Price Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-2">Price ($)</Text>
              <TextInput
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={bookData.price.toString()}
                onChangeText={(value) =>
                  setBookData({ ...bookData, price: parseFloat(value) || 0 })
                }
                className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white"
              />
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="bg-blue-600 dark:bg-blue-500 rounded-lg py-3 flex-row justify-center items-center"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">Save Book</Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export const PayDrawer = ({ visible, onClose, title, onSubmit }: DrawerProps) => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 0,
    method: 'card',
    email: '',
  });

  const handleSubmit = async () => {
    if (!paymentData.amount || !paymentData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // This would typically integrate with a payment gateway like Paystack, Stripe, etc.
      await axios.post(`${API_URL}/api/payments`, paymentData);
      Alert.alert('Success', 'Payment initiated');
      setPaymentData({ amount: 0, method: 'card', email: '' });
      onClose();
      onSubmit?.(paymentData);
    } catch (error) {
      Alert.alert('Error', 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-slate-800 rounded-t-2xl p-6 max-h-5/6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#94a3b8" />
            </Pressable>
          </View>

          <ScrollView>
            {/* Amount Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-2">Amount ($)</Text>
              <TextInput
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={paymentData.amount.toString()}
                onChangeText={(value) =>
                  setPaymentData({
                    ...paymentData,
                    amount: parseFloat(value) || 0,
                  })
                }
                className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white"
              />
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-2">Email</Text>
              <TextInput
                placeholder="Enter your email"
                keyboardType="email-address"
                value={paymentData.email}
                onChangeText={(value) =>
                  setPaymentData({ ...paymentData, email: value })
                }
                className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white"
              />
            </View>

            {/* Payment Method */}
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-2">Payment Method</Text>
              <View className="gap-2">
                {(['card', 'transfer', 'wallet'] as const).map((method) => (
                  <Pressable
                    key={method}
                    onPress={() =>
                      setPaymentData({ ...paymentData, method })
                    }
                    className={`p-3 rounded-lg border-2 ${
                      paymentData.method === method
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    <Text
                      className={`font-semibold capitalize ${
                        paymentData.method === method
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {method}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="bg-blue-600 dark:bg-blue-500 rounded-lg py-3 flex-row justify-center items-center"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">
                  Process Payment
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
