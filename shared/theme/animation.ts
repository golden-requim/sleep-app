// Animation Tokens — "Nap" (寝) — the gentle rhythm of sleep
// All animations should feel like breathing — slow, natural, unhurried

import { Easing } from 'react-native-reanimated';

// Master easing curve — the "calm" bezier
// Feels natural, never mechanical, never jarring
export const easing = {
  // Primary easing for all UI transitions
  // cubic-bezier(0.4, 0, 0.2, 1)
  calm: Easing.bezier(0.4, 0, 0.2, 1),
  
  // Slower easing for emphasis/arrival
  // cubic-bezier(0, 0, 0.2, 1)
  gentle: Easing.bezier(0, 0, 0.2, 1),
  
  // Slight overshoot for playful elements
  // cubic-bezier(0.34, 1.56, 0.64, 1)
  bouncy: Easing.bezier(0.34, 1.56, 0.64, 1),
  
  // Linear for ambient loops (pulse, breathing)
  linear: Easing.linear,
  
  // Default spring config
  spring: {
    damping: 20,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
  },
  
  // Gentle spring for subtle bounces
  springGentle: {
    damping: 25,
    mass: 1,
    stiffness: 80,
    overshootClamping: true,
  },
} as const;

// Duration tokens — in milliseconds
// Rule: NEVER faster than 100ms (feels abrupt)
// NEVER slower than 800ms (feels dead)
export const duration = {
  // Instant — for color/opacity changes that shouldn't animate
  instant: 0,
  
  // Super fast — micro-interactions (button press feedback)
  micro: 80,
  
  // Fast — small UI changes (toggle, checkbox)
  fast: 150,
  
  // Normal — standard transitions (card appear, modal open)
  normal: 300,
  
  // Slow — emphasis transitions (page navigation)
  slow: 500,
  
  // Slower — dramatic moments (mode changes, sleep transitions)
  slower: 700,
  
  // Slowest — ambient/artistic (breathing pulse, background shifts)
  ambient: 1000,
  
  // Ultra slow — for background color shifts during sleep mode
  ultra: 1500,
} as const;

// Animation tokens for specific use cases
export const animations = {
  // Button press — snappy but not jarring
  button: {
    duration: duration.fast,
    easing: easing.calm,
    scale: 0.96,
  },
  
  // Screen transitions — slow and smooth
  screenTransition: {
    duration: duration.slow,
    easing: easing.gentle,
  },
  
  // Background color shift (entering/leaving sleep mode)
  backgroundShift: {
    duration: duration.ultra,
    easing: easing.gentle,
  },
  
  // Breathing pulse (the iconic sleep ring animation)
  // Scale + opacity oscillating over 5 seconds
  breathingPulse: {
    duration: 5000,
    easing: easing.linear,
    scaleMin: 1.0,
    scaleMax: 1.015,
    opacityMin: 0.6,
    opacityMax: 1.0,
    // Continuous loop — no start/end
    loop: true,
  },
  
  // Pulse circle appearing (from center, expanding)
  pulseAppear: {
    duration: duration.slower,
    easing: easing.gentle,
    scaleFrom: 0,
    scaleTo: 1,
    opacityFrom: 0,
    opacityTo: 1,
  },
  
  // Streak dot filling
  streakFill: {
    duration: duration.normal,
    easing: easing.bouncy,
    scale: 1.2,
  },
  
  // Input focus
  inputFocus: {
    duration: duration.fast,
    easing: easing.calm,
    borderWidth: 2,
  },
  
  // Toggle switch
  toggle: {
    duration: duration.fast,
    easing: easing.calm,
  },
  
  // Card appear
  cardAppear: {
    duration: duration.normal,
    easing: easing.calm,
    translateY: 8,
    opacity: 0,
  },
  
  // Fade in/out
  fade: {
    duration: duration.normal,
    easing: easing.calm,
  },
  
  // Modal/drawer
  modal: {
    duration: duration.slow,
    easing: easing.calm,
    backdropOpacity: 0.6,
  },
} as const;

// Sleep mode specific animations
export const sleepAnimations = {
  // Ring "breathing" in idle state
  ringBreathing: {
    duration: 5000,
    scaleRange: [1.0, 1.015],
    opacityRange: [0.7, 1.0],
  },
  
  // Pulse circle ambient animation
  pulseAmbient: {
    duration: 5000,
    scaleRange: [0.95, 1.05],
    opacityRange: [0.5, 1.0],
  },
  
  // Background darkening during sleep
  backgroundDarken: {
    duration: duration.ultra, // 1.5s
    easing: easing.gentle,
  },
  
  // Morning wake — gentle brightness return
  wakeUp: {
    duration: duration.slower,
    easing: easing.gentle,
    scaleBounce: 1.02,
  },
} as const;

// Stagger delays for lists
export const stagger = {
  // Items appearing in sequence
  itemDelay: 50,      // ms between each item
  maxDelay: 300,     // cap at 6 items
  
  // Section delays
  sectionDelay: 100,
} as const;

// Reduce motion — instant transitions for accessibility
export const reduceMotion = {
  duration: duration.instant,
  animations: {
    ...animations,
    button: { ...animations.button, duration: duration.instant },
    screenTransition: { ...animations.screenTransition, duration: duration.instant },
    breathingPulse: { ...animations.breathingPulse, duration: duration.instant },
  },
} as const;

// Type exports
export type EasingFunction = typeof easing;
export type Duration = typeof duration;
export type AnimationConfig = typeof animations;
