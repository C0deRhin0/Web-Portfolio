import { useEffect, useMemo, useState } from 'react';
import { closeAudioContext, playKeyboardSound, preloadKeyboardSounds } from '../utils/audioManager';

const STORAGE_KEY = 'terminalKeyboardSounds';

const getInitialSetting = (): boolean => {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      return true;
    }
    return stored === 'true';
  } catch (error) {
    return true;
  }
};

export const useKeyboardSounds = () => {
  const [enabled, setEnabled] = useState(getInitialSetting);

  useEffect(() => {
    preloadKeyboardSounds();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
    } catch (error) {
      // Ignore persistence errors
    }
  }, [enabled]);

  useEffect(() => () => closeAudioContext(), []);

  const play = useMemo(() => {
    if (!enabled) {
      return () => undefined;
    }
    return () => playKeyboardSound();
  }, [enabled]);

  return {
    enabled,
    setEnabled,
    play
  };
};
