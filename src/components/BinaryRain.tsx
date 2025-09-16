import React, { useEffect, useMemo, useState } from 'react';

interface ColumnConfig {
  id: string;
  speedMs: number;
  fontSizePx: number;
  opacity: number;
  delayMs: number;
}

const generateBinaryString = (length: number, addInterGlyphSpace = false) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      // Random gap to simulate rain breaks
      const isGap = Math.random() < 0.01;
      if (isGap) {
        result += ' ';
      } else {
        result += Math.random() > 0.5 ? '1' : '0';
      }
      // Only optionally add an extra space between glyphs.
      // Previously you always appended ' ' which doubled horizontal space.
      if (addInterGlyphSpace) result += ' ';
    }
    return result;
  };

const useColumns = (count: number, seed: number) => {
  return useMemo<ColumnConfig[]>(() => {
    const columns: ColumnConfig[] = [];
    for (let i = 0; i < count; i++) {
      const rand = Math.abs(Math.sin(seed + i * 1337));
      // Slower, more realistic matrix rain speed
      const speedMs = 10000 + Math.floor(rand * 10000);
      const fontSizePx = 12 + Math.floor(rand * 10);
      const opacity = 0.25 + rand * 0.6;
      const delayMs = Math.floor(rand * 1000);
      columns.push({ id: `col-${i}`, speedMs, fontSizePx, opacity, delayMs });
    }
    return columns;
  }, [count, seed]);
};

const BinarySide: React.FC<{ side: 'left' | 'right'; columns: ColumnConfig[] }> = ({ side, columns }) => {
    const [content, setContent] = useState<string[]>([]);
  
    useEffect(() => {
        const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
        const REFERENCE_LENGTH = 800; // what you used before
        const strings = columns.map(col => {
          const estimatedLines = Math.ceil(vh / col.fontSizePx);
          const len = Math.max(8, Math.floor(estimatedLines * (0.5 + Math.random() * 0.4)));
          return { text: generateBinaryString(len, false), len };
        });
        setContent(strings.map(s => s.text));
      
        // store lengths so we can compute duration later
        (window as any).__binary_lengths = strings.map(s => s.len);
    }, [columns]);
  
    return (
      <div className={`binary-side ${side}`} aria-hidden>
        {columns.map((col, idx) => (
          <div
            key={col.id}
            className="binary-column"
            style={{
              animationDuration: `${col.speedMs}ms`,
              animationDelay: `${col.delayMs}ms`,
              fontSize: `${col.fontSizePx}px`,
              opacity: col.opacity
            }}
          >
            <span>{content[idx] || ''}</span>
            <span aria-hidden>{content[idx] || ''}</span>
          </div>
        ))}
      </div>
    );
  };
  

const BinaryRain: React.FC<{ leftColumns?: number; rightColumns?: number }> = ({ leftColumns = 30, rightColumns = 30 }) => {
  const seed = useMemo(() => Math.random(), []);
  const left = useColumns(leftColumns, seed);
  const right = useColumns(rightColumns, seed + 42);

  return (
    <div className="binary-rain" aria-hidden>
      <BinarySide side="left" columns={left} />
      <BinarySide side="right" columns={right} />
    </div>
  );
};

export default BinaryRain;


