import React, { useEffect, useMemo, useRef, useState } from 'react';
import commandsData from '../data/commands.json';
import whoamiExtra from '../data/whoami.extra.json';
import { TERMINAL_CONFIG } from '../config/terminalConfig';
import SubTerminal from './SubTerminal';
import { createFetchingLoader } from '../utils/fetchingLoader';
import { createClearingLoader } from '../utils/clearingLoader';
import { RHINO_ART } from './RhinoArt';
import TerminalTooltip from './TerminalTooltip';
import { tokenizeCommandInput } from '../utils/commandParsing';
import { getCommonPrefix, getCompletionCandidates } from '../utils/commandCompletion';
import CRTEffect from './effects/CRTEffect';
import GlitchEffect from './effects/GlitchEffect';
import { useKeyboardSounds } from '../hooks/useKeyboardSounds';
import { loadVisualEffectsSettings, saveVisualEffectsSettings } from '../utils/visualEffectsStorage';
import JumpscareOverlay from './JumpscareOverlay';
import { buildSystemMonitorLines, createSystemSnapshot } from '../utils/systemMonitor';
import { createTerminalCommandHandlers } from './terminal/terminalCommandHandlers';


/**
 * Main Terminal component that handles the interactive terminal interface
 * Integrates xterm.js with custom command processing and typewriter effects
 */
const Terminal: React.FC = () => {
  const MAX_HISTORY_LENGTH = 500;
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);
  // Command history and input buffer management
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1); // -1 means not navigating
  const currentLineBuffer = useRef<string>('');
  const ghostSuggestionRef = useRef<string>('');
  const ghostRenderedLengthRef = useRef<number>(0);
  const cursorIndexRef = useRef<number>(0);
  const isTypingRef = useRef<boolean>(false); // Use ref for event handler access
  const isFetchingRef = useRef<boolean>(false); // Use ref for fetching state
  const isClearingRef = useRef<boolean>(false); // Use ref for clearing state
  const currentDirectoryRef = useRef<string>(TERMINAL_CONFIG.appearance.defaultDirectory); // Use ref for prompt access
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [typewriterTimeout, setTypewriterTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentDirectory, setCurrentDirectory] = useState(TERMINAL_CONFIG.appearance.defaultDirectory);
  const [subTerminalVisible, setSubTerminalVisible] = useState(false);
  const [subTerminalFile, setSubTerminalFile] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const fetchingLoaderRef = useRef<any>(null);
  const clearingLoaderRef = useRef<any>(null);
  const pendingCommandRef = useRef<{ command: string; type: string; param?: string } | null>(null);
  const [asciiEnabled, setAsciiEnabled] = useState(true); // New state for ascii art
  const [currentTheme, setCurrentTheme] = useState('1'); // Theme state: '1', '2', or '3'
  const asciiEnabledRef = useRef(asciiEnabled); // Ref to always have latest value
  const currentThemeRef = useRef(currentTheme); // Ref for event handlers
  const prevAsciiEnabledRef = useRef(asciiEnabled); // Track previous value for effect
  const projectLinksProviderRef = useRef<any>(null);
  const globalLinkMeta = useRef<Array<{
    y: number;
    start: number;
    end: number;
    url: string;
    text: string;
  }>>([]);
  const globalLinkProviderRef = useRef<any>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [glitchTriggerKey, setGlitchTriggerKey] = useState(0);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [glitchEnabled, setGlitchEnabled] = useState(true);
  const { enabled: keyboardSoundsEnabled, setEnabled: setKeyboardSoundsEnabled, play: playKeyboardSound } = useKeyboardSounds();
  const crtEnabledRef = useRef(true);
  const glitchEnabledRef = useRef(true);
  const keyboardSoundsEnabledRef = useRef(true);
  const [showJumpscare, setShowJumpscare] = useState(false);
  const [matrixEnabled, setMatrixEnabled] = useState(false);

  const availableCommands = useMemo(() => {
    const commandList = (commandsData as any[])
      .map((item) => item.cmd)
      .filter((cmd) => typeof cmd === 'string') as string[];
    const baseCommands = [
      'cd',
      'ls',
      'ls -a',
      'pwd',
      'run',
      'clear',
      'help',
      'ascii',
      'theme',
      'effects',
      'effects crt',
      'effects glitch',
      'effects sounds',
      'effects crt on',
      'effects crt off',
      'effects glitch on',
      'effects glitch off',
      'effects sounds on',
      'effects sounds off',
      'neofetch',
      'screenfetch',
      'top',
      'htop',
      'sudo',
      'matrix',
      'matrix --init'
    ];
    const deduped = Array.from(new Set([...commandList, ...baseCommands]));

    return deduped;
  }, []);

  const clearGhostSuggestion = () => {
    if (!xtermRef.current) return;
    const ghostLength = ghostRenderedLengthRef.current;
    if (!ghostLength) {
      return;
    }

    const hideCursor = '\x1b[?25l';
    const showCursor = '\x1b[?25h';
    const moveLeft = `\x1b[${ghostLength}D`;
    xtermRef.current.write(`${hideCursor}${' '.repeat(ghostLength)}${moveLeft}${showCursor}`);
    ghostRenderedLengthRef.current = 0;
  };

  const updateGhostSuggestion = () => {
    if (!xtermRef.current) return;

    ghostSuggestionRef.current = '';
    const currentInput = currentLineBuffer.current.trim();
    if (!currentInput) {
      return;
    }

    const candidates = getCompletionCandidates(availableCommands, currentInput);
    if (!candidates.length) {
      return;
    }

    const commonPrefix = getCommonPrefix(candidates);
    if (!commonPrefix || commonPrefix === currentInput) {
      return;
    }

    const remainingText = commonPrefix.slice(currentInput.length);
    if (!remainingText) {
      return;
    }

    ghostSuggestionRef.current = remainingText;
  };

  const handleEnterKey = () => {
    if (!xtermRef.current) return;
    clearGhostSuggestion();
    ghostSuggestionRef.current = '';
    ghostRenderedLengthRef.current = 0;
    xtermRef.current.write('\r\n');
    handleCommand(currentLineBuffer.current.trim());
    historyIndex.current = commandHistory.current.length;
    currentLineBuffer.current = '';
    cursorIndexRef.current = 0;
    clearGhostSuggestion();
  };

  const handleBackspaceKey = () => {
    if (!xtermRef.current) return;
    if (cursorIndexRef.current > 0) {
      clearGhostSuggestion();
      const removeIndex = cursorIndexRef.current - 1;
      const before = currentLineBuffer.current.slice(0, removeIndex);
      const after = currentLineBuffer.current.slice(cursorIndexRef.current);
      currentLineBuffer.current = `${before}${after}`;
      cursorIndexRef.current = removeIndex;
      xtermRef.current.write('\b');
      xtermRef.current.write(`${after} `);
      if (after.length > 0) {
        xtermRef.current.write(`\x1b[${after.length + 1}D`);
      } else {
        xtermRef.current.write('\b');
      }
      updateGhostIfAtEnd();
    }
  };

  const handleTabKey = (domEvent: KeyboardEvent) => {
    if (!xtermRef.current) return;
    domEvent.preventDefault();
    clearGhostSuggestion();
    if (currentLineBuffer.current.trim().length === 0) {
      return;
    }
    const trimmedInput = currentLineBuffer.current.trim();
    if (currentLineBuffer.current.includes(' ') && !trimmedInput.startsWith('effects ')) {
      return;
    }
    ghostSuggestionRef.current = '';
    const currentInput = trimmedInput;
    const candidates = getCompletionCandidates(availableCommands, currentInput);
    if (!candidates.length) {
      return;
    }
    const commonPrefix = getCommonPrefix(candidates);
    if (commonPrefix && commonPrefix.length > currentInput.length) {
      for (let index = 0; index < currentLineBuffer.current.length; index += 1) {
        xtermRef.current.write('\b \b');
      }
      currentLineBuffer.current = commonPrefix;
      cursorIndexRef.current = commonPrefix.length;
      xtermRef.current.write(commonPrefix);
      updateGhostIfAtEnd();
      return;
    }
    if (candidates.length > 1) {
      xtermRef.current.write('\r\n');
      displayCommandOutput(candidates, 'info');
    }
  };

  const handleHistoryNavigation = (direction: 'up' | 'down') => {
    if (!xtermRef.current || !commandHistory.current.length) {
      return;
    }
    clearGhostSuggestion();
    for (let i = 0; i < currentLineBuffer.current.length; i++) {
      xtermRef.current.write('\b \b');
    }

    if (direction === 'up') {
      if (historyIndex.current > 0) {
        historyIndex.current -= 1;
      }
      currentLineBuffer.current = commandHistory.current[historyIndex.current] || '';
      cursorIndexRef.current = currentLineBuffer.current.length;
      xtermRef.current.write(currentLineBuffer.current);
      updateGhostIfAtEnd();
      return;
    }

    if (historyIndex.current < commandHistory.current.length - 1) {
      historyIndex.current += 1;
      currentLineBuffer.current = commandHistory.current[historyIndex.current] || '';
      xtermRef.current.write(currentLineBuffer.current);
      cursorIndexRef.current = currentLineBuffer.current.length;
    } else {
      historyIndex.current = commandHistory.current.length;
      currentLineBuffer.current = '';
      cursorIndexRef.current = 0;
    }
    updateGhostIfAtEnd();
  };

  const handleArrowLeftKey = () => {
    if (!xtermRef.current) return;
    if (cursorIndexRef.current > 0) {
      clearGhostSuggestion();
      cursorIndexRef.current -= 1;
      xtermRef.current.write('\x1b[D');
    }
  };

  const handleArrowRightKey = () => {
    if (!xtermRef.current) return;
    if (cursorIndexRef.current < currentLineBuffer.current.length) {
      clearGhostSuggestion();
      cursorIndexRef.current += 1;
      xtermRef.current.write('\x1b[C');
      updateGhostIfAtEnd();
    }
  };

  const handlePrintableKey = (key: string, domEvent: KeyboardEvent) => {
    if (!xtermRef.current) return;
    const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
    if (!printable || domEvent.key.length !== 1) {
      return;
    }
    clearGhostSuggestion();
    const before = currentLineBuffer.current.slice(0, cursorIndexRef.current);
    const after = currentLineBuffer.current.slice(cursorIndexRef.current);
    currentLineBuffer.current = `${before}${key}${after}`;
    cursorIndexRef.current += 1;
    xtermRef.current.write(key + after);
    if (after.length > 0) {
      xtermRef.current.write(`\x1b[${after.length}D`);
    }
    updateGhostIfAtEnd();
    const viewport = xtermRef.current.element?.querySelector('.xterm-viewport');
    if (viewport && viewport.scrollTop + viewport.clientHeight < viewport.scrollHeight - 2) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  };

  const updateGhostIfAtEnd = () => {
    if (cursorIndexRef.current !== currentLineBuffer.current.length) {
      return;
    }
    updateGhostSuggestion();
    renderGhostSuggestion();
  };

  const renderGhostSuggestion = () => {
    if (!xtermRef.current) return;
    const suggestion = ghostSuggestionRef.current;
    clearGhostSuggestion();
    if (!suggestion) {
      return;
    }

    const hideCursor = '\x1b[?25l';
    const showCursor = '\x1b[?25h';
    const dimColor = '\x1b[90m';
    const resetColor = '\x1b[0m';
    const moveLeft = `\x1b[${suggestion.length}D`;
    xtermRef.current.write(`${hideCursor}${dimColor}${suggestion}${resetColor}${moveLeft}${showCursor}`);
    ghostRenderedLengthRef.current = suggestion.length;
  };

  const handleTerminalInitializationError = (error: unknown) => {
    console.error('Failed to initialize terminal:', error);
    if (terminalRef.current) {
      terminalRef.current.innerHTML = `
        <div style="color: #ff5555; padding: 16px; font-family: Source Code Pro, monospace;">
          Terminal initialization failed. Please refresh the page.
          If the problem persists, try clearing your browser cache.
        </div>
      `;
    }
  };

  useEffect(() => {
    asciiEnabledRef.current = asciiEnabled;
  }, [asciiEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedTheme = window.localStorage.getItem('terminalTheme');
      if (storedTheme === '1' || storedTheme === '2' || storedTheme === '3') {
        setCurrentTheme(storedTheme);
      }
    } catch (error) {
      // Ignore persistence errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const settings = loadVisualEffectsSettings();
    setCrtEnabled(settings.crtEnabled);
    setGlitchEnabled(settings.glitchEnabled);
  }, []);

  useEffect(() => {
    crtEnabledRef.current = crtEnabled;
  }, [crtEnabled]);

  useEffect(() => {
    glitchEnabledRef.current = glitchEnabled;
  }, [glitchEnabled]);

  useEffect(() => {
    keyboardSoundsEnabledRef.current = keyboardSoundsEnabled;
  }, [keyboardSoundsEnabled]);

  useEffect(() => {
    currentThemeRef.current = currentTheme;
    
    // Update xterm theme if initialized
    if (xtermRef.current) {
      const theme = (TERMINAL_CONFIG as any).themes[currentTheme];
      xtermRef.current.options.theme = {
        background: theme.background,
        foreground: theme.foreground,
        cursor: theme.cursor,
        ...theme.ansi
      };
    }
    
    // Update CSS variables for other UI elements
    if (typeof document !== 'undefined') {
      const theme = (TERMINAL_CONFIG as any).themes[currentTheme];
      const root = document.documentElement;
      root.style.setProperty('--terminal-bg', theme.background);
      root.style.setProperty('--terminal-fg', theme.foreground);
      root.style.setProperty('--binary-rain-color', theme.binaryRain);
      root.style.setProperty('--rhino-art-color', theme.ansi.brightGreen || theme.foreground);
      root.style.setProperty('--scrollbar-thumb', theme.ansi.brightBlack); // Using brightBlack as a neutral scrollbar color
      root.style.setProperty('--scrollbar-track', theme.background);
    }

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('terminalTheme', currentTheme);
      } catch (error) {
        // Ignore persistence errors
      }
    }

    setGlitchTriggerKey((prev) => prev + 1);
  }, [currentTheme]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    if (matrixEnabled) {
      root.classList.add('matrix-mode');
      root.style.setProperty('--binary-rain-color', '#00ff41');
      root.style.setProperty('--terminal-fg', '#7dff9f');
    } else {
      root.classList.remove('matrix-mode');
    }
  }, [matrixEnabled]);

  // Initialize fetching loader when terminal is ready
  useEffect(() => {
    if (xtermRef.current && !fetchingLoaderRef.current) {
      fetchingLoaderRef.current = createFetchingLoader(
        (text: string) => {
          if (xtermRef.current) {
            xtermRef.current.write(text);
          }
        },
        {
          duration: 2000, // 2 seconds
          charInterval: 50, // 0.3 seconds
          onComplete: () => {
            isFetchingRef.current = false;
            setIsFetching(false);
            // Continue with command output after fetching completes
            if (pendingCommandRef.current) {
              executePendingCommand();
            }
          }
        }
      );
    }
  }, [xtermRef.current]);

  // Initialize clearing loader when terminal is ready
  useEffect(() => {
    if (xtermRef.current && !clearingLoaderRef.current) {
      clearingLoaderRef.current = createClearingLoader(
        (text: string) => {
          if (xtermRef.current) {
            xtermRef.current.write(text);
          }
        },
        {
          duration: 2000, // 2 seconds
          charInterval: 50, // 0.3 seconds
          onComplete: () => {
            isClearingRef.current = false;
            setIsClearing(false);
            // Use the latest value of asciiEnabled
            clearTerminal(asciiEnabledRef.current);
          }
        }
      );
    }
  }, [xtermRef.current]);

  // Initialize xterm.js terminal - only once
  useEffect(() => {
    // Only run on client and if not already initialized
    if (typeof window === 'undefined' || !terminalRef.current || isInitialized) return;

    let Terminal: any, FitAddon: any;
    let terminal: any, fitAddon: any;

    (async () => {
      try {
        const xtermPkg = await import('xterm');
        const fitPkg = await import('xterm-addon-fit');
        await import('xterm/css/xterm.css');
        Terminal = xtermPkg.Terminal;
        FitAddon = fitPkg.FitAddon;

        const initialTheme = (TERMINAL_CONFIG as any).themes[currentThemeRef.current];
        terminal = new Terminal({
          cursorBlink: true,
          theme: {
            background: initialTheme.background,
            foreground: initialTheme.foreground,
            cursor: initialTheme.cursor,
            ...initialTheme.ansi
          },
          fontFamily: 'Source Code Pro, monospace',
          fontSize: 14,
          lineHeight: 1.0,
          scrollback: 1000,
          cols: 200, // Terminal width set to 80 columns
          rows: 24,
          convertEol: false, // Disable automatic line wrapping
          allowTransparency: true,
          scrollOnUserInput: false, // Prevent auto-scroll on input
          scrollSensitivity: 1,
          fastScrollModifier: 'alt',
          fastScrollSensitivity: 5,
          rightClickSelectsWord: false,
          macOptionIsMeta: true
        });

        fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(terminalRef.current);
        
        // Fit the terminal to the container and enforce column limit
        const customFit = () => {
          fitAddon.fit();
        };
        
        customFit();

        // Store references
        xtermRef.current = terminal;
        fitAddonRef.current = fitAddon;
        setIsInitialized(true);

        const storedHistory = (() => {
          try {
            const rawHistory = window.localStorage.getItem('terminalCommandHistory');
            if (!rawHistory) {
              return [] as string[];
            }
            const parsedHistory = JSON.parse(rawHistory);
            const isStringArray = Array.isArray(parsedHistory)
              && parsedHistory.every((item) => typeof item === 'string');
            return isStringArray ? parsedHistory : [];
          } catch (error) {
            return [] as string[];
          }
        })();

        commandHistory.current = storedHistory;
        historyIndex.current = storedHistory.length;

        // Print banner and welcome
        printBannerAndWelcome();
        writePrompt();

        // Handle window resize with custom fit
        const handleResize = () => customFit();
        window.addEventListener('resize', handleResize);

        // Handle terminal input
        terminal.onKey(({ key, domEvent }: any) => {
          if (isTypingRef.current || isFetchingRef.current || isClearingRef.current) {
            return;
          }

          if (keyboardSoundsEnabledRef.current) {
            playKeyboardSound();
          }

          switch (domEvent.key) {
            case 'Enter':
              handleEnterKey();
              break;
            case 'Backspace':
              handleBackspaceKey();
              break;
            case 'Tab':
              handleTabKey(domEvent);
              break;
            case 'ArrowUp':
              handleHistoryNavigation('up');
              break;
            case 'ArrowDown':
              handleHistoryNavigation('down');
              break;
            case 'ArrowLeft':
              handleArrowLeftKey();
              break;
            case 'ArrowRight':
              handleArrowRightKey();
              break;
            default:
              handlePrintableKey(key, domEvent);
          }
        });

        // Cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          if (terminal && !terminal.disposed) {
            terminal.dispose();
          }
        };
      } catch (error) {
        handleTerminalInitializationError(error);
      }
    })();
  }, [isInitialized]); // Only depend on isInitialized

  // Interrupt typewriter effect
  const interruptTypewriter = () => {
    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
      setTypewriterTimeout(null);
    }
    isTypingRef.current = false;
    setIsTyping(false);
    if (xtermRef.current) {
      xtermRef.current.write('\r\n');
      writePrompt();
    }
  };


  const {
    printBannerAndWelcome,
    writePrompt,
    clearTerminal,
    displayCommandOutput,
    executePendingCommand,
    handleCommand
  } = createTerminalCommandHandlers({
    asciiEnabled,
    asciiEnabledRef,
    commandHistory,
    commandsData: commandsData as any[],
    crtEnabled,
    crtEnabledRef,
    currentDirectoryRef,
    currentThemeRef,
    fetchingLoaderRef,
    clearingLoaderRef,
    glitchEnabled,
    glitchEnabledRef,
    globalLinkMeta,
    globalLinkProviderRef,
    historyIndex,
    isClearingRef,
    isFetchingRef,
    isTypingRef,
    keyboardSoundsEnabled,
    keyboardSoundsEnabledRef,
    maxHistoryLength: MAX_HISTORY_LENGTH,
    pendingCommandRef,
    projectLinksProviderRef,
    setAsciiEnabled,
    setCrtEnabled,
    setCurrentDirectory,
    setCurrentTheme,
    setGlitchEnabled,
    setGlitchTriggerKey,
    setIsClearing,
    setIsFetching,
    setIsTyping,
    setKeyboardSoundsEnabled,
    setMatrixEnabled,
    setShowJumpscare,
    setSubTerminalFile,
    setSubTerminalVisible,
    setTooltip,
    setTypewriterTimeout,
    typewriterTimeout,
    whoamiExtra,
    xtermRef,
    buildSystemMonitorLines,
    createSystemSnapshot,
    saveVisualEffectsSettings,
    tokenizeCommandInput
  });

  useEffect(() => {
    if (isInitialized && prevAsciiEnabledRef.current !== asciiEnabled) {
      clearTerminal(asciiEnabled);
    }
    prevAsciiEnabledRef.current = asciiEnabled;
  }, [asciiEnabled, clearTerminal, isInitialized]);

  const rhinoArtText = RHINO_ART.join('\n');

  return (
    <GlitchEffect triggerKey={glitchTriggerKey} enabled={glitchEnabled} intensity="normal">
      <div className="terminal-container">
        <CRTEffect enabled={crtEnabled} />
        {showJumpscare && (
          <JumpscareOverlay onComplete={() => setShowJumpscare(false)} />
        )}
        {asciiEnabled && (
          <div className="rhino-art-viewport" aria-hidden="true">
            <pre className="rhino-art-text">{rhinoArtText}</pre>
          </div>
        )}
        <div ref={terminalRef} className="xterm-wrapper" />
        <div className="terminal-bottom-spacer" aria-hidden="true" />
        {tooltip && <TerminalTooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />}
        {subTerminalVisible && (
          <SubTerminal 
            file={subTerminalFile} 
            onClose={() => setSubTerminalVisible(false)}
          />
        )}
      </div>
    </GlitchEffect>
  );
};

export default Terminal;
