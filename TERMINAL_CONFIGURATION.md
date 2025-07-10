# Terminal Configuration Guide

This guide explains how to configure various aspects of the terminal component.

## Typewriter Effect Speed Calibration

The typewriter effect speed can be easily adjusted in `src/config/terminalConfig.ts`:

### Configuration Options

- **`charDelay`**: Milliseconds between each character (default: 30ms)
- **`lineDelay`**: Milliseconds between lines (default: 150ms)

### Speed Presets

```typescript
// Very fast typing
typewriter: {
  charDelay: 10,    // 10ms between characters
  lineDelay: 50,    // 50ms between lines
}

// Fast typing
typewriter: {
  charDelay: 20,    // 20ms between characters
  lineDelay: 100,   // 100ms between lines
}

// Medium typing (current default)
typewriter: {
  charDelay: 30,    // 30ms between characters
  lineDelay: 150,   // 150ms between lines
}

// Slow typing
typewriter: {
  charDelay: 50,    // 50ms between characters
  lineDelay: 200,   // 200ms between lines
}

// Very slow typing
typewriter: {
  charDelay: 100,   // 100ms between characters
  lineDelay: 300,   // 300ms between lines
}
```

## Color Configuration

Colors are easily configurable in the same file:

### Available Color Elements
- **prompt**: Terminal prompt color (default: darker green)
- **error**: Error messages (default: red)
- **output**: Normal command output (default: white)
- **success**: Success messages (default: green)
- **warning**: Warning messages (default: yellow)
- **info**: Info messages (default: darker cyan)
- **rhino**: RHINO_ART ASCII art color (default: blue)

```typescript
colors: {
  prompt: '#3e8600',    // Darker green prompt
  error: '#ff0000',     // Red for errors
  output: '#ffffff',    // White for normal output
  success: '#00ff00',   // Green for success messages
  warning: '#ffff00',   // Yellow for warnings
  info: '#00b3b3',      // Darker cyan for info messages
  rhino: '#4a9eff',     // Blue for RHINO_ART
}
```

## Features Implemented

### ✅ Faster Typewriter Effect
- Reduced from 50ms to 10ms character delay
- Reduced from 200ms to 50ms line delay
- Easily configurable via `terminalConfig.ts`

### ✅ Colored RHINO_ART
- RHINO_ART ASCII art is now colored with configurable blue color
- Easily change the color via `terminalConfig.ts` colors.rhino

### ✅ Command History with Arrow Keys
- Up arrow: Navigate to previous commands
- Down arrow: Navigate to newer commands
- History is session-based (cleared on page refresh)
- Stored in component state

### ✅ Prompt Visibility Control
- Prompt is hidden during typewriter output
- User input is disabled during output
- Prompt and input restored when output completes

### ✅ Ctrl+C Interruption
- Press Ctrl+C to interrupt typewriter effect
- Immediately restores prompt and input field
- Clears any pending typewriter timeouts

### ✅ Color-Coded Syntax
- **Green**: Prompt and success messages
- **Red**: Error messages (command not found)
- **White**: Normal output
- **Yellow**: Warning messages
- **Darker Cyan**: Info messages
- **Blue**: RHINO_ART ASCII art
- All colors easily configurable in `terminalConfig.ts`

## How to Use

1. **Adjust Typewriter Speed**: Edit `src/config/terminalConfig.ts` and modify the `typewriter` section
2. **Change Colors**: Modify the `colors` section in the same file
3. **Test Changes**: Refresh the page to see your changes

## Technical Details

- Colors use ANSI escape codes for terminal compatibility
- Command history is stored in React state (session-only)
- Typewriter effect uses `setTimeout` with proper cleanup
- Ctrl+C detection uses character code 3
- All configuration is centralized in one file for easy maintenance 