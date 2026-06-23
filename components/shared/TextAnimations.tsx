import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  AnimatedText,
  ZoomInText,
  FlyInText,
  SlideUpText,
  SlideInText,
  ScaleInText,
  FlipInText,
  BounceInText,
  RotateInText,
} from './AnimatedText';
import { TypewriterText } from './TypewriterText';

export type TextAnimationType =
  | 'fade'
  | 'zoom'
  | 'fly'
  | 'slide'
  | 'scale'
  | 'flip'
  | 'bounce'
  | 'rotate'
  | 'typewriter';

interface TextAnimationsProps {
  text: string;
  type?: TextAnimationType;
  className?: string;
  onComplete?: () => void;
  typewriterSpeed?: number;
}

/**
 * TextAnimations - Container component for various text animation types
 * Automatically selects and applies the appropriate animation based on type
 */
export const TextAnimations = ({
  text,
  type = 'fade',
  className = 'text-xl font-bold text-slate-900 dark:text-white',
  onComplete,
  typewriterSpeed = 100,
}: TextAnimationsProps) => {
  switch (type) {
    case 'zoom':
      return <ZoomInText text={text} className={className} />;
    case 'fly':
      return <FlyInText text={text} className={className} />;
    case 'slide':
      return <SlideUpText text={text} className={className} />;
    case 'scale':
      return <ScaleInText text={text} className={className} />;
    case 'flip':
      return <FlipInText text={text} className={className} />;
    case 'bounce':
      return <BounceInText text={text} className={className} />;
    case 'rotate':
      return <RotateInText text={text} className={className} />;
    case 'typewriter':
      return (
        <TypewriterText
          text={text}
          className={className}
          speed={typewriterSpeed}
          onComplete={onComplete}
        />
      );
    default:
      return <AnimatedText text={text} className={className} type="fade" />;
  }
};

/**
 * TextAnimationsGroup - Animate multiple text elements in sequence
 */
interface TextAnimationsGroupProps {
  texts: string[];
  type?: TextAnimationType;
  className?: string;
  gap?: number;
}

export const TextAnimationsGroup = ({
  texts,
  type = 'fade',
  className = 'text-lg text-slate-900 dark:text-white',
  gap = 2,
}: TextAnimationsGroupProps) => {
  return (
    <View className={`gap-${gap}`}>
      {texts.map((text, index) => (
        <TextAnimations
          key={`${text}-${index}`}
          text={text}
          type={type}
          className={className}
        />
      ))}
    </View>
  );
};

/**
 * Animated hero title - Common pattern for home page headers
 */
interface AnimatedHeroTitleProps {
  mainText: string;
  subtitle?: string;
  animationType?: TextAnimationType;
}

export const AnimatedHeroTitle = ({
  mainText,
  subtitle,
  animationType = 'zoom',
}: AnimatedHeroTitleProps) => {
  return (
    <View className="items-center gap-3 py-6">
      <TextAnimations
        text={mainText}
        type={animationType}
        className="text-3xl font-bold text-center text-slate-900 dark:text-white"
      />
      {subtitle && (
        <TextAnimations
          text={subtitle}
          type="fade"
          className="text-base text-center text-slate-600 dark:text-slate-400"
        />
      )}
    </View>
  );
};
