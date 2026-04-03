import type { BootLine } from './bootMessages';

export interface BootFrame {
  id: string;
  content: string;
}

export const getBootFrameDelays = (lines: BootLine[], baseDelay: number): number[] => {
  const safeDelay = Number.isFinite(baseDelay) ? Math.max(baseDelay, 0) : 0;
  return lines.map((line) => safeDelay + line.text.length * 2);
};

export const buildBootFrames = (lines: BootLine[], lineIndex: number, charIndex: number): BootFrame[] => {
  if (!Array.isArray(lines) || lines.length === 0 || lineIndex < 0) {
    return [];
  }

  const clampedLineIndex = Math.min(lineIndex, lines.length);
  const completedFrames = lines.slice(0, clampedLineIndex).map((line) => ({
    id: line.id,
    content: line.text
  }));

  if (lineIndex >= lines.length) {
    return completedFrames;
  }

  const currentLine = lines[lineIndex];
  const safeCharIndex = Math.max(0, Math.min(charIndex, currentLine.text.length));
  const currentContent = currentLine.text.slice(0, safeCharIndex);

  if (!currentContent) {
    return completedFrames;
  }

  return [
    ...completedFrames,
    {
      id: currentLine.id,
      content: currentContent
    }
  ];
};
