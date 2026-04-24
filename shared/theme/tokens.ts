// Design Tokens — Japanese Minimalist Sleep App
// "Ma" (間) — the Japanese concept of negative space

export const colors = {
  // Primary backgrounds
  background: {
    primary: '#0F1413',      // Near-black with subtle green undertone (dark mode base)
    secondary: '#141918',    // Elevated dark surfaces
    tertiary: '#1C2321',     // Cards and containers
    light: '#F6F7F5',        // Off-white warm (light mode)
    lightSecondary: '#ECEEE9', // Light mode surfaces
  },
  
  // Text
  text: {
    primary: '#F6F7F5',      // Primary text (inverted for dark)
    secondary: '#9CA3AF',    // Muted text
    tertiary: '#6B7280',     // Disabled/hint text
    inverse: '#0F1413',     // Text on light backgrounds
    lightPrimary: '#0F1413',  // Dark text on light
  },
  
  // Accent — Sage green (calm, not demanding attention)
  accent: {
    primary: '#7FA8A4',       // Sage green
    hover: '#8FB8B4',         // Lighter sage
    pressed: '#6A9894',       // Darker sage
    muted: 'rgba(127, 168, 164, 0.15)', // Subtle tint
    glow: 'rgba(127, 168, 164, 0.3)',   // Glow effect
  },
  
  // Semantic
  success: '#4ADE80',
  warning: '#FBBF24', 
  error: '#F87171',
  info: '#60A5FA',
  
  // Borders
  border: {
    subtle: 'rgba(127, 168, 164, 0.2)',
    medium: 'rgba(127, 168, 164, 0.35)',
    strong: 'rgba(127, 168, 164, 0.5)',
  },
  
  // Overlay
  overlay: {
    light: 'rgba(246, 247, 245, 0.8)',
    dark: 'rgba(15, 20, 19, 0.6)',
    heavy: 'rgba(15, 20, 19, 0.85)',
  },
} as const;

export const typography = {
  // Font families
  fontFamily: {
    primary: {
      regular: 'System',
      medium: 'System',
      semibold: 'System',
      bold: 'System',
    },
    mono: {
      regular: 'Menlo',
      medium: 'Menlo',
    },
  },
  
  // Font sizes — following iOS 14pt base
  fontSize: {
    // Display
    displayLarge: 57,
    displayMedium: 45,
    displaySmall: 36,
    
    // Headline
    headlineLarge: 32,
    headlineMedium: 28,
    headlineSmall: 24,
    
    // Title
    titleLarge: 22,
    titleMedium: 18,
    titleSmall: 16,
    
    // Body
    bodyLarge: 17,
    bodyMedium: 15,
    bodySmall: 13,
    
    // Label
    labelLarge: 14,
    labelMedium: 12,
    labelSmall: 11,
  },
  
  // Line heights — generous for "breathing" feel
  lineHeight: {
    displayLarge: 64,
    displayMedium: 52,
    displaySmall: 44,
    headlineLarge: 40,
    headlineMedium: 36,
    headlineSmall: 32,
    titleLarge: 28,
    titleMedium: 24,
    titleSmall: 22,
    bodyLarge: 26,
    bodyMedium: 24,
    bodySmall: 20,
    labelLarge: 20,
    labelMedium: 18,
    labelSmall: 14,
  },
  
  // Letter spacing — slightly loose for calm feeling
  tracking: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.6,
  },
  
  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as ConstStyleAttributeTypeOverride,
  },
} as const;

// Spacing system — 4pt grid with 8pt base
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

// Border radius — soft, not sharp
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

// Shadows — subtle, not heavy
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#0F1413',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F1413',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F1413',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;

// Layout constants
export const layout = {
  screenPadding: spacing[6],      // 24px horizontal padding
  contentMaxWidth: 428,            // Max width for content
  cardPadding: spacing[6],         // 24px card padding
  sectionGap: spacing[8],         // 32px between sections
  itemGap: spacing[4],            // 16px between items
  headerHeight: 56,
  tabBarHeight: 84,
  buttonHeight: {
    small: 36,
    medium: 48,
    large: 56,
  },
  inputHeight: 48,
  iconSize: {
    small: 16,
    medium: 24,
    large: 32,
    xl: 48,
  },
} as const;

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
