export interface VisualEffectsSettings {
  crtEnabled: boolean;
  glitchEnabled: boolean;
}

const STORAGE_KEY = 'terminalVisualEffects';

const DEFAULT_SETTINGS: VisualEffectsSettings = {
  crtEnabled: true,
  glitchEnabled: true
};

export const loadVisualEffectsSettings = (): VisualEffectsSettings => {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(stored) as Partial<VisualEffectsSettings>;
    return {
      crtEnabled: typeof parsed.crtEnabled === 'boolean' ? parsed.crtEnabled : DEFAULT_SETTINGS.crtEnabled,
      glitchEnabled: typeof parsed.glitchEnabled === 'boolean' ? parsed.glitchEnabled : DEFAULT_SETTINGS.glitchEnabled
    };
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
};

export const saveVisualEffectsSettings = (settings: VisualEffectsSettings): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    // Ignore persistence errors
  }
};
