// Tracking Screen — "Nemuri" (眠り) — the state of sleep
// Dark, empty, focused — the meditation of bedtime

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  AccessibilityInfo,
} from 'react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Pulse, Button } from '../components';
import { useSleepStore } from '../store/sleepStore';
import { colors, typography, spacing, layout } from '../../../shared/theme/tokens';
import { duration, sleepAnimations } from '../../../shared/theme/animation';

interface TrackingScreenProps {
  onComplete: (quality?: 'light' | 'medium' | 'deep') => void;
  onCancel: () => void;
}

export const TrackingScreen: React.FC<TrackingScreenProps> = ({
  onComplete,
  onCancel,
}) => {
  const { currentSession, isTracking } = useSleepStore();
  const [elapsed, setElapsed] = useState(0);

  // Background darkness animation
  const backgroundOpacity = useSharedValue(1);

  useEffect(() => {
    backgroundOpacity.value = withTiming(0, {
      duration: sleepAnimations.backgroundDarken.duration,
    });
  }, []);

  // Timer
  useEffect(() => {
    if (!currentSession?.startTime) return;

    const interval = setInterval(() => {
      const elapsedMs = Date.now() - currentSession.startTime;
      setElapsed(Math.floor(elapsedMs / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession?.startTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWakeUp = () => {
    // Determine quality based on duration
    let quality: 'light' | 'medium' | 'deep' = 'medium';
    if (elapsed < 3600) quality = 'light';
    else if (elapsed >= 7 * 3600) quality = 'deep';
    
    onComplete(quality);
  };

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(15, 20, 19, ${backgroundOpacity.value})`,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.background, animatedBackgroundStyle]}>
        <Animated.View
          entering={FadeIn.duration(duration.slower)}
          style={styles.content}
        >
          {/* Minimal timer */}
          <View style={styles.timerContainer}>
            <Text style={styles.timer} accessibilityLabel={`${Math.floor(elapsed / 3600)} hours, ${Math.floor((elapsed % 3600) / 60)} minutes sleeping`}>
              {formatTime(elapsed)}
            </Text>
          </View>

          {/* Central pulse */}
          <View style={styles.pulseContainer}>
            <Pulse
              size={280}
              color={colors.accent.primary}
              isActive={true}
              accessibilityLabel="Sleep timer active"
            />
          </View>

          {/* Subtle status text */}
          <Text style={styles.status}>
            Breathe slowly...
          </Text>

          {/* Wake up button — outline style, not demanding */}
          <View style={styles.buttonContainer}>
            <Button
              title="Wake Up"
              onPress={handleWakeUp}
              variant="outline"
              size="large"
              accessibilityHint="Ends sleep tracking and records your sleep"
            />
          </View>

          {/* Cancel — small, unobtrusive */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel and discard this sleep session"
          >
            <Text style={styles.cancelText}>Discard</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
  },
  timerContainer: {
    marginBottom: spacing[12],
  },
  timer: {
    fontSize: typography.fontSize.displayMedium,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wide,
    fontVariant: ['tabular-nums'],
  },
  pulseContainer: {
    marginBottom: spacing[12],
  },
  status: {
    fontSize: typography.fontSize.bodyMedium,
    color: colors.text.tertiary,
    letterSpacing: typography.tracking.widest,
    marginBottom: spacing[12],
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    marginTop: spacing[8],
    paddingVertical: spacing[4],
  },
  cancelText: {
    fontSize: typography.fontSize.labelMedium,
    color: colors.text.tertiary,
    letterSpacing: typography.tracking.wide,
  },
});
