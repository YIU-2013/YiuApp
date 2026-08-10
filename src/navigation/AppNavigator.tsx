import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import DepartmentStack from './DepartmentStack';
import CampusScreen from '../screens/CampusScreen';
import OpportunitiesScreen from '../screens/OpportunitiesScreen';
import ContactScreen from '../screens/ContactScreen';
import BottomTabBar from '../components/BottomTabBar';
import { RootTabParamList } from './types';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: true,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Campus" component={CampusScreen} options={{ headerShown: false }} />
      <Tab.Screen
        name="Departments"
        component={DepartmentStack}
        options={{ title: 'Bölümler', headerShown: false }}
      />
      <Tab.Screen name="Opportunities" component={OpportunitiesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.headerBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.tight,
  },
});
