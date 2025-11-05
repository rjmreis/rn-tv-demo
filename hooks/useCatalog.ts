import { useState, useEffect } from 'react';
import { CatalogItem } from '@/types/catalog';

export function useCatalog() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      setLoading(true);
      // Load from local assets
      const catalogData = require('@/assets/catalog/demo.json');
      setCatalog(catalogData.items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load catalog'));
      setCatalog([]);
    } finally {
      setLoading(false);
    }
  };

  return { catalog, loading, error, reload: loadCatalog };
}
