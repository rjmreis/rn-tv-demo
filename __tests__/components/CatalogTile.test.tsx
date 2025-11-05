import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CatalogTile } from '@/components/CatalogTile';
import { CatalogItem } from '@/types/catalog';

const mockItem: CatalogItem = {
  id: '1',
  title: 'Test Movie',
  description: 'This is a test movie description',
  thumbnail: 'https://example.com/thumbnail.jpg',
  poster: 'https://example.com/poster.jpg',
  streamUrl: 'https://example.com/stream.mp4',
  duration: '120 min',
  genre: 'Action',
};

describe('CatalogTile', () => {
  it('should render item title and genre', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <CatalogTile item={mockItem} onPress={onPress} testID="test-tile" />
    );

    expect(getByText('Test Movie')).toBeTruthy();
    expect(getByText('Action')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <CatalogTile item={mockItem} onPress={onPress} testID="test-tile" />
    );

    const title = getByText('Test Movie');
    fireEvent.press(title);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should display thumbnail image with correct source', () => {
    const onPress = jest.fn();
    const { UNSAFE_getByType } = render(
      <CatalogTile item={mockItem} onPress={onPress} testID="test-tile" />
    );

    const image = UNSAFE_getByType('Image' as any);
    expect(image.props.source).toEqual({ uri: mockItem.thumbnail });
  });
});
