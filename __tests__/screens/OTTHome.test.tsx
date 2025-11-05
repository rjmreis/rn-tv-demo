import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import OTTHomeScreen from '@/app/(tabs)';

// Mock the router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useLocalSearchParams: jest.fn(),
}));

describe('OTTHomeScreen', () => {
  it('should render catalog items', async () => {
    const { getByText, getByTestId } = render(<OTTHomeScreen />);

    await waitFor(() => {
      expect(getByText('Featured Content')).toBeTruthy();
    });

    await waitFor(() => {
      expect(getByTestId('catalog-list')).toBeTruthy();
    });
  });

  it('should display correct number of items in subtitle', async () => {
    const { getByText } = render(<OTTHomeScreen />);

    await waitFor(() => {
      expect(getByText(/Browse our collection of \d+ titles/)).toBeTruthy();
    });
  });
});
