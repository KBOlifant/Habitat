import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { HabitatColors } from '@/constants/theme';

function LandscapeTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { height } = useWindowDimensions();
  const itemHeight = Math.min(98, (height - 16) / state.routes.length);

  return (
    <View
      style={{
        width: 96,
        height: '100%',
        paddingTop: 16,
        backgroundColor: HabitatColors.canvas,
        borderRightWidth: 2,
        borderRightColor: HabitatColors.ink,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const color = focused
          ? (options.tabBarActiveTintColor ?? HabitatColors.green)
          : (options.tabBarInactiveTintColor ?? HabitatColors.muted);
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : (options.title ?? route.name);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
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
              navigation.emit({ type: 'tabLongPress', target: route.key })
            }
            style={{
              width: '100%',
              height: itemHeight,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: focused
                ? (options.tabBarActiveBackgroundColor ?? HabitatColors.lime)
                : 'transparent',
            }}
          >
            <View style={{ alignItems: 'center', gap: 6 }}>
              {options.tabBarIcon?.({ focused, color, size: 26 })}
              <Text
                numberOfLines={1}
                style={{
                  color,
                  fontSize: 9,
                  fontWeight: '900',
                  textTransform: 'uppercase',
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
      initialRouteName="home"
      backBehavior="history"
      tabBar={isLandscape ? (props) => <LandscapeTabBar {...props} /> : undefined}
      screenOptions={{
        headerShown: false,
        animation: 'none',
        tabBarPosition: isLandscape ? 'left' : 'bottom',
        tabBarActiveTintColor: HabitatColors.green,
        tabBarInactiveTintColor: HabitatColors.muted,
        tabBarActiveBackgroundColor: HabitatColors.lime,
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
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '900',
          textTransform: 'uppercase',
        },
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