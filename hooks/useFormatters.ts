import { useCallback } from 'react';

export const useFormatters = () => {
  const formatDuration = useCallback((duration: number | string): string => {
    const seconds = typeof duration === 'string' ? parseInt(duration, 10) : duration;

    if (isNaN(seconds)) {
      return 'Unknown';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  }, []);

  return {
    formatDuration,
  };
};
