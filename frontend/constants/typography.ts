import type { TextStyle } from 'react-native';

export const Typography = {
  title: {
    fontSize: 32,
    lineHeight: 35,
    fontWeight: '900',
    letterSpacing: -0.8,
  } satisfies TextStyle,
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  } satisfies TextStyle,
  sectionLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 2,
  } satisfies TextStyle,
} as const;