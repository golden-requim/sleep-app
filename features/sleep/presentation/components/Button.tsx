// Button Component — "Kanso" (簡素) — simplicity in interaction
// Every button feels like a gentle nod, never a shout

import React, { useCallback } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  AccessibilityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { colors, typography, borderRadius, layout, spacing } from '../../../shared/theme/tokens';
import { animations, duration } from '../../../shared/theme/animation';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends AccessibilityProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  ...accessibilityProps
}) => {
  const pressed = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    pressed.value = withTiming(1, {
      duration: animations.button.duration,
      easing: animations.button.easing,
    });
  }, []);

  const handlePressOut = useCallback(() => {
    pressed.value = withTiming(0, {
      duration: animations.button.duration,
      easing: animations.button.easing,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressed.value, [0, 1], [1, animations.button.scale]);
    return {
      transform: [{ scale }],
    };
  });

  const containerStyles: ViewStyle[] = [
    styles.base,
    styles[`${variant}Container`],
    styles[`${size}Container`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ].filter(Boolean) as ViewStyle[];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ].filter(Boolean) as TextStyle[];

  return (
    <AnimatedPressable
      style={[containerStyles, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={accessibilityProps.accessibilityLabel || title}
      {...accessibilityProps}
    >
      {loading ? (
        <Text style={textStyles}>...</Text>
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },

  // Container variants
  primaryContainer: {
    backgroundColor: colors.accent.primary,
  },
  secondaryContainer: {
    backgroundColor: colors.background.tertiary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border.medium,
  },

  // Size containers
  smallContainer: {
    height: layout.buttonHeight.small,
    paddingHorizontal: spacing[4],
  },
  mediumContainer: {
    height: layout.buttonHeight.medium,
    paddingHorizontal: spacing[6],
  },
  largeContainer: {
    height: layout.buttonHeight.large,
    paddingHorizontal: spacing[8],
  },

  fullWidth: {
    width: '100%',
  },

  disabled: {
    opacity: 0.5,
  },

  // Text base
  text: {
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.tracking.wide,
  },

  // Text variants
  primaryText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.labelLarge,
  },
  secondaryText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.labelLarge,
  },
  ghostText: {
    color: colors.accent.primary,
    fontSize: typography.fontSize.labelLarge,
  },
  outlineText: {
    color: colors.accent.primary,
    fontSize: typography.fontSize.labelLarge,
  },

  // Text sizes
  smallText: {
    fontSize: typography.fontSize.labelMedium,
  },
  mediumText: {
    fontSize: typography.fontSize.labelLarge,
  },
  largeText: {
    fontSize: typography.fontSize.titleSmall,
  },

  disabledText: {
    color: colors.text.tertiary,
  },
});
