import React, { useRef } from 'react';
import { Animated, Pressable, Platform, StyleProp, ViewStyle, PressableProps } from 'react-native';

interface TouchableScaleProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Premium Touchable component with scale animation, iOS opacity feedback, and Android ripple.
 */
export default function TouchableScale({
  children,
  style,
  containerStyle,
  ...props
}: TouchableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (event: any) => {
    Animated.timing(scale, {
      toValue: 0.98,
      duration: 120,
      useNativeDriver: true,
    }).start();
    if (props.onPressIn) props.onPressIn(event);
  };

  const handlePressOut = (event: any) => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
    if (props.onPressOut) props.onPressOut(event);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      android_ripple={{ color: 'rgba(11, 46, 107, 0.06)', borderless: false }}
      style={({ pressed }) => [
        style,
        Platform.OS === 'ios' && pressed && { opacity: 0.85 },
      ]}
      {...props}
    >
      <Animated.View style={[{ transform: [{ scale }] }, containerStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
