import React, { useEffect, useRef } from 'react';

interface BinaryRainProps {
  leftColumns?: number;
  rightColumns?: number;
  sideWidthVw?: number;
  pxPerSecond?: number;
  leftWidthPx?: number;
  rightWidthPx?: number;
}

interface Stream {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  bits: string[];
  nextChange: number;
}

/** A bounded number of staggered trails, drawn only in the terminal margins. */
const BinaryRain: React.FC<BinaryRainProps> = ({ leftColumns = 10, rightColumns = 10, sideWidthVw = 10, pxPerSecond = 58, leftWidthPx, rightWidthPx }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previous = 0;
    let width = 0;
    let height = 0;
    let streams: Stream[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const left = Math.max(0, Math.min(leftWidthPx ?? width * sideWidthVw / 100, width * 0.14));
      const right = Math.max(0, Math.min(rightWidthPx ?? width * sideWidthVw / 100, width * 0.14));
      streams = [];
      const addSide = (sideWidth: number, count: number, offset: number) => {
        const total = Math.max(0, Math.min(count, 12, Math.floor(sideWidth / 16)));
        for (let index = 0; index < total; index++) {
          const size = 11 + Math.floor(Math.random() * 4);
          const length = 9 + Math.floor(Math.random() * 13);
          streams.push({
            x: offset + (index + 0.5) * sideWidth / total,
            y: Math.random() * (height + length * size),
            size,
            speed: Math.max(24, pxPerSecond * (0.55 + Math.random() * 0.8)),
            opacity: 0.35 + Math.random() * 0.38,
            bits: Array.from({ length }, () => Math.random() > 0.5 ? '1' : '0'),
            nextChange: Math.random() * 800,
          });
        }
      };
      addSide(left, leftColumns, 0);
      addSide(right, rightColumns, width - right);
      canvas.dataset.streams = String(streams.length);
      canvas.dataset.leftWidth = String(Math.round(left));
      canvas.dataset.rightWidth = String(Math.round(right));
    };

    const draw = (now: number) => {
      frame = window.requestAnimationFrame(draw);
      if (previous && now - previous < 1000 / 30) return;
      const elapsed = previous ? Math.min((now - previous) / 1000, 0.1) : 0;
      previous = now;
      context.clearRect(0, 0, width, height);
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      for (const stream of streams) {
        stream.y += stream.speed * elapsed;
        if (stream.y - stream.bits.length * stream.size > height) {
          stream.y = -40 - Math.random() * 220;
          stream.speed = Math.max(24, pxPerSecond * (0.55 + Math.random() * 0.8));
        }
        if (now >= stream.nextChange) {
          stream.bits[Math.floor(Math.random() * stream.bits.length)] = Math.random() > 0.5 ? '1' : '0';
          stream.nextChange = now + 140 + Math.random() * 500;
        }
        context.font = `${stream.size}px ui-monospace, monospace`;
        for (let index = stream.bits.length - 1; index >= 0; index--) {
          const y = stream.y - index * stream.size * 1.12;
          if (y < -stream.size || y > height + stream.size) continue;
          const fade = Math.pow(1 - index / stream.bits.length, 1.4);
          context.fillStyle = index === 0 ? `rgba(176,255,214,${stream.opacity})` : `rgba(0,220,135,${fade * stream.opacity * 0.78})`;
          context.shadowColor = '#32e89b';
          context.shadowBlur = index === 0 ? 4 : 0;
          context.fillText(stream.bits[index], stream.x, y);
        }
      }
      context.shadowBlur = 0;
    };

    const updateMotion = () => {
      window.cancelAnimationFrame(frame);
      previous = 0;
      context.clearRect(0, 0, width, height);
      if (!preference.matches && !document.hidden && width > 768 && streams.length > 0) frame = window.requestAnimationFrame(draw);
    };
    const handleResize = () => { resize(); updateMotion(); };
    resize();
    updateMotion();
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', updateMotion);
    preference.addEventListener('change', updateMotion);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', updateMotion);
      preference.removeEventListener('change', updateMotion);
    };
  }, [leftColumns, rightColumns, sideWidthVw, pxPerSecond, leftWidthPx, rightWidthPx]);

  return <canvas className="binary-rain" ref={canvasRef} aria-hidden="true" />;
};

export default BinaryRain;
