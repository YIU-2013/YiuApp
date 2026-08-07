import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AnnouncementDetailScreen from '../screens/AnnouncementDetailScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import { HomeStackParamList } from './types';
import { colors, typography } from '../theme';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const SHARED_HEADER = {
  headerShown: true,
  headerTintColor: colors.primary,
  headerStyle: { backgroundColor: colors.headerBg },
  headerTitleStyle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  headerBackTitle: 'Geri',
  headerBackTitleVisible: true,
  headerShadowVisible: false,
  animation: 'slide_from_right' as const,
} as const;

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Ana Sayfa' }}
      />
      <Stack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetailScreen}
        options={{ ...SHARED_HEADER, headerTitle: 'Duyuru Detayı' }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ ...SHARED_HEADER, headerTitle: 'Etkinlik Detayı' }}
      />
    </Stack.Navigator>
  );
}
