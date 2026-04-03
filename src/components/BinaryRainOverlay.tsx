import React, { useEffect, useMemo, useRef, useState } from 'react';
import BinaryRain from './BinaryRain';

interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const SIDE_WIDTH_VW = 10;
const MAX_SIDE_WIDTH_VW = 15;
const SIDE_COLUMNS = 20;

const BinaryRainOverlay: React.FC = () => {
  const [rect, setRect] = useState<Rect | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);

  const updateRect = () => {
    const container = document.querySelector('.terminal-container > div:first-child') as HTMLElement | null;
    if (!container) return;
    const r = container.getBoundingClientRect();
    const left = Math.max(r.left, 0);
    const right = Math.min(r.right, window.innerWidth);
    const top = Math.max(r.top, 0);
    const bottom = Math.min(r.bottom, window.innerHeight);
    setRect({ top, bottom, left, right });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Initial measure
    updateRect();

    // Observe size changes of the terminal wrapper and window resizes
    const target = document.querySelector('.terminal-container > div:first-child') as HTMLElement | null;
    if (target && 'ResizeObserver' in window) {
      roRef.current = new ResizeObserver(() => updateRect());
      roRef.current.observe(target);
    }
    const onScroll = () => updateRect();
    const onResize = () => updateRect();
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
    const width = `var(--side-width, ${SIDE_WIDTH_VW}vw)`;
    return {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      width,
      maxWidth: `${MAX_SIDE_WIDTH_VW}vw`,
      '--side-width': `${SIDE_WIDTH_VW}vw`,
      pointerEvents: 'none'
    } as React.CSSProperties;
  }, [rect]);

  const styleRight = useMemo<React.CSSProperties>(() => {
    if (!rect) return { display: 'none' };
    const width = `var(--side-width, ${SIDE_WIDTH_VW}vw)`;
    return {
      position: 'fixed',
      top: 0,
      bottom: 0,
      right: 0,
      width,
      maxWidth: `${MAX_SIDE_WIDTH_VW}vw`,
      '--side-width': `${SIDE_WIDTH_VW}vw`,
      pointerEvents: 'none'
    } as React.CSSProperties;
  }, [rect]);

  if (!rect) return null;

  return (
    <div className="binary-rain-overlay" aria-hidden="true">
      <div className="binary-rain-stack" style={styleLeft}>
        <BinaryRain leftColumns={SIDE_COLUMNS} rightColumns={0} sideWidthVw={SIDE_WIDTH_VW} />
      </div>
      <div className="binary-rain-stack" style={styleRight}>
        <BinaryRain leftColumns={0} rightColumns={SIDE_COLUMNS} sideWidthVw={SIDE_WIDTH_VW} />
      </div>
    </div>
  );
};

export default BinaryRainOverlay;
