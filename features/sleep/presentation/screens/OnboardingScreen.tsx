// Onboarding Screen — "Hajimari" (始まり) — the quiet beginning
// A single breath before sleep

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Button, Input } from '../components';
import { colors, typography, spacing, layout } from '../../../shared/theme/tokens';
import { animations, duration } from '../../../shared/theme/animation';

interface OnboardingScreenProps {
  onComplete: () => void;
  onLogin?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const [name, setName] = useState('');
  const [step, setStep] = useState<'welcome' | 'name' | 'goal'>('welcome');
  const [goal, setGoal] = useState<'better' | 'track' | 'routine'>();

  const handleWelcome = () => setStep('name');
  
  const handleNameSubmit = () => {
    if (name.trim()) {
      setStep('goal');
    }
  };

  const handleGoalSelect = (selectedGoal: 'better' | 'track' | 'routine') => {
    setGoal(selectedGoal);
    setTimeout(onComplete, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.centerContent}>
          {step === 'welcome' && (
            <Animated.View
              key="welcome"
              entering={FadeIn.duration(duration.slow)}
              exiting={FadeOut.duration(duration.fast)}
              style={styles.stepContent}
            >
              {/* Minimal logo — a simple moon */}
              <View style={styles.logo}>
                <Text style={styles.logoText}>🌙</Text>
              </View>

              <Text style={styles.title}>Nemuri</Text>
              <Text style={styles.subtitle}>Your quiet sleep companion</Text>

              <View style={styles.spacer} />

              <Button
                title="Begin"
                onPress={handleWelcome}
                variant="primary"
                size="large"
              />
            </Animated.View>
          )}

          {step === 'name' && (
            <Animated.View
              key="name"
              entering={FadeIn.duration(duration.slow)}
              exiting={FadeOut.duration(duration.fast)}
              style={styles.stepContent}
            >
              <Text style={styles.question}>What should we call you?</Text>
              
              <View style={styles.inputContainer}>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  autoCapitalize="words"
                  onSubmitEditing={handleNameSubmit}
                  returnKeyType="done"
                />
              </View>

              <Button
                title="Continue"
                onPress={handleNameSubmit}
                variant="primary"
                size="large"
                disabled={!name.trim()}
              />
            </Animated.View>
          )}

          {step === 'goal' && (
            <Animated.View
              key="goal"
              entering={FadeIn.duration(duration.slow)}
              exiting={FadeOut.duration(duration.fast)}
              style={styles.stepContent}
            >
              <Text style={styles.question}>What brings you here?</Text>

              <View style={styles.goalContainer}>
                <Button
                  title="Sleep better"
                  onPress={() => handleGoalSelect('better')}
                  variant="outline"
                  size="large"
                  fullWidth
                />
                <Button
                  title="Track patterns"
                  onPress={() => handleGoalSelect('track')}
                  variant="outline"
                  size="large"
                  fullWidth
                />
                <Button
                  title="Build a routine"
                  onPress={() => handleGoalSelect('routine')}
                  variant="outline"
                  size="large"
                  fullWidth
                />
              </View>
            </Animated.View>
          )}
        </View>

        {/* Minimal dots — no distracting progress bar */}
        <View style={styles.dots}>
          <View style={[styles.dot, step === 'welcome' && styles.dotActive]} />
          <View style={[styles.dot, step === 'name' && styles.dotActive]} />
          <View style={[styles.dot, step === 'goal' && styles.dotActive]} />
        </View>
      </KeyboardAvoidingView>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    marginBottom: spacing[8],
  },
  logoText: {
    fontSize: 64,
    opacity: 0.9,
  },
  title: {
    fontSize: typography.fontSize.headlineLarge,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wider,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.bodyLarge,
    color: colors.text.secondary,
    letterSpacing: typography.tracking.wide,
  },
  spacer: {
    height: spacing[16],
  },
  question: {
    fontSize: typography.fontSize.titleLarge,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wide,
    textAlign: 'center',
    marginBottom: spacing[10],
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing[8],
  },
  goalContainer: {
    width: '100%',
    gap: spacing[3],
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    paddingBottom: spacing[8],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border.subtle,
  },
  dotActive: {
    backgroundColor: colors.accent.primary,
  },
});
