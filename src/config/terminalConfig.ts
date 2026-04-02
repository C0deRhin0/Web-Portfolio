// Terminal configuration - easily customizable colors and settings
export const TERMINAL_CONFIG = {
  // Typewriter effect settings
  typewriter: {
    charDelay: 5, // Milliseconds between each character (was 50)
    lineDelay: 20, // Milliseconds between lines (was 200)
  },
  
  // Terminal appearance and host defaults
  appearance: {
    host: 'visitor',
    defaultDirectory: 'c0derhin0-wp.com',
  },

  // Theme definitions
  themes: {
    '1': {
      name: 'Classic Hacker',
      background: '#1e1e1e',
      foreground: '#cfcfcf',
      cursor: '#cfcfcf',
      host: '#daa520',
      directory: '#3e8600',
      error: '#b02b01',
      output: '#cfcfcf',
      success: '#00ff00',
      warning: '#ffff00',
      info: '#00b3b3',
      rhino: '#0dbc79',
      binaryRain: '#00ff9c',
      ansi: {
        black: '#000000',
        red: '#b02b01',          // Error
        green: '#3e8600',        // Directory
        yellow: '#e5e510',       // Warning
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#00b3b3',         // Info
        white: '#cfcfcf',        // Normal Output
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#0dbc79',  // Rhino & Success
        brightYellow: '#daa520', // Host
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#cfcfcf'   // Foreground / Separators
      }
    },
    '2': {
      name: 'Cyberpunk Neon',
      background: '#0d0221',
      foreground: '#f4f4f9',
      cursor: '#ff0055',
      host: '#ff0055',
      directory: '#00f5d4',
      error: '#ff5400',
      output: '#f4f4f9',
      success: '#70e000',
      warning: '#fee440',
      info: '#9d4edd',
      rhino: '#ff0055',
      binaryRain: '#ff0055',
      ansi: {
        black: '#0d0221',
        red: '#ff5400',          // Error
        green: '#00f5d4',        // Directory
        yellow: '#fee440',       // Warning
        blue: '#9d4edd',
        magenta: '#ff0055',
        cyan: '#9d4edd',         // Info
        white: '#f4f4f9',        // Normal Output
        brightBlack: '#5a189a',
        brightRed: '#ff0055',
        brightGreen: '#ff0055',  // Rhino & Success (Pink)
        brightYellow: '#ff0055', // Host
        brightBlue: '#c77dff',
        brightMagenta: '#ff0055',
        brightCyan: '#00f5d4',
        brightWhite: '#f4f4f9'   // Foreground / Separators
      }
    },
    '3': {
      name: 'Nord Ice',
      background: '#2e3440',
      foreground: '#d8dee9',
      cursor: '#88c0d0',
      host: '#81a1c1',
      directory: '#8fbcbb',
      error: '#bf616a',
      output: '#d8dee9',
      success: '#a3be8c',
      warning: '#ebcb8b',
      info: '#b48ead',
      rhino: '#88c0d0',
      binaryRain: '#88c0d0',
      ansi: {
        black: '#3b4252',
        red: '#bf616a',          // Error
        green: '#8fbcbb',        // Directory
        yellow: '#ebcb8b',       // Warning
        blue: '#81a1c1',
        magenta: '#b48ead',
        cyan: '#b48ead',         // Info
        white: '#d8dee9',        // Normal Output
        brightBlack: '#4c566a',
        brightRed: '#bf616a',
        brightGreen: '#88c0d0',  // Rhino & Success
        brightYellow: '#81a1c1', // Host
        brightBlue: '#81a1c1',
        brightMagenta: '#b48ead',
        brightCyan: '#88c0d0',
        brightWhite: '#d8dee9'   // Foreground / Separators
      }
    }
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