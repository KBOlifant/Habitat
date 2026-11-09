import { useCallback, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Typography } from '@/constants/typography';
import { Image } from 'react-native';
import QuoteImage from './assets/Home4.jpeg';
import { getDailyQuote } from '../../functions/quotes';
import { HabitatColors } from '@/constants/theme';

const FALLBACK_QUOTE =
  'Patience is not passive waiting. It is active acceptance of the process required to attain your goals.';

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
          const result = await getDailyQuote(controller.signal);
          if (result) {
            setQuoteText(result.quote);
            setAuthor(result.author);
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
    <View className="mt-4 overflow-hidden rounded-2xl border" style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.border }}>
      <View className="overflow-hidden border-b" style={{ borderColor: HabitatColors.border }}>
        <Image
          source={QuoteImage}
          resizeMode="cover"
          accessibilityLabel="A quiet natural landscape"
          style={{ width: '100%', height: 105 }}
        />
        <View
          pointerEvents="none"
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(24, 31, 17, 0.3)' }}
        />
      </View>
      <View className="p-4">
        <Text className="mb-2 uppercase" style={[Typography.sectionLabel, { color: HabitatColors.accent }]}>
          Field note
        </Text>
      {isLoading ? (
        <View className="mt-4 flex-row items-center">
          <ActivityIndicator size="small" color={HabitatColors.accent} />
          <Text className="ml-2 text-sm" style={{ color: HabitatColors.muted }}>Finding today&apos;s reflection...</Text>
        </View>
      ) : (
        <>
          <Text className="text-base font-semibold leading-6" style={{ color: HabitatColors.text }}>
            “{quoteText}”
          </Text>
          {author && <Text className="mt-2 text-xs" style={{ color: HabitatColors.muted }}>— {author}</Text>}
        </>
      )}
      </View>
    </View>
  );
}