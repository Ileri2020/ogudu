import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number; // milliseconds per character
  onComplete?: () => void;
  autoStart?: boolean;
  cursor?: boolean;
}

export const TypewriterText = ({
  text,
  className = '',
  speed = 100,
  onComplete,
  autoStart = true,
  cursor = true,
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!autoStart) {
      setDisplayedText(text);
      return;
    }

    if (displayedText.length >= text.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedText, text, speed, autoStart, onComplete]);

  return (
    <View>
      <Text className={className}>
        {displayedText}
        {cursor && !isComplete && (
          <Text className="text-slate-900 dark:text-white animate-pulse">
            |
          </Text>
        )}
      </Text>
    </View>
  );
};
