import { useCallback, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Typography } from '@/constants/typography';
import { Image } from 'react-native';
import QuoteImage from './assets/Home4.jpeg';

const FALLBACK_QUOTE =
  'Patience is not passive waiting. It is active acceptance of the process required to attain your goals.';

type ZenQuoteResponse = {
  q?: unknown;
  a?: unknown;
};

type TodaysReflectionProps = {
  quote?: string;
};

export default function TodaysReflection({
  quote = FALLBACK_QUOTE,
}: TodaysReflectionProps) {
  const [quoteText, setQuoteText] = useState(quote);
  const [author, setAuthor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();

      const loadQuote = async () => {
        setIsLoading(true);

        try {
          const response = await fetch('https://zenquotes.io/api/today', {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(`ZenQuotes request failed: ${response.status}`);

          const data: unknown = await response.json();
          const result = Array.isArray(data) ? (data[0] as ZenQuoteResponse | undefined) : undefined;
          const nextQuote = typeof result?.q === 'string' ? result.q.trim() : '';
          const nextAuthor = typeof result?.a === 'string' ? result.a.trim() : '';

          if (nextQuote) {
            setQuoteText(nextQuote);
            setAuthor(nextAuthor || null);
          }
        } catch (error) {
          if (!controller.signal.aborted) {
            console.warn('Unable to load today\'s quote', error);
            setQuoteText(quote);
            setAuthor(null);
          }
        } finally {
          if (!controller.signal.aborted) setIsLoading(false);
        }
      };

      loadQuote();
      return () => controller.abort();
    }, [quote]),
  );

  return (
    <View className="mt-4 bg-emerald-900/40 border border-emerald-800/50 rounded-2xl p-5 h-32">
      <Text className="text-emerald-100/50 uppercase mb-4" style={Typography.sectionLabel}>
        Today&apos;s Reflection
      </Text>
      <View className="overflow-hidden rounded-2xl">
        <Image
          source={QuoteImage}
          resizeMode="cover"
          accessibilityLabel="A quiet natural landscape"
          style={{ width: '100%', height: 400 }}
        />
        <View
          pointerEvents="none"
          className="absolute inset-0 bg-emerald-950/25"
        />
      </View>
      {isLoading ? (
        <View className="mt-4 flex-row items-center">
          <ActivityIndicator size="small" color="#b9c7b9" />
          <Text className="ml-2 text-xl text-emerald-100/60">Finding today&apos;s reflection...</Text>
        </View>
      ) : (
        <>
          <Text className="text-white italic text-2xl py-4 leading-6 mt-3">{quoteText}</Text>
          {author && <Text className="text-emerald-100/50 text-sm mt-2">- {author}</Text>}
        </>
      )}
    </View>
  );
}