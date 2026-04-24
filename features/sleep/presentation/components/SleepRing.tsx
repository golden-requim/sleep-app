// SleepRing Component — "Enso" (円相) — the circle of completeness
// The central element of the home screen — a breathing ring representing sleep quality

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography, spacing } from '../../../shared/theme/tokens';
import { sleepAnimations } from '../../../shared/theme/animation';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface SleepRingProps {
  sleepDuration?: number;      // Hours slept last night
  targetDuration?: number;     // Target hours (default 8)
  streak?: number;            // Days in a row
  isActive?: boolean;         // If currently tracking sleep
  size?: number;
}

export const SleepRing: React.FC<SleepRingProps> = ({
  sleepDuration = 0,
  targetDuration = 8,
  streak = 0,
  isActive = false,
  size = 280,
}) => {
  const progress = Math.min(sleepDuration / targetDuration, 1);
  const circumference = 2 * Math.PI * ((size - 20) / 2);
  const strokeDashoffset = circumference * (1 - progress);

  const breathingAnim = useSharedValue(1);
  const [isReduceMotion, setIsReduceMotion] = React.useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setIsReduceMotion);
  }, []);

  useEffect(() => {
    if (isActive) {
      // Idle breathing while tracking
      breathingAnim.value = withRepeat(
        withTiming(sleepAnimations.ringBreathing.scaleRange[1], {
          duration: sleepAnimations.ringBreathing.duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );
    } else {
      cancelAnimation(breathingAnim);
      breathingAnim.value = withTiming(1, { duration: 300 });
    }

    return () => cancelAnimation(breathingAnim);
  }, [isActive]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathingAnim.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.container, { width: size, height: size }, animatedContainerStyle]}>
        {/* Background ring */}
        <Svg width={size} height={size} style={styles.svg}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={(size - 20) / 2}
            stroke={colors.border.subtle}
            strokeWidth={12}
            fill="none"
          />
          {/* Progress ring */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={(size - 20) / 2}
            stroke={colors.accent.primary}
            strokeWidth={12}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        {/* Center content */}
        <View style={styles.centerContent}>
          {isActive ? (
            <>
              <Text style={styles.trackingLabel}>Tracking</Text>
              <Text style={styles.trackingSubtext}>Sleeping...</Text>
            </>
          ) : (
            <>
              <Text style={styles.duration}>
                {sleepDuration > 0 ? `${sleepDuration.toFixed(1)}h` : '--'}
              </Text>
              <Text style={styles.label}>
                {sleepDuration > 0 ? 'slept' : 'last night'}
              </Text>
            </>
          )}
        </View>
      </Animated.View>

      {/* Streak dots — subtle minimalist indicator */}
      {!isActive && (
        <View style={styles.streakContainer}>
          {Array.from({ length: 7 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.streakDot,
                i < streak % 7 && styles.streakDotFilled,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  duration: {
    fontSize: typography.fontSize.displaySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wide,
  },
  label: {
    fontSize: typography.fontSize.labelMedium,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    letterSpacing: typography.tracking.wider,
    marginTop: spacing[1],
  },
  trackingLabel: {
    fontSize: typography.fontSize.titleMedium,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.primary,
    letterSpacing: typography.tracking.wide,
  },
  trackingSubtext: {
    fontSize: typography.fontSize.labelMedium,
    color: colors.text.secondary,
    letterSpacing: typography.tracking.wider,
    marginTop: spacing[1],
  },
  streakContainer: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[6],
  },
  streakDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border.subtle,
  },
  streakDotFilled: {
    backgroundColor: colors.accent.primary,
  },
});
