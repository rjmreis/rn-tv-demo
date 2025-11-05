import { renderHook } from '@testing-library/react-native';
import { useFormatters } from '@/hooks/useFormatters';

describe('useFormatters', () => {
  describe('formatDuration', () => {
    it('should format duration with hours and minutes', () => {
      const { result } = renderHook(() => useFormatters());
      expect(result.current.formatDuration(6660)).toBe('1h 51m');
    });

    it('should format duration with only hours when minutes are 0', () => {
      const { result } = renderHook(() => useFormatters());
      expect(result.current.formatDuration(3600)).toBe('1h');
      expect(result.current.formatDuration(7200)).toBe('2h');
    });

    it('should format duration with only minutes when less than an hour', () => {
      const { result } = renderHook(() => useFormatters());
      expect(result.current.formatDuration(2700)).toBe('45m');
      expect(result.current.formatDuration(300)).toBe('5m');
      expect(result.current.formatDuration(60)).toBe('1m');
    });

    it('should handle 0 seconds', () => {
      const { result } = renderHook(() => useFormatters());
      expect(result.current.formatDuration(0)).toBe('0m');
    });

    it('should handle string input', () => {
      const { result } = renderHook(() => useFormatters());
      expect(result.current.formatDuration('6660')).toBe('1h 51m');
      expect(result.current.formatDuration('3600')).toBe('1h');
      expect(result.current.formatDuration('300')).toBe('5m');
    });

    it('should return "Unknown" for invalid input', () => {
      const { result } = renderHook(() => useFormatters());
      expect(result.current.formatDuration('invalid')).toBe('Unknown');
      expect(result.current.formatDuration(NaN)).toBe('Unknown');
    });

    it('should handle large durations', () => {
      const { result } = renderHook(() => useFormatters());
      expect(result.current.formatDuration(36000)).toBe('10h');
      expect(result.current.formatDuration(36060)).toBe('10h 1m');
    });

    it('should handle fractional seconds by flooring', () => {
      const { result } = renderHook(() => useFormatters());
      expect(result.current.formatDuration(3659)).toBe('1h');
      expect(result.current.formatDuration(3661)).toBe('1h 1m');
    });

    it('should be memoized and return the same function reference', () => {
      const { result } = renderHook(() => useFormatters());
      const firstReference = result.current.formatDuration;
      const secondReference = result.current.formatDuration;

      expect(secondReference).toBe(firstReference);
    });
  });
});
