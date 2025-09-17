// full updated binrain.tsx (React + CSS in same file for clarity)
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

interface ColumnConfig {
  id: string;
  fontSizePx: number;
  opacity: number;
  delaySeedMs: number;
  pxPerMs: number;
}

// generate binary string WITHOUT an always-appended space
const generateBinaryString = (length: number) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    const isGap = Math.random() < 0.01;
    result += isGap ? ' ' : (Math.random() > 0.5 ? '1' : '0');
  }
  return result;
};

const MIN_LENGTH = 5;
const MAX_LENGTH = 20;
const MIN_PX_PER_SECOND = 10;

const useColumns = (count: number, seed: number, basePxPerSecond: number) => {
  return useMemo<ColumnConfig[]>(() => {
    const columns: ColumnConfig[] = [];
    for (let i = 0; i < count; i++) {
      const rand = Math.abs(Math.sin(seed + i * 1337));
      const fontSizePx = 10 + Math.floor(rand * 12);
      const opacity = 0.25 + rand * 0.6;
      const delaySeedMs = Math.floor(rand * 1500);
      const pxPerSecond = Math.max(MIN_PX_PER_SECOND, basePxPerSecond * (0.6 + rand * 1.2));
      const pxPerMs = pxPerSecond / 1000;
      columns.push({ id: `col-${i}`, fontSizePx, opacity, delaySeedMs, pxPerMs });
    }
    return columns;
  }, [count, seed, basePxPerSecond]);
};

const BinaryColumn: React.FC<{
  text: string;
  config: ColumnConfig;
  colScale?: number;
}> = ({ text, config, colScale = 1 }) => {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [initialDelayMs] = useState<number>(() => -Math.floor(Math.random() * 3000));

  useLayoutEffect(() => {
    const measure = () => {
      if (!spanRef.current) return;
      const contentHeight = spanRef.current.getBoundingClientRect().height;
      const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;
      const distancePx = Math.max(viewportH, contentHeight + viewportH);
      const rawDuration = Math.max(300, Math.floor(distancePx / config.pxPerMs));
      const jitter = 0.9 + Math.random() * 0.2;
      setDurationMs(Math.floor(rawDuration * jitter));
    };

    measure();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [text, config.fontSizePx, config.pxPerMs]);

  return (
    <div
      className="binary-column"
      style={{
        fontSize: `${Math.max(8, Math.floor(config.fontSizePx * colScale))}px`,
        opacity: config.opacity,
        animationDuration: durationMs ? `${durationMs}ms` : undefined,
        animationDelay: `${initialDelayMs + config.delaySeedMs}ms`,
        animationTimingFunction: 'linear'
      }}
    >
      <span ref={spanRef} className="binary-span" aria-hidden>
        {text}
      </span>
      <span className="binary-span" aria-hidden>
        {text}
      </span>
    </div>
  );
};

const BinarySide: React.FC<{
  side: 'left' | 'right';
  columnsCount: number;
  seed: number;
  basePxPerSecond: number;
}> = ({ side, columnsCount, seed, basePxPerSecond }) => {
  const cols = useColumns(columnsCount, seed, basePxPerSecond);

  const sideRef = useRef<HTMLDivElement | null>(null);
  const [colScale, setColScale] = useState<number>(1);

  const [content, setContent] = useState<string[]>([]);

  useEffect(() => {
    const strings = cols.map(() => {
      const len = Math.floor(MIN_LENGTH + Math.random() * (MAX_LENGTH - MIN_LENGTH + 1));
      return generateBinaryString(len);
    });
    setContent(strings);
  }, [cols]);

  useEffect(() => {
    const computeScale = () => {
      if (!sideRef.current || cols.length === 0) {
        setColScale(1);
        return;
      }
      const sideWidthPx = sideRef.current.clientWidth;
      const gapPx = 6;
      const avgColWidth = cols.reduce((s, c) => s + (c.fontSizePx * 0.6 + 4), 0) / cols.length;
      const needed = cols.length * avgColWidth + Math.max(0, cols.length - 1) * gapPx;
      const scale = needed > 0 ? Math.min(1, sideWidthPx / needed) : 1;
      setColScale(Math.max(0.45, scale));
    };
  
    const runCompute = () => {
      computeScale();
      // re-run on next frame to handle late layout/font changes
      requestAnimationFrame(() => computeScale());
    };
  
    // If Font Loading API is available, wait for fonts to be ready first
    if (typeof document !== 'undefined' && (document as any).fonts && (document as any).fonts.ready) {
      (document as any).fonts.ready.then(() => runCompute()).catch(() => runCompute());
    } else {
      runCompute();
    }
  
    const onResize = () => {
      // small debounce could be added if needed
      computeScale();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [cols]);
  

  return (
    <div className={`binary-side ${side}`} ref={sideRef} aria-hidden>
      {cols.map((col, i) => (
        <BinaryColumn key={col.id} text={content[i] || ''} config={col} colScale={colScale} />
      ))}
    </div>
  );
};

const BinaryRain: React.FC<{ leftColumns?: number; rightColumns?: number; sideWidthVw?: number; pxPerSecond?: number }> = ({
  leftColumns = 200,
  rightColumns = 200,
  sideWidthVw = 10,
  pxPerSecond = 200
}) => {
  const seed = useMemo(() => Math.random(), []);
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!rootRef.current) return;
    rootRef.current.style.setProperty('--side-width', `${sideWidthVw}vw`);
  }, [sideWidthVw]);

  return (
    <div className="binary-rain" ref={rootRef} aria-hidden>
      <BinarySide side="left" columnsCount={leftColumns} seed={seed} basePxPerSecond={pxPerSecond} />
      <BinarySide side="right" columnsCount={rightColumns} seed={seed + 42} basePxPerSecond={pxPerSecond} />
    </div>
  );
};

export default BinaryRain;