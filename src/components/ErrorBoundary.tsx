import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { rs } from '../utils/responsive';

interface Props {
  children: ReactNode;
  /** Özel hata UI (isteğe bağlı) */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary.
 * Hooks ile kullanılamaz — class component zorunluluğu (React spec).
 *
 * Kullanım:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 * Üretimde: this.componentDidCatch içinde Sentry/Bugsnag çağrısı ekleyin.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (__DEV__) {
      console.error('[ErrorBoundary]', error.message);
      console.error(info.componentStack);
    }
    // TODO: Sentry.captureException(error, { extra: info });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View style={s.container}>
          <Ionicons name="warning-outline" size={rs(64)} color={colors.accent} />
          <Text style={s.title}>Beklenmedik Hata</Text>
          <Text style={s.message}>
            {this.state.error?.message ?? 'Bir sorun oluştu. Lütfen tekrar deneyin.'}
          </Text>
          <TouchableOpacity style={s.btn} onPress={this.handleReset} activeOpacity={0.8}>
            <Text style={s.btnText}>Yeniden Dene</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xxl,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
    marginBottom: spacing.xxl,
  },
  btn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.base,
    borderRadius: rs(12),
  },
  btnText: {
    color: colors.textInverse,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
});
