// Terminal configuration - easily customizable colors and settings
export const TERMINAL_CONFIG = {
  // Typewriter effect settings
  typewriter: {
    charDelay: 10, // Milliseconds between each character (was 50)
    lineDelay: 50, // Milliseconds between lines (was 200)
  },
  
  // Color scheme - easily configurable
  colors: {
    prompt: '#3e8600', // Darker green prompt
    error: '#ff0000', // Red for errors
    output: '#cfcfcf', // White for normal output
    //#ffffff //white
    success: '#00ff00', // Green for success messages
    warning: '#ffff00', // Yellow for warnings
    info: '#00b3b3', // Darker cyan for info messages
    rhino: '#0dbc79', // Blue for RHINO_ART
    //#4a9eff //cyan
  },
  
  // Terminal appearance
  appearance: {
    prompt: 'visitor@c0derhin0-wp.com:~$ ',
    backgroundColor: '#1e1e1e',
    foregroundColor: '#cfcfcf',
    cursorColor: '#cfcfcf',
  }
};

// How to calibrate typewriter speed:
// 1. charDelay: Lower = faster character typing (10-100ms recommended)
// 2. lineDelay: Lower = faster line transitions (50-300ms recommended)
// 
// Examples:
// - Very fast: charDelay: 10, lineDelay: 50
// - Fast: charDelay: 20, lineDelay: 100  
// - Medium: charDelay: 30, lineDelay: 150
// - Slow: charDelay: 50, lineDelay: 200
// - Very slow: charDelay: 100, lineDelay: 300 