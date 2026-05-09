import React from 'react';
import { View, Text } from 'react-native';
import { 
  Carousel, 
  EventFeed, 
  TestimonialsCarousel 
} from '@/components/shared';
import { Screen, Section } from '@/components/layout';
import { Hero, QuickActions } from '@/components/home';
import testimonialsData from '@/../next-ogudu/data/testimonial';

const HERO_ITEMS = [
  { id: '1', url: 'https://cccogudu.vercel.app/crown.webp', title: 'O Good Forever', subtitle: 'Experience the Divine' },
  { id: '2', url: 'https://cccogudu.vercel.app/images/hero2.jpg', title: 'Worship With Us', subtitle: 'Every Sunday 10AM' },
];

export default function HomeScreen() {
  return (
    <Screen safe={true} scrollable={true}>
      <Hero />
      <QuickActions />

      <Section title="Spotlight" className="mt-4">
        <Carousel 
          items={HERO_ITEMS} 
          variant="coverflow"
          autoPlay
        />
      </Section>

      <Section>
        <EventFeed />
      </Section>

      <TestimonialsCarousel 
        title="Voice of the Faithful"
        description="Testimonies and prayer requests from our community"
        testimonials={testimonialsData.testimonials}
      />

      <View className="h-24" />
    </Screen>
  );
}
