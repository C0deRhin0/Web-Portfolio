import React, { useEffect, useState } from 'react';

type GlitchIntensity = 'subtle' | 'normal' | 'intense';

interface GlitchEffectProps {
  triggerKey: number;
  enabled: boolean;
  intensity?: GlitchIntensity;
  children: React.ReactNode;
}

const GlitchEffect: React.FC<GlitchEffectProps> = ({
  triggerKey,
  enabled,
  intensity = 'normal',
  children
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    setIsGlitching(true);
    const timeout = setTimeout(() => setIsGlitching(false), 400);
    return () => clearTimeout(timeout);
  }, [triggerKey, enabled]);

  const glitchClass = isGlitching ? `glitch glitch--${intensity}` : '';

  return (
    <div className={glitchClass} data-glitch={isGlitching ? 'on' : 'off'}>
      {children}
    </div>
  );
};

export default GlitchEffect;
