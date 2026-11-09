import { Tabs } from 'expo-router/js-tabs';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { ChartColumn, CircleCheck, Flame, House, NotebookPen } from 'lucide-react-native';
import { HabitatColors } from '@/constants/theme';

export const unstable_settings = { anchor: 'home' };

function LandscapeTabBar({ state, descriptors, emitter, navigateToTab }: BottomTabBarProps) {
  const { height } = useWindowDimensions();
  const itemHeight = Math.min(98, (height - 16) / state.routes.length);

  return (
    <View
      style={{
        width: 96,
        height: '100%',
        paddingTop: 16,
        backgroundColor: HabitatColors.canvas,
        borderRightWidth: 1,
        borderRightColor: HabitatColors.border,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const color = focused
          ? HabitatColors.onHighlight
          : (options.tabBarInactiveTintColor ?? HabitatColors.muted);
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : (options.title ?? route.name);

        const onPress = () => {
          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        };

        return (
          <HapticTab
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? `${label}, tab`}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={() =>
              emitter.emit({ type: 'tabLongPress', target: route.key })
            }
            style={{
              width: 80,
              alignSelf: 'center',
              borderRadius: 20,
              height: itemHeight,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: focused
                ? HabitatColors.highlight
                : 'transparent',
            }}
          >
            <View style={{ alignItems: 'center', gap: 6 }}>
              {options.tabBarIcon?.({ focused, color, size: 26 })}
              <Text
                numberOfLines={1}
                style={{
                  color,
                  fontSize: 11,
                  fontWeight: '600',
                }}
              >
                {label}
              </Text>
            </View>
          </HapticTab>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <Tabs
      backBehavior="history"
      tabBar={isLandscape ? (props) => <LandscapeTabBar {...props} /> : undefined}
      screenOptions={{
        headerShown: false,
        animation: 'none',
        tabBarPosition: isLandscape ? 'left' : 'bottom',
        tabBarActiveTintColor: HabitatColors.accent,
        tabBarInactiveTintColor: HabitatColors.muted,
        tabBarButton: HapticTab,
        tabBarStyle: {
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: 16,
              height: 70,
              paddingBottom: 0,
              borderRadius: 24,
              paddingHorizontal: 6,
              backgroundColor: HabitatColors.surface,
              borderWidth: 1,
              borderTopWidth: 1,
              borderColor: HabitatColors.border,
              borderTopColor: HabitatColors.border,
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 18,
              elevation: 12,
            },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIconStyle: { marginTop: 4 },
      }}
    >
      <Tabs.Screen
        name="check-in"
        options={{
          title: 'Check-In',
          tabBarIcon: ({ color }) => (
            <CircleCheck size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="triggers"
        options={{
          title: 'Triggers',
          tabBarIcon: ({ color }) => <Flame size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <House size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <ChartColumn size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="check-in-notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color }) => <NotebookPen size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}