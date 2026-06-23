import React from 'react';
import { View, Text } from 'react-native';
import { Screen, Section, PageHeader } from '@/components/layout';
import { ContactForm, Social, Footer } from '@/components/shared';

const CONTACT_INFO = [
  {
    title: 'Location',
    value: 'CCC Ogudu Expressway, Lagos, Nigeria',
    icon: '📍',
  },
  {
    title: 'Service Times',
    value: 'Sunday: 10:00 AM\nWednesday: 7:00 PM',
    icon: '⏰',
  },
  {
    title: 'Email',
    value: 'contact@cccogudu.org',
    icon: '✉️',
  },
  {
    title: 'Phone',
    value: '+234 (123) 456-7890',
    icon: '📱',
  },
];

export default function ContactScreen() {
  return (
    <Screen safe={true} scrollable={true}>
      <PageHeader title="Get in" accentTitle="Touch" subtitle="We'd love to hear from you" />

      <Section>
        <Text className="text-gray-600 text-base leading-relaxed mb-8">
          Have a question or prayer request? Fill out the form below and we'll get back to you as soon as possible.
        </Text>
        <ContactForm 
          onSuccess={() => {}}
          onError={(error) => console.error(error)}
        />
      </Section>

      <Section title="Contact" accentTitle="Information">
        {CONTACT_INFO.map((info, index) => (
          <View key={index} className="mb-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <View className="flex-row items-start">
              <Text className="text-3xl mr-4">{info.icon}</Text>
              <View className="flex-1">
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {info.title}
                </Text>
                <Text className="text-gray-900 font-semibold text-base leading-relaxed">
                  {info.value}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </Section>

      <Section title="Follow" accentTitle="Us" className="items-center">
        <View className="mb-8">
          <Text className="text-gray-600 text-center text-sm">Connect with our community on social media</Text>
        </View>
        <Social size={28} />
      </Section>

      <Footer />

      <View className="h-24" />
    </Screen>
  );
}
