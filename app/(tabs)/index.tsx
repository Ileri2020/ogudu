import React from 'react';
import { View } from 'react-native';
import { 
  Carousel, 
  EventFeed, 
  TestimonialsCarousel,
  Gallery,
  Audio,
  Posts,
  Logobg,
  Footer,
  Social,
  CoverCarousel,
} from '@/components/shared';
import { Screen, Section } from '@/components/layout';
import { Hero, QuickActions } from '@/components/home';
import testimonialsData from '@/data/testimonial';

const HERO_ITEMS = [
  { id: '1', url: 'https://cccogudu.vercel.app/crown.webp', title: 'O Good Forever', subtitle: 'Experience the Divine' },
  { id: '2', url: 'https://cccogudu.vercel.app/images/hero2.jpg', title: 'Worship With Us', subtitle: 'Every Sunday 10AM' },
];

const COVER_ITEMS = [
  { id: '1', title: 'Praise', image: 'https://cccogudu.vercel.app/praise.jpg', description: 'Experience the power of praise' },
  { id: '2', title: 'Worship', image: 'https://cccogudu.vercel.app/worship.jpg', description: 'Enter into worship' },
  { id: '3', title: 'Prayer', image: 'https://cccogudu.vercel.app/prayer.jpg', description: 'Connect with the divine' },
];

export default function HomeScreen() {
  return (
    <Screen safe={true} scrollable={true}>
      <Hero />
      <QuickActions />

      <Section title="Featured" className="mt-4">
        <Logobg size="large" variant="gradient" showText={true} />
      </Section>

      <Section title="Spotlight" className="mt-4">
        <Carousel 
          items={HERO_ITEMS} 
          variant="coverflow"
          autoPlay
        />
      </Section>

      <Section title="Latest Events">
        <EventFeed />
      </Section>

      <Section title="Testimonies">
        <TestimonialsCarousel 
          title="Voice of the Faithful"
          description="Testimonies and prayer requests from our community"
          testimonials={testimonialsData.testimonials}
        />
      </Section>

      <Section title="Cover Carousel">
        <CoverCarousel items={COVER_ITEMS} />
      </Section>

      <Section title="Gallery">
        <Gallery limit={8} />
      </Section>

      <Section title="Audio Ministry">
        <Audio category="worship" limit={10} />
      </Section>

      <Section title="Recent Updates">
        <Posts limit={5} />
      </Section>

      <Section className="pb-8">
        <Social size={24} />
      </Section>

      <Footer />

      <View className="h-24" />
    </Screen>
  );
}
