import React, { useEffect } from 'react';

interface JumpscareOverlayProps {
  onComplete: () => void;
}

const JumpscareOverlay: React.FC<JumpscareOverlayProps> = ({ onComplete }) => {
  useEffect(() => {
    const timeout = setTimeout(() => onComplete(), 1400);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="jumpscare-overlay" aria-hidden="true">
      <div className="jumpscare-overlay__message">ACCESS VIOLATION</div>
      <div className="jumpscare-overlay__subtext">TERMINAL INTEGRITY BREACHED</div>
    </div>
  );
};

export default JumpscareOverlay;
