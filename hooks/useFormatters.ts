import { useCallback } from "react";

export const useFormatters = () => {
  const formatDuration = useCallback((duration: number | string): string => {
    const seconds =
      typeof duration === "string" ? parseInt(duration, 10) : duration;

    if (isNaN(seconds)) {
      return "Unknown";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    formatDuration,
    formatTime,
  };
};
