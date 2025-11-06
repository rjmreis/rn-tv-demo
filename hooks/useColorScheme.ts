import { useColorScheme as useRNColorScheme, Platform } from 'react-native';

export function useColorScheme() {
  const colorScheme = useRNColorScheme();

  // TV platforms should always use dark mode
  if (Platform.isTV) {
    return 'dark';
  }

  return colorScheme;
}
