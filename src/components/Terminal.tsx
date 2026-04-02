import React, { useEffect, useRef, useState } from 'react';
import commandsData from '../data/commands.json';
import { TERMINAL_CONFIG } from '../config/terminalConfig';
import SubTerminal from './SubTerminal';
import { createFetchingLoader } from '../utils/fetchingLoader';
import { createClearingLoader } from '../utils/clearingLoader';
import { RHINO_ART, printRhinoArt } from './RhinoArt';
import TypewriterHyperlink from './TypewriterHyperlink';
import TerminalTooltip from './TerminalTooltip';

interface Command {
  cmd: string;
  desc: string;
  outputLines: string[];
}

// User's custom rhino ASCII art and CODERHINO block
const WELCOME_LINES = [
  "Hi there! Welcome to my Web Portfolio",
  '',
  "     *I have hidden a flag somewhere in this portfolio. Can you find it?",
  "     *For best experience, please use a desktop browser and have your volume MAXED out",
  '',
  '=====',
  '',
  "Type 'help' for available commands",
  '',
  '=====',
  ''
];

/**
 * Main Terminal component that handles the interactive terminal interface
 * Integrates xterm.js with custom command processing and typewriter effects
 */
const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);
  // Command history and input buffer management
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1); // -1 means not navigating
  const currentLineBuffer = useRef<string>('');
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

  useEffect(() => {
    asciiEnabledRef.current = asciiEnabled;
  }, [asciiEnabled]);

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
      root.style.setProperty('--scrollbar-thumb', theme.ansi.brightBlack); // Using brightBlack as a neutral scrollbar color
      root.style.setProperty('--scrollbar-track', theme.background);
    }
  }, [currentTheme]);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

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
          // Enforce maximum columns limit
          if (terminal.cols < 200) {
            terminal.resize(152, terminal.rows);
          }
        };
        
        customFit();

        // Store references
        xtermRef.current = terminal;
        fitAddonRef.current = fitAddon;
        setIsInitialized(true);

        // Print banner and welcome
        printBannerAndWelcome();
        writePrompt();

        // Handle window resize with custom fit
        const handleResize = () => customFit();
        window.addEventListener('resize', handleResize);

        // Handle terminal input
        terminal.onKey(({ key, domEvent }: any) => {
          // Disable input during typewriter effect, fetching, or clearing using refs
          if (isTypingRef.current || isFetchingRef.current || isClearingRef.current) {
            return;
          }

          const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

          switch (domEvent.key) {
            case 'Enter':
              terminal.write('\r\n');
              handleCommand(currentLineBuffer.current.trim());
              if (currentLineBuffer.current.trim()) {
                commandHistory.current.push(currentLineBuffer.current);
                historyIndex.current = commandHistory.current.length - 1;
              } else {
                historyIndex.current = commandHistory.current.length;
              }
              currentLineBuffer.current = '';
              break;
            case 'Backspace':
              if (currentLineBuffer.current.length > 0) {
                currentLineBuffer.current = currentLineBuffer.current.slice(0, -1);
                terminal.write('\b \b');
              }
              break;
            case 'ArrowUp':
              if (commandHistory.current.length) {
                // Clear current line
                for (let i = 0; i < currentLineBuffer.current.length; i++) {
                  terminal.write('\b \b');
                }
                if (historyIndex.current > 0) {
                  historyIndex.current--;
                }
                currentLineBuffer.current = commandHistory.current[historyIndex.current] || '';
                terminal.write(currentLineBuffer.current);
              }
              break;
            case 'ArrowDown':
              if (commandHistory.current.length) {
                for (let i = 0; i < currentLineBuffer.current.length; i++) {
                  terminal.write('\b \b');
                }
                if (historyIndex.current < commandHistory.current.length - 1) {
                  historyIndex.current++;
                  currentLineBuffer.current = commandHistory.current[historyIndex.current] || '';
                  terminal.write(currentLineBuffer.current);
                } else {
                  historyIndex.current = commandHistory.current.length;
                  currentLineBuffer.current = '';
                }
              }
              break;
            default:
              if (printable && domEvent.key.length === 1) {
                currentLineBuffer.current += key;
                terminal.write(key);
                // Auto-scroll to bottom if user is not at the bottom
                const viewport = terminal.element?.querySelector('.xterm-viewport');
                if (viewport && viewport.scrollTop + viewport.clientHeight < viewport.scrollHeight - 2) {
                  viewport.scrollTop = viewport.scrollHeight;
                }
              }
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
        console.error('Failed to initialize terminal:', error);
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

  // Print banner and welcome message, side by side
  const printBannerAndWelcome = () => {
    if (!xtermRef.current) return;
    if (asciiEnabled) {
      printRhinoArt(xtermRef.current);
    }
    // Print banner and welcome lines with colored "help" 
    // Directory color = ANSI Green (32)
    WELCOME_LINES.forEach(line => {
      if (line.includes("help")) {
        const parts = line.split("help");
        const coloredLine = `${parts[0]}\x1b[32mhelp\x1b[0m${parts[1]}\r\n`;
        xtermRef.current.write(coloredLine);
      } else {
        xtermRef.current.write(line + '\r\n');
      }
    });
  };

  // Write the terminal prompt with color
  const writePrompt = () => {
    if (!xtermRef.current) return;
    
    // Build the colored prompt: [host]@[directory]:~$ 
    // Host = Bright Yellow (93), Directory = Green (32), Separators = White (37)
    let coloredPrompt = '';
    
    // Host 
    coloredPrompt += `\x1b[93m${TERMINAL_CONFIG.appearance.host}\x1b[0m`;
    
    // @ separator
    coloredPrompt += `\x1b[37m@\x1b[0m`;
    
    // Directory
    coloredPrompt += `\x1b[32m${currentDirectoryRef.current}\x1b[0m`;
    
    // :~$ terminator
    coloredPrompt += `\x1b[37m:~$ \x1b[0m`;
    
    xtermRef.current.write(coloredPrompt);
  };

  // Update clearTerminal to dispose of project links provider
  const clearTerminal = (asciiOverride?: boolean) => {
    if (!xtermRef.current) return;
    // Dispose of project links provider if it exists
    if (projectLinksProviderRef.current) {
      projectLinksProviderRef.current.dispose();
      projectLinksProviderRef.current = null;
    }
    // Dispose of global link provider if it exists
    if (globalLinkProviderRef.current) {
      globalLinkProviderRef.current.dispose();
      globalLinkProviderRef.current = null;
    }
    globalLinkMeta.current = [];
    xtermRef.current.clear();
    const showAscii = typeof asciiOverride === 'boolean' ? asciiOverride : asciiEnabledRef.current;
    if (showAscii) {
      printBannerAndWelcome();
    } else {
      // Print only the welcome lines (without ASCII art)
      WELCOME_LINES.forEach(line => {
        if (line.includes("help")) {
          const parts = line.split("help");
          const coloredLine = `${parts[0]}\x1b[32mhelp\x1b[0m${parts[1]}\r\n`;
          xtermRef.current.write(coloredLine);
        } else {
          xtermRef.current.write(line + '\r\n');
        }
      });
    }
    writePrompt();
  };

  // Display command output with typewriter effect and color support
  const displayCommandOutput = (lines: string[], type: 'normal' | 'error' | 'success' | 'warning' | 'info' = 'normal') => {
    if (!xtermRef.current) return;
    
    isTypingRef.current = true;
    setIsTyping(true);
    
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    
    const typeNextChar = () => {
      if (currentLineIndex >= lines.length) {
        isTypingRef.current = false;
        setIsTyping(false);
        setTypewriterTimeout(null);
        xtermRef.current!.write('\r\n');
        writePrompt();
        return;
      }
      
      const currentLine = lines[currentLineIndex];
      
      if (currentCharIndex < currentLine.length) {
        // Apply ANSI color based on type
        let colorCode = '\x1b[37m'; // Default White (37)
        switch (type) {
          case 'error':
            colorCode = '\x1b[31m'; // Red (31)
            break;
          case 'success':
            colorCode = '\x1b[92m'; // Bright Green (92)
            break;
          case 'warning':
            colorCode = '\x1b[33m'; // Yellow (33)
            break;
          case 'info':
            colorCode = '\x1b[36m'; // Cyan (36)
            break;
          default:
            colorCode = '\x1b[37m';
        }
        
        xtermRef.current!.write(colorCode + currentLine[currentCharIndex]);
        currentCharIndex++;
        const timeout = setTimeout(typeNextChar, TERMINAL_CONFIG.typewriter.charDelay);
        setTypewriterTimeout(timeout);
      } else {
        xtermRef.current!.write('\x1b[0m\r\n'); // Reset color and new line
        currentLineIndex++;
        currentCharIndex = 0;
        const timeout = setTimeout(typeNextChar, TERMINAL_CONFIG.typewriter.lineDelay);
        setTypewriterTimeout(timeout);
      }
    };
    
    typeNextChar();
  };

  const executePendingCommand = () => {
    if (!pendingCommandRef.current) return;
    
    const { command, type, param } = pendingCommandRef.current;
    pendingCommandRef.current = null;
    
    // Generic hyperlinks support for any command
    if (type === 'command') {
      const commandData = (commandsData as any[]).find(c => c.cmd === command);
      if (commandData && commandData.outputLines && xtermRef.current) {
        const term = xtermRef.current;
        let lineNum = term.buffer.active.baseY + term.buffer.active.cursorY + 1;
        const hyperlinks = commandData.hyperlinks || [];
        const writeLine = (index: number) => {
          if (index >= commandData.outputLines.length) {
            term.write('\r\n');
            // Register the global link provider if not already
            if (hyperlinks.length > 0 && term.registerLinkProvider && !globalLinkProviderRef.current) {
              globalLinkProviderRef.current = term.registerLinkProvider({
                provideLinks: (y: number, callback: Function) => {
                  const links = globalLinkMeta.current
                    .filter(meta => meta.y === y)
                    .map(meta => ({
                      text: meta.text,
                      range: {
                        start: { x: meta.start, y },
                        end: { x: meta.end, y }
                      },
                      activate: () => window.open(meta.url, '_blank'),
                      // Show custom tooltip on hover
                      hover: (event: MouseEvent, link: any) => {
                        // Get bounding rect of terminal
                        const rect = term.element.getBoundingClientRect();
                        // Position tooltip below mouse
                        setTooltip({
                          text: meta.url,
                          x: event.clientX,
                          y: event.clientY + 12
                        });
                      },
                      leave: () => setTooltip(null)
                    }));
                  callback(links);
                }
              });
            }
            writePrompt();
            return;
          }
          const line = commandData.outputLines[index];
          let charIdx = 0;
          const thisLine = lineNum;
          const typeChar = () => {
            if (charIdx < line.length) {
              term.write(line[charIdx]);
              charIdx++;
              setTimeout(typeChar, TERMINAL_CONFIG.typewriter.charDelay || 30);
            } else {
              // Check for hyperlinks in this line
              hyperlinks.forEach((link: { text: string; url: string }) => {
                const col = line.indexOf(link.text);
                if (col !== -1) {
                  globalLinkMeta.current.push({
                    y: thisLine,
                    start: col + 1,
                    end: col + link.text.length,
                    url: link.url,
                    text: link.text
                  });
                }
              });
              term.write('\r\n');
              lineNum++;
              setTimeout(() => writeLine(index + 1), TERMINAL_CONFIG.typewriter.lineDelay || 200);
            }
          };
          typeChar();
        };
        //term.write('\r\n');
        writeLine(0);
        return;
      }
    }
    // Default: Execute the actual command as before
    if (type === 'command') {
      const commandData = (commandsData as Command[]).find(c => c.cmd === command);
      if (commandData) {
        displayCommandOutput(commandData.outputLines);
      }
    } else if (type === 'run') {
      setSubTerminalFile(param || '');
      writePrompt();
      setSubTerminalVisible(true);
    }
  };

  // Handle command execution
  const handleCommand = (command: string) => {
    if (!xtermRef.current) return;
    
    // Add command to history
    if (command.trim()) {
      commandHistory.current.push(command);
    }
    
    const cmd = command.trim();
    
    // For ascii on/off, only skip newline if the command will trigger a clear (state change). For errors, always write the newline.
    let isAsciiOn = cmd === 'ascii on';
    let isAsciiOff = cmd === 'ascii off';
    if (isAsciiOn || isAsciiOff) {
      // Determine if this will be an error or a state change
      if ((isAsciiOn && asciiEnabledRef.current) || (isAsciiOff && !asciiEnabledRef.current)) {
        xtermRef.current.write('\r\n'); // Error case: always write newline
      }
      // Otherwise, skip newline (will clear)
    } else {
      xtermRef.current.write('\r\n');
    }
    
    if (!cmd) {
      writePrompt();
      return;
    }
  
    if (cmd === 'help') {
      // New help logic: group commands by label/category from commandsData
      const helpLines: string[] = [];
      let currentLabel: string | null = null;
      (commandsData as any[]).forEach((item) => {
        if (item.type === 'label') {
          // Print a blank line before each label except the first
          if (helpLines.length > 0) helpLines.push('');
          helpLines.push(item.label);
          currentLabel = item.label;
        } else if (item.cmd && item.desc) {
          // Only show commands that are not hidden and have a category
          // Indent commands under their label
          const padding = ' '.repeat(17 - item.cmd.length);
          helpLines.push(`  ${item.cmd}${padding}- ${item.desc}`);
        }
      });
      displayCommandOutput(helpLines, 'normal');
      return;
    }
    
    // Clear command - use clearing loader
    if (cmd === 'clear') {
      isClearingRef.current = true;
      setIsClearing(true);
      if (clearingLoaderRef.current) {
        clearingLoaderRef.current.start();
      }
      return;
    }

    // Handle ascii command
    if (cmd === 'ascii' || cmd.startsWith('ascii ')) {
      const arg = cmd.slice(5).trim();
      if (!arg) {
        displayCommandOutput([
          "ascii requires an argument. Usage: ascii [on/off]"
        ], 'error');
        return;
      }
      if (arg === 'on') {
        if (asciiEnabledRef.current) {
          displayCommandOutput(["ASCII art is already enabled."], 'error');
        } else {
          setAsciiEnabled(true);
        }
        return;
      }
      if (arg === 'off') {
        if (!asciiEnabledRef.current) {
          displayCommandOutput(["ASCII art is already disabled."], 'error');
        } else {
          setAsciiEnabled(false);
        }
        return;
      }
      // Invalid usage
      displayCommandOutput([
        "Usage: ascii [on/off]"
      ], 'error');
      return;
    }

    // Handle theme command
    if (cmd === 'theme' || cmd.startsWith('theme ')) {
      const arg = cmd.slice(5).trim();
      if (!arg) {
        displayCommandOutput([
          "theme requires an argument. Usage: theme [1/2/3]"
        ], 'error');
        return;
      }
      
      const validThemes = ['1', '2', '3'];
      if (validThemes.includes(arg)) {
        if (currentThemeRef.current === arg) {
          displayCommandOutput([`Theme ${arg} is already active.`], 'error');
        } else {
          setCurrentTheme(arg);
          // Show feedback without clearing. The xterm theme update will refresh colors.
          setTimeout(() => {
            const activeTheme = (TERMINAL_CONFIG as any).themes[arg];
            displayCommandOutput([`Successfully changed theme to ${activeTheme.name}`], 'success');
          }, 50);
        }
        return;
      }
      
      // Invalid usage
      displayCommandOutput([
        "Invalid theme. Usage: theme [1/2/3]"
      ], 'error');
      return;
    }
    
    // Directory commands (no fetching) - only navigation commands
    const directoryCommands = ['cd', 'ls', 'ls -a', 'pwd'];
    const isDirectoryCommand = directoryCommands.includes(cmd) || cmd.startsWith('cd ') || (cmd === 'run' || cmd.startsWith('run '));
    
    if (isDirectoryCommand) {
      // Handle directory commands immediately (no fetching)
      if (cmd === 'cd') {
        // Handle cd command with no arguments - go to default directory
        if (currentDirectoryRef.current !== TERMINAL_CONFIG.appearance.defaultDirectory) {
          currentDirectoryRef.current = TERMINAL_CONFIG.appearance.defaultDirectory;
          setCurrentDirectory(TERMINAL_CONFIG.appearance.defaultDirectory);
          // No output, just prompt
          writePrompt();
        } else {
          // If already in default directory, just write the prompt
          writePrompt();
        }
      } else if (cmd.startsWith('cd ')) {
        // Handle cd command with directory argument
        const newDir = command.substring(3).trim();
        // Define valid directories (only actual directories, not commands)
        const validDirectories = ['c0derhin0-wp.com', 'secret'];
        if (validDirectories.includes(newDir)) {
          if (currentDirectoryRef.current !== newDir) {
            currentDirectoryRef.current = newDir;
            setCurrentDirectory(newDir);
            // No output, just prompt
            writePrompt();
          } else {
            // If already in the target directory, just write the prompt
            writePrompt();
          }
        } else {
          displayCommandOutput([`Directory not found: ${newDir}`], 'error');
        }
      } else if (cmd === 'ls') {
        // Handle ls command - directory-specific content
        let lsOutput: string[] = [];
        
        if (currentDirectoryRef.current === 'c0derhin0-wp.com') {
          lsOutput = [
            'clue.sh'
          ];
        } else if (currentDirectoryRef.current === 'secret') {
          lsOutput = [
            //'easter-egg.md'
          ];
        } 
        
        // Only display output if there's content, otherwise just show prompt
        if (lsOutput.length > 0) {
          displayCommandOutput(lsOutput, 'normal');
        } else {
          writePrompt();
        }
      } else if (cmd === 'ls -a') {
        // Handle 'ls -a' command - like ls, but in 'secret' directory, add 'secret.sh'
        let lsOutput: string[] = [];
        if (currentDirectoryRef.current === 'c0derhin0-wp.com') {
          lsOutput = [
            'clue.sh'
          ];
        } else if (currentDirectoryRef.current === 'secret') {
          lsOutput = [
            //'easter-egg.md',
            'secret.sh'
          ];
        } 
        // Only display output if there's content, otherwise just show prompt
        if (lsOutput.length > 0) {
          displayCommandOutput(lsOutput, 'normal');
        } else {
          writePrompt();
        }
      } else if (cmd === 'pwd') {
        // Handle pwd command
        const pwdOutput = `/Users/${TERMINAL_CONFIG.appearance.host}/Internet/${currentDirectoryRef.current}`;
        displayCommandOutput([pwdOutput], 'normal');
      } else if (cmd === 'run' || cmd.startsWith('run ')) {
        const param = command.substring(3).trim();
        // Only allow in default dir
        const validFiles = [];
        if (currentDirectoryRef.current === 'c0derhin0-wp.com') {
          validFiles.push('clue.sh');
        }
        if (currentDirectoryRef.current === 'secret') {
          validFiles.push('secret.sh');
        }
        if (!param) {
          displayCommandOutput(['run requires a parameter. Usage: run [file]'], 'error');
          return;
        }
        if (!validFiles.includes(param)) {
          displayCommandOutput([`No file found with name ${param}`], 'error');
          return;
        }
        
        // Valid run command - show fetching loader first, then subterminal
        isFetchingRef.current = true;
        setIsFetching(true);
        pendingCommandRef.current = { command, type: 'run', param };
        if (fetchingLoaderRef.current) {
          fetchingLoaderRef.current.start();
        }
      }
      return;
    }
  
    // Check if it's a social/link command (whoami, stack, github, etc.)
    const socialCommand = (commandsData as any[]).find(c => c.cmd === cmd);
    if (socialCommand) {
      isFetchingRef.current = true;
      setIsFetching(true);
      pendingCommandRef.current = { command: cmd, type: 'command' };
      if (fetchingLoaderRef.current) {
        fetchingLoaderRef.current.start();
      }
      return;
    }
  
    // Unknown command
    displayCommandOutput([`Command not found: ${cmd}`], 'error');
  };

  // Sync asciiEnabled with cleared terminal if it changes independently
  useEffect(() => {
    if (isInitialized && prevAsciiEnabledRef.current !== asciiEnabled) {
      clearTerminal(asciiEnabled);
    }
    prevAsciiEnabledRef.current = asciiEnabled;
  }, [asciiEnabled, isInitialized]);

  return (
    <div className="terminal-container">
      <div ref={terminalRef} className="xterm-wrapper" />
      {tooltip && <TerminalTooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />}
      {subTerminalVisible && (
        <SubTerminal 
          file={subTerminalFile} 
          onClose={() => setSubTerminalVisible(false)} 
        />
      )}
    </div>
  );
};

export default Terminal;