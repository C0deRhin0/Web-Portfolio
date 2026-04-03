import { buildBootFrames, getBootFrameDelays } from '../bootSequenceUtils';
import type { BootLine } from '../bootMessages';

describe('bootSequenceUtils', () => {
  const lines: BootLine[] = [
    { id: 'one', text: 'First line' },
    { id: 'two', text: 'Second line' }
  ];

  describe('getBootFrameDelays', () => {
    it('returns delays for each line', () => {
      const delays = getBootFrameDelays(lines, 100);
      expect(delays).toHaveLength(2);
      expect(delays[0]).toBeGreaterThan(0);
      expect(delays[1]).toBeGreaterThan(0);
    });

    it('returns zero delays for invalid base delay', () => {
      const delays = getBootFrameDelays(lines, -10);
      expect(delays.every((delay) => delay >= 0)).toBe(true);
    });
  });

  describe('buildBootFrames', () => {
    it('builds frames up to line index with partial line', () => {
      const frames = buildBootFrames(lines, 0, 3);
      expect(frames).toEqual([{ id: 'one', content: 'Fir' }]);
    });

    it('returns empty array for invalid inputs', () => {
      expect(buildBootFrames([], 2, 1)).toEqual([]);
      expect(buildBootFrames(lines, -1, 0)).toEqual([]);
    });

    it('returns completed frames when index exceeds lines', () => {
      const frames = buildBootFrames(lines, 2, 4);
      expect(frames).toEqual([
        { id: 'one', content: 'First line' },
        { id: 'two', content: 'Second line' }
      ]);
    });
  });
});
