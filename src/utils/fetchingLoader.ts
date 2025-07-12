interface FetchingLoaderOptions {
  duration?: number; // Total duration in milliseconds (default: 2000ms)
  charInterval?: number; // Character change interval in milliseconds (default: 300ms)
  onComplete?: () => void; // Callback to execute after loading completes
}

interface FetchingLoaderReturn {
  start: () => void;
  stop: () => void;
}

const SPINNING_CHARS = ['|', '/', '-', '\\'];
const DEFAULT_DURATION = 2000; // 2 seconds
const DEFAULT_CHAR_INTERVAL = 300; // 0.3 seconds

// Helper function to get colored text for terminal output
const getColoredFetchingText = (spinningChar: string): string => {
  // Color codes: #cfcfcf for "fetching", #dda520 for spinning character
  return `\x1b[38;2;207;207;207mfetching \x1b[38;2;221;165;32m${spinningChar}\x1b[0m`;
};

export const createFetchingLoader = (
  writeFunction: (text: string) => void,
  options: FetchingLoaderOptions = {}
): FetchingLoaderReturn => {
  const {
    duration = DEFAULT_DURATION,
    charInterval = DEFAULT_CHAR_INTERVAL,
    onComplete
  } = options;

  let charIndex = 0;
  let isRunning = false;
  let charIntervalId: NodeJS.Timeout | null = null;
  let completionTimeoutId: NodeJS.Timeout | null = null;

  const clearCurrentLine = () => {
    // Clear the current line by writing backspaces
    writeFunction('\r');
    writeFunction(' '.repeat(20)); // Clear with spaces
    writeFunction('\r');
  };

  const updateSpinningChar = () => {
    if (!isRunning) return;
    
    clearCurrentLine();
    const spinningChar = SPINNING_CHARS[charIndex];
    const coloredText = getColoredFetchingText(spinningChar);
    writeFunction(coloredText);
    
    charIndex = (charIndex + 1) % SPINNING_CHARS.length;
  };

  const start = () => {
    if (isRunning) return;
    
    isRunning = true;
    charIndex = 0;
    
    // Start the spinning character animation
    updateSpinningChar();
    charIntervalId = setInterval(updateSpinningChar, charInterval);
    
    // Set completion timeout
    completionTimeoutId = setTimeout(() => {
      stop();
      if (onComplete) {
        onComplete();
      }
    }, duration);
  };

  const stop = () => {
    if (!isRunning) return;
    
    isRunning = false;
    
    if (charIntervalId) {
      clearInterval(charIntervalId);
      charIntervalId = null;
    }
    
    if (completionTimeoutId) {
      clearTimeout(completionTimeoutId);
      completionTimeoutId = null;
    }
    
    clearCurrentLine();
  };

  return { start, stop };
};

// Export the helper function for external use
export { getColoredFetchingText }; 