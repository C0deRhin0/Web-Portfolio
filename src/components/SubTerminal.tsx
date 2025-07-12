import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/SubTerminal.module.css";
import clueContent from "../data/clue.sh.json";
import secretContent from "../data/secret.sh.json";
import { TERMINAL_CONFIG } from "../config/terminalConfig";

interface SubTerminalProps {
  file: string; // 'clue.sh' or 'secret.sh'
  onClose: () => void;
}

const SubTerminal: React.FC<SubTerminalProps> = ({ file, onClose }) => {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typewriterTimeout, setTypewriterTimeout] = useState<NodeJS.Timeout | null>(null);

  // Get content based on file
  const getContent = () => {
    switch (file) {
      case 'clue.sh':
        return clueContent.outputLines;
      case 'secret.sh':
        return secretContent.outputLines;
      default:
        return ['File not found'];
    }
  };

  // Helper function to convert hex to RGB (copied from main terminal)
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Display content with typewriter effect (same logic as main terminal)
  const displayContentWithTypewriter = (lines: string[]) => {
    setIsTyping(true);
    
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    
    const typeNextChar = () => {
      if (currentLineIndex >= lines.length) {
        setIsTyping(false);
        setTypewriterTimeout(null);
        return;
      }
      
      const currentLine = lines[currentLineIndex] || '';
      
      if (currentCharIndex < currentLine.length) {
        // Ensure the character exists before adding it
        const char = currentLine[currentCharIndex];
        if (char !== undefined && char !== null) {
          setDisplayed(prev => prev + char);
        }
        
        currentCharIndex++;
        const timeout = setTimeout(typeNextChar, TERMINAL_CONFIG.typewriter.charDelay);
        setTypewriterTimeout(timeout);
      } else {
        // Move to next line
        setDisplayed(prev => prev + '\n');
        currentLineIndex++;
        currentCharIndex = 0;
        const timeout = setTimeout(typeNextChar, TERMINAL_CONFIG.typewriter.lineDelay);
        setTypewriterTimeout(timeout);
      }
    };
    
    typeNextChar();
  };

  useEffect(() => {
    setDisplayed("");
    const content = getContent();
    displayContentWithTypewriter(content);
  }, [file]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
      }
    };
  }, [typewriterTimeout]);

  return (
    <div className={styles.overlay}>
      <div className={styles.subTerminalBox}>
        <button className={styles.exitButton} onClick={onClose}>
          ×
        </button>
        <pre className={styles.terminalText}>{displayed}</pre>
      </div>
    </div>
  );
};

export default SubTerminal; 