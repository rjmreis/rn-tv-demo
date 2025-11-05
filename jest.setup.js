// Set up test environment globals
global.__DEV__ = true;

// Mock expo winter runtime - this is loaded by expo/src/Expo.fx.tsx
jest.mock('expo/src/winter', () => ({}), { virtual: true });
jest.mock('expo/src/async-require', () => ({}), { virtual: true });

// Mock react-native-video
jest.mock('react-native-video', () => 'Video');

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
  useNavigation: jest.fn(() => ({
    setOptions: jest.fn(),
  })),
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
