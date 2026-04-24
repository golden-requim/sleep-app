// App.tsx — "Shizuka" (静か) — quiet, peaceful
// The entry point — a single breath before sleep begins

import React, { useState } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  OnboardingScreen,
  HomeScreen,
  TrackingScreen,
  StatsScreen,
} from './features/sleep/presentation/screens';
import { useSleepStore } from './features/sleep/presentation/store/sleepStore';
import { colors } from './shared/theme/tokens';

type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Tracking: undefined;
  Stats: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { startSleep, endSleep, cancelSleep, isTracking } = useSleepStore();

  const handleStartTracking = () => {
    // Toggle between starting and ending sleep
    if (isTracking) {
      endSleep();
    } else {
      startSleep();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: colors.accent.primary,
            background: colors.background.primary,
            card: colors.background.secondary,
            text: colors.text.primary,
            border: colors.border.subtle,
            notification: colors.accent.primary,
          },
          fonts: {
            regular: {
              fontFamily: 'System',
              fontWeight: '400',
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500',
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '700',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900',
            },
          },
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 500,
            contentStyle: { backgroundColor: colors.background.primary },
          }}
        >
          {!hasCompletedOnboarding ? (
            <Stack.Screen name="Onboarding">
              {() => (
                <OnboardingScreen
                  onComplete={() => setHasCompletedOnboarding(true)}
                />
              )}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Home">
                {({ navigation }) => (
                  <HomeScreen
                    onStartTracking={handleStartTracking}
                    onViewStats={() => navigation.navigate('Stats')}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen
                name="Tracking"
                options={{
                  animation: 'fade',
                  gestureEnabled: false,
                }}
              >
                {({ navigation }) => (
                  <TrackingScreen
                    onComplete={(quality) => {
                      endSleep(quality);
                      navigation.goBack();
                    }}
                    onCancel={() => {
                      cancelSleep();
                      navigation.goBack();
                    }}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen
                name="Stats"
                options={{
                  animation: 'slide_from_right',
                }}
              >
                {() => <StatsScreen />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});
