import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { HabitatColors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        animation: 'none',
        tabBarActiveTintColor: HabitatColors.green,
        tabBarInactiveTintColor: HabitatColors.muted,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 68,
          paddingHorizontal: 2,
          backgroundColor: HabitatColors.surface,
          borderTopWidth: 2,
          borderTopColor: HabitatColors.ink,
          elevation: 0,
        },
        tabBarLabelStyle: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
        tabBarIconStyle: { marginTop: 4 },
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