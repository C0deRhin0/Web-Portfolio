const AUDIO_VARIANTS: string[] = [];

let audioContext: AudioContext | null = null;
let audioBuffers: AudioBuffer[] = [];
let isLoading = false;
let attemptedPreload = false;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const AudioContextRef = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextRef) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextRef();
  }

  return audioContext;
};

const loadAudioBuffer = async (context: AudioContext, url: string): Promise<AudioBuffer | null> => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await context.decodeAudioData(arrayBuffer);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to load audio buffer:', url, error);
    }
    return null;
  }
};

export const preloadKeyboardSounds = async (): Promise<void> => {
  if (!AUDIO_VARIANTS.length || isLoading || audioBuffers.length || attemptedPreload) {
    return;
  }

  const context = getAudioContext();
  if (!context) {
    return;
  }

  attemptedPreload = true;
  isLoading = true;
  const buffers = await Promise.all(AUDIO_VARIANTS.map((url) => loadAudioBuffer(context, url)));
  audioBuffers = buffers.filter((buffer): buffer is AudioBuffer => Boolean(buffer));
  isLoading = false;
};

const playSyntheticKeyboardClick = (context: AudioContext): void => {
  const duration = 0.018 + Math.random() * 0.012;
  const sampleRate = context.sampleRate;
  const frameCount = Math.floor(sampleRate * duration);
  const buffer = context.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    const progress = index / frameCount;
    const envelope = Math.pow(1 - progress, 4);
    data[index] = (Math.random() * 2 - 1) * envelope;
  }

  const filter = context.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1800 + Math.random() * 900;
  filter.Q.value = 1.2;

  const gainNode = context.createGain();
  gainNode.gain.value = 0.18;

  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);
  source.start(0);
};

export const playKeyboardSound = (): void => {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  if (context.state === 'suspended') {
    context.resume().catch(() => undefined);
  }

  if (!audioBuffers.length) {
    playSyntheticKeyboardClick(context);
    return;
  }

  const gainNode = context.createGain();
  gainNode.gain.value = 0.4;

  const buffer = audioBuffers[Math.floor(Math.random() * audioBuffers.length)];
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(gainNode);
  gainNode.connect(context.destination);
  source.start(0);
};

export const closeAudioContext = (): void => {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
    audioBuffers = [];
    attemptedPreload = false;
  }
};
