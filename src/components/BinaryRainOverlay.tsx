import React, { useEffect, useState } from 'react';
import BinaryRain from './BinaryRain';

const BinaryRainOverlay: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const [margins, setMargins] = useState<{ left: number; right: number } | null>(null);

  useEffect(() => {
    if (!active) return;
    let target: Element | null = null;
    const measure = () => {
      target = document.querySelector('.terminal-container .xterm-wrapper');
      if (!target) return;
      const bounds = target.getBoundingClientRect();
      const next = { left: Math.max(0, bounds.left - 14), right: Math.max(0, window.innerWidth - bounds.right - 14) };
      setMargins((previous) => previous && Math.abs(previous.left - next.left) < 1 && Math.abs(previous.right - next.right) < 1 ? previous : next);
    };
    const observer = new ResizeObserver(measure);
    const discovery = new MutationObserver(() => {
      measure();
      if (target) { observer.observe(target); discovery.disconnect(); }
    });
    measure();
    if (target) observer.observe(target);
    else discovery.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      discovery.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [active]);

  if (!active || !margins) return null;
  return <div className="binary-rain-overlay" aria-hidden="true"><BinaryRain leftWidthPx={margins.left} rightWidthPx={margins.right} /></div>;
};

export default BinaryRainOverlay;
