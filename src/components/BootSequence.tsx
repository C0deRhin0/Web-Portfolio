import React, { useEffect, useMemo, useState } from 'react';
import { BOOT_LINES } from '../utils/bootMessages';
import { buildBootFrames } from '../utils/bootSequenceUtils';

interface BootSequenceProps {
  onComplete: () => void;
  theme: '1' | '2' | '3';
  baseDelay?: number;
  instant?: boolean;
}

const THEME_CLASSES: Record<'1' | '2' | '3', string> = {
  '1': 'boot-sequence theme-1',
  '2': 'boot-sequence theme-2',
  '3': 'boot-sequence theme-3'
};

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete, theme, baseDelay = 100, instant = false }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const completionDelay = Math.max(baseDelay, 0) + 120;
  const frames = useMemo(() => {
    if (instant) {
      return BOOT_LINES.map((line) => ({ id: line.id, content: line.text }));
    }
    return buildBootFrames(BOOT_LINES, currentLineIndex, currentCharIndex);
  }, [currentLineIndex, currentCharIndex, instant]);

  useEffect(() => {
    if (instant) {
      setIsComplete(true);
      const timeout = setTimeout(() => onComplete(), 0);
      return () => clearTimeout(timeout);
    }

    if (currentLineIndex >= BOOT_LINES.length) {
      const completionTimeout = setTimeout(() => {
        setIsComplete(true);
        const fadeTimeout = setTimeout(() => onComplete(), 400);
        return () => clearTimeout(fadeTimeout);
      }, completionDelay);
      return () => clearTimeout(completionTimeout);
    }

    const currentLine = BOOT_LINES[currentLineIndex];
    const charDelay = 6;
    const lineDelay = baseDelay;

    if (currentCharIndex < currentLine.text.length) {
      const timeout = setTimeout(
        () => setCurrentCharIndex((count) => count + 1),
        charDelay
      );
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCurrentLineIndex((count) => count + 1);
      setCurrentCharIndex(0);
    }, lineDelay);
    return () => clearTimeout(timeout);
  }, [currentLineIndex, currentCharIndex, baseDelay, onComplete, completionDelay, instant]);

  return (
    <div
      className={`${THEME_CLASSES[theme]}${isComplete ? ' boot-sequence--fade' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="boot-sequence__header">CODERHINO OS Boot</div>
      <div className="boot-sequence__body">
        {frames.map((line) => (
          <div key={line.id} className="boot-sequence__line">
            {line.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BootSequence;
