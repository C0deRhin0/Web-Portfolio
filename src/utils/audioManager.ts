const AUDIO_VARIANTS = ['/sounds/key-press-1.mp3', '/sounds/key-press-2.mp3', '/sounds/key-press-3.mp3'];

let audioContext: AudioContext | null = null;
let audioBuffers: AudioBuffer[] = [];
let isLoading = false;

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
    return null;
  }
};

export const preloadKeyboardSounds = async (): Promise<void> => {
  if (isLoading || audioBuffers.length) {
    return;
  }

  const context = getAudioContext();
  if (!context) {
    return;
  }

  isLoading = true;
  const buffers = await Promise.all(AUDIO_VARIANTS.map((url) => loadAudioBuffer(context, url)));
  audioBuffers = buffers.filter((buffer): buffer is AudioBuffer => Boolean(buffer));
  isLoading = false;
};

export const playKeyboardSound = (): void => {
  const context = getAudioContext();
  if (!context || !audioBuffers.length) {
    return;
  }

  if (context.state === 'suspended') {
    context.resume().catch(() => undefined);
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
  }
};
