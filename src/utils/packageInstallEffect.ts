interface PackageInstallOptions {
  onComplete?: () => void;
  onAudioPlay?: () => void;
}

interface PackageInstallReturn {
  start: (lines: string[], writeFunction: (text: string) => void) => void;
  stop: () => void;
}

export const createPackageInstallEffect = (
  options: PackageInstallOptions = {}
): PackageInstallReturn => {
  const { onComplete, onAudioPlay } = options;
  
  let isRunning = false;
  let timeoutId: NodeJS.Timeout | null = null;

  const getLineDelay = (line: string, index: number): number => {
    // Different delays for different types of lines to mimic real package installation
    if (line.includes('Reading package lists') || line.includes('Building dependency tree')) {
      return 100; // Fast for initial setup
    } else if (line.includes('Get:')) {
      return 50; // Very fast for download progress
    } else if (line.includes('Fetched')) {
      return 200; // Medium for summary
    } else if (line.includes('Selecting') || line.includes('Preparing')) {
      return 80; // Fast for package selection
    } else if (line.includes('Unpacking')) {
      return 120; // Medium-fast for unpacking
    } else if (line.includes('Setting up')) {
      return 150; // Medium for setup
    } else if (line.includes('Processing triggers')) {
      return 100; // Fast for triggers
    } else if (line.includes('Installation done')) {
      return 500; // Slower for final message
    } else {
      return 100; // Default speed
    }
  };

  const start = (lines: string[], writeFunction: (text: string) => void) => {
    if (isRunning) return;
    
    isRunning = true;
    let currentIndex = 0;
    
    const displayNextLine = () => {
      if (!isRunning || currentIndex >= lines.length) {
        isRunning = false;
        if (onComplete) {
          onComplete();
        }
        return;
      }
      
      const line = lines[currentIndex];
      const delay = getLineDelay(line, currentIndex);
      
      // Write the line with a newline
      writeFunction(line + '\n');
      
      currentIndex++;
      
      // Schedule next line
      timeoutId = setTimeout(displayNextLine, delay);
    };
    
    // Start the effect
    displayNextLine();
  };

  const stop = () => {
    isRunning = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return { start, stop };
};

// Audio player utility
export const playAudio = (audioPath: string, loop: boolean = false) => {
  try {
    const audio = new Audio(audioPath);
    audio.loop = loop;
    audio.play().catch(error => {
      console.warn('Audio playback failed:', error);
    });
    return audio;
  } catch (error) {
    console.warn('Audio creation failed:', error);
    return null;
  }
}; 