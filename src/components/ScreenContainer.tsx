import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  /** Ekran içeriği */
  children: React.ReactNode;
  /** Arka plan rengi — varsayılan: #F7F8FA */
  backgroundColor?: string;
  /**
   * Hangi kenarlarda safe area koruması uygulanacak.
   *
   * - Kendi özel header'ı olan ekranlar (HomeScreen): ['top']
   * - Navigasyon header'ı kullanan ekranlar: []  (navigasyon zaten yönetir)
   * - Varsayılan: ['top', 'bottom']
   */
  edges?: Edge[];
  /** Ek stil */
  style?: ViewStyle;
}

/**
 * Uygulama genelinde kullanılan güvenli alan konteyner bileşeni.
 * iOS notch / Dynamic Island ve Android status bar yüksekliğini
 * otomatik olarak hesaba katar.
 */
export default function ScreenContainer({
  children,
  backgroundColor = '#F7F8FA',
  edges = ['top', 'bottom'],
  style,
}: ScreenContainerProps) {
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
