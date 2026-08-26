import type { TextStyle } from 'react-native';

export const Typography = {
  title: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 30,
    lineHeight: 36,
  } satisfies TextStyle,
  subtitle: {
    fontFamily: 'Fraunces_400Regular',
    fontSize: 16,
    lineHeight: 24,
  } satisfies TextStyle,
  sectionLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 2,
  } satisfies TextStyle,
} as const;