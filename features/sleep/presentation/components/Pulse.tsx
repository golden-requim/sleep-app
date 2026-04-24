// Pulse Component — "Ikigai" (生き甲斐) — the gentle rhythm of being alive
// Ambient breathing animation that represents the sleeping state

import React, { useEffect } from 'react';
import { View, StyleSheet, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { colors } from '../../../shared/theme/tokens';
import { sleepAnimations, duration } from '../../../shared/theme/animation';

interface PulseProps {
  size?: number;
  color?: string;
  isActive?: boolean; // Set to false to stop animation
  accessibilityLabel?: string;
}

export const Pulse: React.FC<PulseProps> = ({
  size = 280,
  color = colors.accent.primary,
  isActive = true,
  accessibilityLabel = 'Sleep timer active',
}) => {
  const scale = useSharedValue(sleepAnimations.ringBreathing.scaleRange[0]);
  const opacity = useSharedValue(sleepAnimations.ringBreathing.opacityRange[0]);
  const [isReduceMotion, setIsReduceMotion] = React.useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setIsReduceMotion);
  }, []);

  useEffect(() => {
    if (!isActive) {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      return;
    }

    if (isReduceMotion) {
      // Instant states for reduce motion — no animation
      scale.value = sleepAnimations.ringBreathing.scaleRange[0];
      opacity.value = sleepAnimations.ringBreathing.opacityRange[0];
      return;
    }

    // Breathing loop — slow, natural, like sleeping breath
    const timingConfig = {
      duration: sleepAnimations.ringBreathing.duration,
      easing: Easing.inOut(Easing.sin),
    };

    scale.value = withRepeat(
      withTiming(sleepAnimations.ringBreathing.scaleRange[1], timingConfig),
      -1, // infinite
      true // reverse
    );

    opacity.value = withRepeat(
      withTiming(sleepAnimations.ringBreathing.opacityRange[1], timingConfig),
      -1,
      true
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [isActive, isReduceMotion]);

  const animatedOuterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value * 0.4,
  }));

  const animatedMiddleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 0.85 }],
    opacity: opacity.value * 0.6,
  }));

  const animatedInnerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 0.7 }],
    opacity: opacity.value * 0.8,
  }));

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityLiveRegion="polite"
    >
      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.ring,
          styles.outerRing,
          { width: size, height: size, borderColor: color },
          animatedOuterStyle,
        ]}
      />

      {/* Middle ring */}
      <Animated.View
        style={[
          styles.ring,
          styles.middleRing,
          { width: size * 0.8, height: size * 0.8, borderColor: color },
          animatedMiddleStyle,
        ]}
      />

      {/* Inner core */}
      <Animated.View
        style={[
          styles.ring,
          styles.innerRing,
          { width: size * 0.6, height: size * 0.6, borderColor: color },
          animatedInnerStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1.5,
  },
  outerRing: {
    // Outermost glow
  },
  middleRing: {
    // Middle ring
  },
  innerRing: {
    // Inner core
  },
});
