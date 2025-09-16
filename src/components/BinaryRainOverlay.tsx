import React, { useEffect, useMemo, useRef, useState } from 'react';
import BinaryRain from './BinaryRain';

interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const measureMonoCharWidth = (): number => {
  if (typeof window === 'undefined') return 10;
  const measurer = document.createElement('span');
  measurer.style.position = 'fixed';
  measurer.style.visibility = 'hidden';
  measurer.style.whiteSpace = 'pre';
  measurer.style.fontFamily = 'Source Code Pro, monospace';
  measurer.style.fontSize = getComputedStyle(document.documentElement).getPropertyValue('--xterm-font-size') || '14px';
  measurer.textContent = '00000';
  document.body.appendChild(measurer);
  const width = measurer.getBoundingClientRect().width / 5;
  document.body.removeChild(measurer);
  return width || 10;
};

const BinaryRainOverlay: React.FC = () => {
  const [rect, setRect] = useState<Rect | null>(null);
  const [gapPx, setGapPx] = useState<number>(40);
  const roRef = useRef<ResizeObserver | null>(null);

  const updateRect = () => {
    const container = document.querySelector('.terminal-container > div:first-child') as HTMLElement | null;
    if (!container) return;
    const r = container.getBoundingClientRect();
    setRect({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Initial measure
    updateRect();
    // Compute ~5 columns gap using monospaced width
    const charWidth = measureMonoCharWidth();
    setGapPx(charWidth * 5);

    // Observe size changes of the terminal wrapper and window resizes
    const target = document.querySelector('.terminal-container > div:first-child') as HTMLElement | null;
    if (target && 'ResizeObserver' in window) {
      roRef.current = new ResizeObserver(() => updateRect());
      roRef.current.observe(target);
    }
    const onScroll = () => updateRect();
    const onResize = () => {
      updateRect();
      const cw = measureMonoCharWidth();
      setGapPx(cw * 5);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (roRef.current && target) roRef.current.unobserve(target);
      roRef.current = null;
    };
  }, []);

  const styleLeft = useMemo<React.CSSProperties>(() => {
    if (!rect) return { display: 'none' };
    return {
      position: 'fixed',
      top: rect.top,
      bottom: Math.max(window.innerHeight - rect.bottom, 0),
      right: Math.max(window.innerWidth - rect.left + gapPx, 0),
      pointerEvents: 'none'
    } as React.CSSProperties;
  }, [rect, gapPx]);

  const styleRight = useMemo<React.CSSProperties>(() => {
    if (!rect) return { display: 'none' };
    return {
      position: 'fixed',
      top: rect.top,
      bottom: Math.max(window.innerHeight - rect.bottom, 0),
      left: rect.right + gapPx,
      pointerEvents: 'none'
    } as React.CSSProperties;
  }, [rect, gapPx]);

  if (!rect) return null;

  return (
    <div className="binary-rain-overlay" aria-hidden>
      <div className="binary-rain-stack" style={styleLeft}>
        <BinaryRain leftColumns={10} rightColumns={0} />
      </div>
      <div className="binary-rain-stack" style={styleRight}>
        <BinaryRain leftColumns={0} rightColumns={10} />
      </div>
    </div>
  );
};

export default BinaryRainOverlay;


