import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DepartmentsScreen from '../screens/DepartmentsScreen';
import DepartmentDetailScreen from '../screens/DepartmentDetailScreen';
import { DepartmentStackParamList } from './types';
import { colors, typography } from '../theme';

const Stack = createNativeStackNavigator<DepartmentStackParamList>();

const SHARED_HEADER = {
  headerShown: true,
  headerTintColor: colors.primary,
  headerStyle: { backgroundColor: colors.headerBg },
  headerTitleStyle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  headerBackTitle: 'Bölümler',
  headerBackTitleVisible: true,
  headerShadowVisible: false,
  animation: 'slide_from_right' as const,
} as const;

export default function DepartmentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="DepartmentsMain"
        component={DepartmentsScreen}
        options={{ title: 'Bölümler' }}
      />
      <Stack.Screen
        name="DepartmentDetail"
        component={DepartmentDetailScreen}
        options={{ ...SHARED_HEADER, headerTitle: 'Fakülte Detayı' }}
      />
    </Stack.Navigator>
  );
}
