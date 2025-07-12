import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/SubTerminal.module.css";
import clueContent from "../data/clue.sh.json";
import secretContent from "../data/secret.sh.json";
import { TERMINAL_CONFIG } from "../config/terminalConfig";
import { createPackageInstallEffect, playAudio } from "../utils/packageInstallEffect";

interface SubTerminalProps {
  file: string; // 'clue.sh' or 'secret.sh'
  onClose: () => void;
}

const SubTerminal: React.FC<SubTerminalProps> = ({ file, onClose }) => {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typewriterTimeout, setTypewriterTimeout] = useState<NodeJS.Timeout | null>(null);
  const packageInstallRef = useRef<any>(null);
  const terminalTextRef = useRef<HTMLPreElement>(null);

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

  // Get effect type based on file
  const getEffectType = () => {
    switch (file) {
      case 'clue.sh':
        return 'typewriter';
      case 'secret.sh':
        return secretContent.effect || 'typewriter';
      default:
        return 'typewriter';
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

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    if (terminalTextRef.current) {
      terminalTextRef.current.scrollTop = terminalTextRef.current.scrollHeight;
    }
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
          // Auto-scroll after each character
          setTimeout(scrollToBottom, 0);
        }
        
        currentCharIndex++;
        const timeout = setTimeout(typeNextChar, TERMINAL_CONFIG.typewriter.charDelay);
        setTypewriterTimeout(timeout);
      } else {
        // Move to next line
        setDisplayed(prev => prev + '\n');
        // Auto-scroll after each line
        setTimeout(scrollToBottom, 0);
        currentLineIndex++;
        currentCharIndex = 0;
        const timeout = setTimeout(typeNextChar, TERMINAL_CONFIG.typewriter.lineDelay);
        setTypewriterTimeout(timeout);
      }
    };
    
    typeNextChar();
  };

  // Display content with package installation effect
  const displayContentWithPackageInstall = (lines: string[]) => {
    setIsTyping(true);
    
    // Create package install effect
    packageInstallRef.current = createPackageInstallEffect({
      onComplete: () => {
        setIsTyping(false);
        // Play audio when installation is complete
        playAudio('/audio/zzz.wav');
      }
    });

    // Write function for the package install effect
    const writeFunction = (text: string) => {
      setDisplayed(prev => prev + text);
      // Auto-scroll after each write
      setTimeout(scrollToBottom, 0);
    };

    // Start the package installation effect
    packageInstallRef.current.start(lines, writeFunction);
  };

  useEffect(() => {
    setDisplayed("");
    const content = getContent();
    const effectType = getEffectType();
    
    if (effectType === 'package-install') {
      displayContentWithPackageInstall(content);
    } else {
      displayContentWithTypewriter(content);
    }
  }, [file]);

  // Auto-scroll when displayed content changes
  useEffect(() => {
    scrollToBottom();
  }, [displayed]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
      }
      if (packageInstallRef.current) {
        packageInstallRef.current.stop();
      }
    };
  }, [typewriterTimeout]);

  return (
    <div className={styles.overlay}>
      <div className={styles.subTerminalBox}>
        <button className={styles.exitButton} onClick={onClose}>
          ×
        </button>
        <pre ref={terminalTextRef} className={styles.terminalText}>{displayed}</pre>
      </div>
    </div>
  );
};

export default SubTerminal; 