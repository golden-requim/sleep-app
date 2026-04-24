// Home Screen — "Oyasumi" (おやすみ) — the gentle goodbye
// The main view — centered, breathing, calm

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SleepRing, Button } from '../components';
import { useSleepStore } from '../store/sleepStore';
import { colors, typography, spacing, layout } from '../../../shared/theme/tokens';
import { duration } from '../../../shared/theme/animation';

interface HomeScreenProps {
  onStartTracking: () => void;
  onViewStats: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartTracking,
  onViewStats,
}) => {
  const { stats, sessions, isTracking } = useSleepStore();
  
  // Get last night's sleep
  const lastNight = sessions[0];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(duration.slow)}
        style={styles.content}
      >
        {/* Greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Oyasumi</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Central ring */}
        <View style={styles.ringContainer}>
          <SleepRing
            sleepDuration={lastNight?.duration ? lastNight.duration / 60 : 0}
            targetDuration={8}
            streak={stats.currentStreak}
            isActive={isTracking}
            size={280}
          />
        </View>

        {/* Action */}
        <View style={styles.actionContainer}>
          {!isTracking ? (
            <Button
              title="Start Sleep"
              onPress={onStartTracking}
              variant="primary"
              size="large"
            />
          ) : (
            <Button
              title="I'm Awake"
              onPress={onStartTracking}
              variant="outline"
              size="large"
            />
          )}
        </View>

        {/* Quick nav */}
        <View style={styles.quickNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={onViewStats}
            accessibilityRole="button"
            accessibilityLabel="View statistics"
          >
            <Text style={styles.navLabel}>Statistics</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing[8],
  },
  greeting: {
    fontSize: typography.fontSize.titleLarge,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wider,
  },
  date: {
    fontSize: typography.fontSize.labelMedium,
    color: colors.text.tertiary,
    letterSpacing: typography.tracking.wide,
    marginTop: spacing[1],
  },
  ringContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContainer: {
    paddingBottom: spacing[8],
    alignItems: 'center',
  },
  quickNav: {
    paddingBottom: spacing[8],
    alignItems: 'center',
  },
  navItem: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
  },
  navLabel: {
    fontSize: typography.fontSize.labelLarge,
    color: colors.accent.primary,
    letterSpacing: typography.tracking.wide,
  },
});
