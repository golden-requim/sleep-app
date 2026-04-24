// Input Component — "Shizuka" (静か) — quiet and focused
// Input fields that ask without demanding attention

import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors, typography, borderRadius, layout, spacing } from '../../../shared/theme/tokens';
import { animations, duration } from '../../../shared/theme/animation';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  hint?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  hint,
  error,
  containerStyle,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useSharedValue(0);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    focusAnim.value = withTiming(1, {
      duration: animations.inputFocus.duration,
      easing: animations.inputFocus.easing,
    });
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    focusAnim.value = withTiming(0, {
      duration: animations.inputFocus.duration,
      easing: animations.inputFocus.easing,
    });
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      borderWidth: withTiming(isFocused ? animations.inputFocus.borderWidth : 1, {
        duration: animations.inputFocus.duration,
        easing: animations.inputFocus.easing,
      }),
      borderColor: error
        ? colors.error
        : isFocused
        ? colors.accent.primary
        : colors.border.subtle,
    };
  });

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.text.tertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...textInputProps}
        />
      </Animated.View>

      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: typography.fontSize.labelMedium,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    marginBottom: spacing[2],
    letterSpacing: typography.tracking.wide,
  },
  container: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  input: {
    height: layout.inputHeight,
    paddingHorizontal: spacing[4],
    fontSize: typography.fontSize.bodyLarge,
    color: colors.text.primary,
    letterSpacing: typography.tracking.normal,
  },
  hint: {
    fontSize: typography.fontSize.labelSmall,
    color: colors.text.tertiary,
    marginTop: spacing[1],
    letterSpacing: typography.tracking.wide,
  },
  error: {
    fontSize: typography.fontSize.labelSmall,
    color: colors.error,
    marginTop: spacing[1],
    letterSpacing: typography.tracking.wide,
  },
});
