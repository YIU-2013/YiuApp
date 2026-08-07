import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  /** Arka plan rengi. Safe area bölgelerine de uygulanır. */
  backgroundColor?: string;
  /**
   * Üst safe area (status bar / notch / Dynamic Island) padding'i.
   * - false (varsayılan): React Navigation header zaten yönetiyor
   * - true: Ekranda custom header var; header bileşeni kendi paddingTop'unu yönetir,
   *         bu container yalnızca doğru background rengini sağlar
   */
  applyTopInset?: boolean;
  /**
   * Alt safe area (home indicator / gesture bar) padding'i.
   * - false (varsayılan): React Navigation tab bar zaten yönetiyor
   * - true: Tab bar olmayan tam ekran modal/sheet yapılar için
   */
  applyBottomInset?: boolean;
  style?: ViewStyle;
}

/**
 * Production-grade ekran sarmalayıcı.
 *
 * Kullanım senaryoları:
 *   - Navigasyon header'lı tab ekranları → <ScreenWrapper> (varsayılan)
 *   - Custom header'lı ekranlar (HomeScreen) → <ScreenWrapper applyTopInset backgroundColor="#FFF">
 *   - Tab bar'sız tam ekran modal → <ScreenWrapper applyTopInset applyBottomInset>
 */
export default function ScreenWrapper({
  children,
  backgroundColor = '#F7F8FA',
  applyTopInset = false,
  applyBottomInset = false,
  style,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor,
          // applyTopInset=false olsa bile backgroundColor safe area'yı dolduruyor;
          // Header bileşeni useSafeAreaInsets().top ile kendi paddingTop'unu uygular
          paddingTop: applyTopInset ? insets.top : 0,
          paddingBottom: applyBottomInset ? insets.bottom : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
