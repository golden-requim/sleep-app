# Nemuri — 寝

A minimalist Japanese sleep tracking app. Quiet, focused, peaceful.

## Philosophy

**"Ma" (間)** — Negative space. The beauty of emptiness.  
**"Shizuka" (静か)** — Quiet. Calm. Undemanding.

This app doesn't shout for your attention. It simply accompanies you to sleep, and quietly records the journey.

## Tech Stack

- **Framework**: Expo SDK 54 + React Native 0.81
- **Animation**: react-native-reanimated 3
- **State**: Zustand 5
- **Navigation**: React Navigation 7
- **Testing**: Jest + React Native Testing Library

## Architecture

```
sleep-app/
├── app/                      # Expo Router app directory
├── features/
│   └── sleep/
│       ├── domain/           # Business logic (pure functions)
│       ├── data/             # Data layer (repositories, storage)
│       └── presentation/     # UI layer
│           ├── components/   # Reusable UI components
│           ├── screens/      # Screen components
│           ├── hooks/       # Custom hooks
│           └── store/       # Zustand state
├── shared/
│   ├── theme/                # Design tokens + animation tokens
│   ├── components/          # Shared cross-feature components
│   ├── utils/               # Utility functions
│   └── constants/           # App constants
├── __tests__/              # Domain/unit tests
└── .github/workflows/      # CI/CD
```

## Design Principles

1. **Never faster than 100ms** — Animations feel abrupt if shorter
2. **Never slower than 800ms** — Animation feels dead if longer
3. **No heavy shadows** — Keep it light, airy
4. **Reduce motion always respected** — Accessibility is mandatory
5. **Test domain logic, not UI** — UI tests become brittle

## Commands

```bash
npm install          # Install dependencies
npm start            # Start Expo
npm test             # Run tests
npm run lint         # ESLint
npm run typecheck    # TypeScript check
```

## CI/CD

Every push runs:
- ✅ Unit tests (Jest)
- ✅ ESLint
- ✅ TypeScript check
- ⬜ Coverage enforcement (70% threshold)

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| background.primary | `#0F1413` | Main dark background |
| background.light | `#F6F7F5` | Light mode / off-white |
| accent.primary | `#7FA8A4` | Sage green accent |
| text.primary | `#F6F7F5` | Primary text |
| text.secondary | `#9CA3AF` | Muted text |

## Animation Specs

| Animation | Duration | Easing |
|-----------|----------|--------|
| Button press | 150ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Screen transition | 500ms | cubic-bezier(0, 0, 0.2, 1) |
| Breathing pulse | 5000ms | linear (continuous) |
| Background shift | 1500ms | cubic-bezier(0, 0, 0.2, 1) |

## Accessibility

- WCAG 2.1 AA compliant
- Reduce motion support (instant transitions when enabled)
- Minimum touch target: 48x48px
- Color contrast ratio: 4.5:1 minimum

## License

MIT
