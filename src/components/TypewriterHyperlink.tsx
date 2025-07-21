import React, { useEffect, useState } from 'react';

type TypewriterHyperlinkProps = {
  text: string;
  url?: string; // Optional, defaults to "https://google.com"
  delay?: number;
  style?: React.CSSProperties;
};

const DEFAULT_URL = "https://google.com";

const TypewriterHyperlink: React.FC<TypewriterHyperlinkProps> = ({
  text,
  url = DEFAULT_URL,
  delay = 40,
  style = {},
}) => {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    if (visibleLength < text.length) {
      const timeout = setTimeout(() => setVisibleLength(visibleLength + 1), delay);
      return () => clearTimeout(timeout);
    }
  }, [visibleLength, delay, text]);

  const visibleText = text.slice(0, visibleLength);
  const isComplete = visibleLength === text.length;

  return (
    <a
      href={isComplete ? url : undefined}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        pointerEvents: isComplete ? 'auto' : 'none',
        color: 'cyan',
        textDecoration: 'underline',
        cursor: isComplete ? 'pointer' : 'default',
        ...style,
      }}
    >
      {visibleText}
      <span className="cursor" style={{ opacity: isComplete ? 0 : 1 }}>|</span>
    </a>
  );
};

export default TypewriterHyperlink; 