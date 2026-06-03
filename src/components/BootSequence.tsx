import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const hasCompletedRef = useRef(false);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const completionDelay = Math.max(baseDelay, 0) + 120;
  const completeBoot = useCallback((delay = 400) => {
    if (hasCompletedRef.current) {
      return;
    }

    hasCompletedRef.current = true;
    setIsComplete(true);
    completionTimeoutRef.current = setTimeout(() => {
      onComplete();
    }, delay);
  }, [onComplete]);

  useEffect(() => () => {
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (instant) {
      return;
    }

    const handleSkip = () => completeBoot(0);
    window.addEventListener('keydown', handleSkip);
    return () => window.removeEventListener('keydown', handleSkip);
  }, [completeBoot, instant]);

  const frames = useMemo(() => {
    if (instant) {
      return BOOT_LINES.map((line) => ({ id: line.id, content: line.text }));
    }
    return buildBootFrames(BOOT_LINES, currentLineIndex, currentCharIndex);
  }, [currentLineIndex, currentCharIndex, instant]);

  useEffect(() => {
    if (instant) {
      completeBoot(0);
      return undefined;
    }

    if (hasCompletedRef.current) {
      return undefined;
    }

    if (currentLineIndex >= BOOT_LINES.length) {
      const completionTimeout = setTimeout(() => {
        completeBoot(400);
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
  }, [currentLineIndex, currentCharIndex, baseDelay, completionDelay, instant, completeBoot]);

  return (
    <div
      className={`${THEME_CLASSES[theme]}${isComplete ? ' boot-sequence--fade' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="boot-sequence__header">CODERHINO OS Boot</div>
      <div className="boot-sequence__skip">Press any key to skip</div>
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
