import React, { useState, useEffect } from 'react';

interface CommandOutputProps {
  lines: string[];
  onComplete: () => void;
  delayPerChar?: number;
  delayBetweenLines?: number;
}

/**
 * CommandOutput component that displays lines with a typewriter effect
 * @param lines - Array of strings to display
 * @param onComplete - Callback function called when all lines are displayed
 * @param delayPerChar - Delay in milliseconds per character (default: 50)
 * @param delayBetweenLines - Delay in milliseconds between lines (default: 200)
 */
const CommandOutput: React.FC<CommandOutputProps> = ({
  lines,
  onComplete,
  delayPerChar = 50,
  delayBetweenLines = 200
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);

  useEffect(() => {
    if (lines.length === 0) {
      onComplete();
      return;
    }

    if (currentLineIndex >= lines.length) {
      onComplete();
      return;
    }

    const currentLine = lines[currentLineIndex];
    
    if (currentCharIndex < currentLine.length) {
      // Type the next character
      const timer = setTimeout(() => {
        setCurrentCharIndex(prev => prev + 1);
      }, delayPerChar);

      return () => clearTimeout(timer);
    } else {
      // Move to next line
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, currentLine]);
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, delayBetweenLines);

      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex, lines, delayPerChar, delayBetweenLines, onComplete]);

  // Build the current line being typed
  const currentLine = lines[currentLineIndex] || '';
  const currentLineDisplay = currentLine.substring(0, currentCharIndex);

  return (
    <div style={{ fontFamily: 'Source Code Pro, monospace', color: '#cfcfcf' }}>
      {displayedLines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      {currentLineDisplay && <div>{currentLineDisplay}</div>}
    </div>
  );
};

export default CommandOutput; 