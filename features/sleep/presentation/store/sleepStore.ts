// Sleep Store — "Nemuri" (眠) — the state of sleep
// Central state management using Zustand

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SleepSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number; // in minutes
  quality?: 'light' | 'medium' | 'deep';
  notes?: string;
}

export interface SleepStats {
  averageDuration: number;
  averageQuality: number;
  totalNights: number;
  currentStreak: number;
  bestStreak: number;
}

interface SleepState {
  // Current session
  currentSession: SleepSession | null;
  isTracking: boolean;

  // Historical data
  sessions: SleepSession[];
  stats: SleepStats;

  // Settings
  targetSleepHours: number;
  reminderTime?: string;
  soundEnabled: boolean;
  reduceMotion: boolean;

  // Actions
  startSleep: () => void;
  endSleep: (quality?: 'light' | 'medium' | 'deep') => void;
  cancelSleep: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
  clearHistory: () => void;
}

interface Settings {
  targetSleepHours: number;
  reminderTime?: string;
  soundEnabled: boolean;
  reduceMotion: boolean;
}

// Generate unique ID
const generateId = () => `sleep_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useSleepStore = create<SleepState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSession: null,
      isTracking: false,
      sessions: [],
      stats: {
        averageDuration: 0,
        averageQuality: 0,
        totalNights: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
      targetSleepHours: 8,
      soundEnabled: true,
      reduceMotion: false,

      startSleep: () => {
        const session: SleepSession = {
          id: generateId(),
          startTime: Date.now(),
        };
        set({ currentSession: session, isTracking: true });
      },

      endSleep: (quality) => {
        const { currentSession, sessions, stats } = get();
        if (!currentSession) return;

        const endTime = Date.now();
        const duration = Math.round((endTime - currentSession.startTime) / 60000); // minutes

        const completedSession: SleepSession = {
          ...currentSession,
          endTime,
          duration,
          quality: quality || 'medium',
        };

        // Calculate new stats
        const newSessions = [completedSession, ...sessions].slice(0, 90); // Keep 90 days
        const durations = newSessions
          .filter(s => s.duration)
          .map(s => s.duration!);
        const avgDuration = durations.length > 0
          ? durations.reduce((a, b) => a + b, 0) / durations.length
          : 0;

        // Calculate streak
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < newSessions.length; i++) {
          const sessionDate = new Date(newSessions[i].startTime);
          sessionDate.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff <= 1 && newSessions[i].duration && newSessions[i].duration >= 360) { // 6+ hours
            streak++;
          } else {
            break;
          }
        }

        set({
          currentSession: null,
          isTracking: false,
          sessions: newSessions,
          stats: {
            averageDuration: avgDuration,
            averageQuality: stats.averageQuality,
            totalNights: newSessions.length,
            currentStreak: streak,
            bestStreak: Math.max(stats.bestStreak, streak),
          },
        });
      },

      cancelSleep: () => {
        set({ currentSession: null, isTracking: false });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          ...state,
          ...newSettings,
        }));
      },

      clearHistory: () => {
        set({
          sessions: [],
          stats: {
            averageDuration: 0,
            averageQuality: 0,
            totalNights: 0,
            currentStreak: 0,
            bestStreak: 0,
          },
        });
      },
    }),
    {
      name: 'sleep-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
