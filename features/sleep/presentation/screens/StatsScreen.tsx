// Stats Screen — "Kanso" (観察) — observation without judgment
// Clean data, generous space, quiet pride in progress

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSleepStore } from '../store/sleepStore';
import { colors, typography, spacing, layout, borderRadius } from '../../../shared/theme/tokens';
import { duration, stagger } from '../../../shared/theme/animation';

export const StatsScreen: React.FC = () => {
  const { sessions, stats } = useSleepStore();

  // Last 7 days
  const last7Days = sessions.slice(0, 7);
  
  // Calculate bar heights
  const maxDuration = Math.max(...last7Days.map(s => s.duration || 0), 480); // 8 hours = 480 min

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(duration.slow)}>
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>Your sleep journey</Text>
        </Animated.View>

        {/* Summary cards */}
        <View style={styles.summaryGrid}>
          <Animated.View
            entering={FadeInDown.delay(100).duration(duration.normal)}
            style={styles.summaryCard}
          >
            <Text style={styles.summaryValue}>
              {stats.totalNights}
            </Text>
            <Text style={styles.summaryLabel}>Nights</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(150).duration(duration.normal)}
            style={styles.summaryCard}
          >
            <Text style={styles.summaryValue}>
              {(stats.averageDuration / 60).toFixed(1)}h
            </Text>
            <Text style={styles.summaryLabel}>Average</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(duration.normal)}
            style={styles.summaryCard}
          >
            <Text style={styles.summaryValue}>
              {stats.currentStreak}
            </Text>
            <Text style={styles.summaryLabel}>Streak</Text>
          </Animated.View>
        </View>

        {/* Bar chart — last 7 days */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(duration.normal)}
          style={styles.chartSection}
        >
          <Text style={styles.sectionTitle}>Last 7 Days</Text>
          
          <View style={styles.chart}>
            {last7Days.length === 0 ? (
              <Text style={styles.emptyChart}>
                No sleep data yet
              </Text>
            ) : (
              last7Days.map((session, index) => {
                const height = session.duration 
                  ? Math.max((session.duration / maxDuration) * 120, 8)
                  : 4;
                const date = new Date(session.startTime);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                return (
                  <View key={session.id || index} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      <View
                        style={[
                          styles.bar,
                          { height },
                          !session.duration && styles.barEmpty,
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{dayName}</Text>
                  </View>
                );
              })
            )}
          </View>
        </Animated.View>

        {/* Best streak */}
        {stats.bestStreak > 0 && (
          <Animated.View
            entering={FadeInDown.delay(400).duration(duration.normal)}
            style={styles.insightCard}
          >
            <Text style={styles.insightLabel}>Best streak</Text>
            <Text style={styles.insightValue}>{stats.bestStreak} nights</Text>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing[8],
    paddingBottom: spacing[12],
  },
  title: {
    fontSize: typography.fontSize.headlineMedium,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wide,
  },
  subtitle: {
    fontSize: typography.fontSize.bodyMedium,
    color: colors.text.tertiary,
    letterSpacing: typography.tracking.wide,
    marginTop: spacing[1],
    marginBottom: spacing[8],
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[8],
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: typography.fontSize.headlineMedium,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.primary,
    letterSpacing: typography.tracking.wide,
  },
  summaryLabel: {
    fontSize: typography.fontSize.labelSmall,
    color: colors.text.tertiary,
    letterSpacing: typography.tracking.wide,
    marginTop: spacing[1],
    textTransform: 'uppercase',
  },
  chartSection: {
    marginBottom: spacing[8],
  },
  sectionTitle: {
    fontSize: typography.fontSize.titleSmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wide,
    marginBottom: spacing[5],
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing[4],
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.sm,
    minHeight: 8,
  },
  barEmpty: {
    backgroundColor: colors.border.subtle,
  },
  barLabel: {
    fontSize: typography.fontSize.labelSmall,
    color: colors.text.tertiary,
    marginTop: spacing[2],
    letterSpacing: typography.tracking.wide,
  },
  emptyChart: {
    flex: 1,
    textAlign: 'center',
    color: colors.text.tertiary,
    fontSize: typography.fontSize.bodyMedium,
    letterSpacing: typography.tracking.wide,
  },
  insightCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing[5],
  },
  insightLabel: {
    fontSize: typography.fontSize.labelSmall,
    color: colors.text.tertiary,
    letterSpacing: typography.tracking.wide,
    textTransform: 'uppercase',
    marginBottom: spacing[2],
  },
  insightValue: {
    fontSize: typography.fontSize.titleMedium,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.primary,
    letterSpacing: typography.tracking.wide,
  },
});
