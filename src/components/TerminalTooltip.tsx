import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface TerminalTooltipProps {
  text: string;
  x: number;
  y: number;
}

const tooltipStyle: React.CSSProperties = {
  position: 'absolute',
  background: '#181c19',
  color: '#3e8600',
  fontFamily: 'Source Code Pro, monospace',
  fontSize: '9px',
  padding: '6px 12px',
  borderRadius: '4px',
  border: '1px solid #3e8600',
  boxShadow: '0 2px 8px rgba(0,0,0,0.7)',
  zIndex: 9999,
  pointerEvents: 'none',
  whiteSpace: 'pre',
  userSelect: 'none',
  transition: 'opacity 0.1s',
};

const TerminalTooltip: React.FC<TerminalTooltipProps> = ({ text, x, y }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tooltipRef.current) {
      // Optionally, you can add logic to keep the tooltip within the viewport
    }
  }, [x, y]);

  return ReactDOM.createPortal(
    <div
      ref={tooltipRef}
      style={{
        ...tooltipStyle,
        left: x,
        top: y,
      }}
    >
      {text}
    </div>,
    document.body
  );
};

export default TerminalTooltip; 