import React from 'react';

interface CRTEffectProps {
  enabled: boolean;
}

const CRTEffect: React.FC<CRTEffectProps> = ({ enabled }) => {
  if (!enabled) {
    return null;
  }

  return (
    <div className="crt-overlay" aria-hidden="true">
      <div className="crt-overlay__scanlines" />
      <div className="crt-overlay__flicker" />
      <div className="crt-overlay__vignette" />
    </div>
  );
};

export default CRTEffect;
