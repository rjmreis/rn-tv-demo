import { renderHook } from '@testing-library/react-native';
import { useCatalog } from '@/hooks/useCatalog';

describe('useCatalog', () => {
  it('should load catalog data successfully', async () => {
    const { result } = renderHook(() => useCatalog());

    // Wait for the catalog to load
    await new Promise((resolve) => setTimeout(resolve, 100));

    // After loading
    expect(result.current.loading).toBe(false);
    expect(result.current.catalog.length).toBeGreaterThan(0);
    expect(result.current.error).toBe(null);
  });

  it('should provide catalog items with required properties', async () => {
    const { result } = renderHook(() => useCatalog());

    await new Promise((resolve) => setTimeout(resolve, 100));

    const firstItem = result.current.catalog[0];
    expect(firstItem).toHaveProperty('id');
    expect(firstItem).toHaveProperty('title');
    expect(firstItem).toHaveProperty('description');
    expect(firstItem).toHaveProperty('thumbnail');
    expect(firstItem).toHaveProperty('streamUrl');
    expect(firstItem).toHaveProperty('duration');
    // poster and genre are optional fields
  });

  it('should have at least 6 catalog items', async () => {
    const { result } = renderHook(() => useCatalog());

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result.current.catalog.length).toBeGreaterThanOrEqual(6);
  });
});
