import { Platform } from 'react-native';

export type DailyQuote = {
  quote: string;
  author: string | null;
};

type QuoteResponse = {
  q?: unknown;
  a?: unknown;
};

export async function getDailyQuote(signal: AbortSignal): Promise<DailyQuote | null> {
  // ZenQuotes does not return CORS headers, so web uses the local reflection fallback.
  if (Platform.OS === 'web') return null;

  const response = await fetch('https://zenquotes.io/api/today', { signal });
  if (!response.ok) throw new Error(`ZenQuotes request failed: ${response.status}`);

  const data: unknown = await response.json();
  const result = Array.isArray(data) ? (data[0] as QuoteResponse | undefined) : undefined;
  const quote = typeof result?.q === 'string' ? result.q.trim() : '';
  const author = typeof result?.a === 'string' ? result.a.trim() : '';
  return quote ? { quote, author: author || null } : null;
}
