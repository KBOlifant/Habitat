import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="home"
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        animation: 'none',
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          borderRadius: 24,
          height: 70,
          paddingHorizontal: 10,
          backgroundColor:
            colorScheme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 18,
          elevation: 12,
        },
      }}
    >
      <Tabs.Screen
        name="check-in"
        options={{
          title: 'Check-In',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="checkmark.circle.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="triggers"
        options={{
          title: 'Triggers',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="flame.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="chart.bar.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="check-in-notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="note.text" color={color} />,
        }}
      />
    </Tabs>
  );
}