import type React from 'react';
import { TERMINAL_CONFIG } from '../../config/terminalConfig';
import type { VisualEffectsSettings } from '../../utils/visualEffectsStorage';

interface Command {
  cmd: string;
  desc: string;
  outputLines: string[];
}

const WELCOME_LINES = [
  'Hi there! Welcome to my Web Portfolio',
  '',
  '     *I have hidden a flag somewhere in this portfolio. Can you find it?',
  '     *For best experience, please use a desktop browser and have your volume MAXED out',
  '',
  '=====',
  '',
  "Type 'help' for available commands",
  '',
  '=====',
  ''
];

export interface TerminalCommandContext {
  maxHistoryLength: number;
  asciiEnabled: boolean;
  asciiEnabledRef: React.MutableRefObject<boolean>;
  commandHistory: React.MutableRefObject<string[]>;
  commandsData: Array<{ cmd?: string; desc?: string; outputLines?: string[]; type?: string; label?: string; hyperlinks?: Array<{ text: string; url: string }> }>;
  crtEnabled: boolean;
  crtEnabledRef: React.MutableRefObject<boolean>;
  currentDirectoryRef: React.MutableRefObject<string>;
  currentThemeRef: React.MutableRefObject<string>;
  fetchingLoaderRef: React.MutableRefObject<any>;
  clearingLoaderRef: React.MutableRefObject<any>;
  glitchEnabled: boolean;
  glitchEnabledRef: React.MutableRefObject<boolean>;
  globalLinkMeta: React.MutableRefObject<Array<{ y: number; start: number; end: number; url: string; text: string }>>;
  globalLinkProviderRef: React.MutableRefObject<any>;
  historyIndex: React.MutableRefObject<number>;
  isClearingRef: React.MutableRefObject<boolean>;
  isFetchingRef: React.MutableRefObject<boolean>;
  isTypingRef: React.MutableRefObject<boolean>;
  keyboardSoundsEnabled: boolean;
  keyboardSoundsEnabledRef: React.MutableRefObject<boolean>;
  pendingCommandRef: React.MutableRefObject<{ command: string; type: string; param?: string } | null>;
  projectLinksProviderRef: React.MutableRefObject<any>;
  setAsciiEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setCrtEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDirectory: React.Dispatch<React.SetStateAction<string>>;
  setCurrentTheme: React.Dispatch<React.SetStateAction<string>>;
  setGlitchEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setGlitchTriggerKey: React.Dispatch<React.SetStateAction<number>>;
  setIsClearing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setKeyboardSoundsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setMatrixEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setShowJumpscare: React.Dispatch<React.SetStateAction<boolean>>;
  setSubTerminalFile: React.Dispatch<React.SetStateAction<string>>;
  setSubTerminalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTooltip: React.Dispatch<React.SetStateAction<{ text: string; x: number; y: number } | null>>;
  setTypewriterTimeout: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>;
  typewriterTimeout: NodeJS.Timeout | null;
  whoamiExtra: { outputLines?: string[] };
  xtermRef: React.MutableRefObject<any>;
  buildSystemMonitorLines: (snapshot: any) => string[];
  createSystemSnapshot: (timestamp: number) => any;
  saveVisualEffectsSettings: (settings: VisualEffectsSettings) => void;
  tokenizeCommandInput: (input: string) => { cmd: string; args: string[] };
}

export const createTerminalCommandHandlers = (context: TerminalCommandContext) => {
  const {
    asciiEnabled,
    asciiEnabledRef,
    commandHistory,
    commandsData,
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
    maxHistoryLength,
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
  } = context;

  const printBannerAndWelcome = () => {
    if (!xtermRef.current) return;
    if (asciiEnabled) {
      // Rhino art rendered above terminal; no spacer lines needed.
    }
    WELCOME_LINES.forEach((line) => {
      if (line.includes('help')) {
        const parts = line.split('help');
        const coloredLine = `${parts[0]}\x1b[32mhelp\x1b[0m${parts[1]}\r\n`;
        xtermRef.current.write(coloredLine);
      } else {
        xtermRef.current.write(line + '\r\n');
      }
    });
  };

  const writePrompt = () => {
    if (!xtermRef.current) return;
    let coloredPrompt = '';
    coloredPrompt += `\x1b[93m${TERMINAL_CONFIG.appearance.host}\x1b[0m`;
    coloredPrompt += '\x1b[37m@\x1b[0m';
    coloredPrompt += `\x1b[32m${currentDirectoryRef.current}\x1b[0m`;
    coloredPrompt += '\x1b[37m:~$ \x1b[0m';
    xtermRef.current.write(coloredPrompt);
  };

  const clearTerminal = (asciiOverride?: boolean) => {
    if (!xtermRef.current) return;
    if (projectLinksProviderRef.current) {
      projectLinksProviderRef.current.dispose();
      projectLinksProviderRef.current = null;
    }
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
      WELCOME_LINES.forEach((line) => {
        if (line.includes('help')) {
          const parts = line.split('help');
          const coloredLine = `${parts[0]}\x1b[32mhelp\x1b[0m${parts[1]}\r\n`;
          xtermRef.current.write(coloredLine);
        } else {
          xtermRef.current.write(line + '\r\n');
        }
      });
    }
    writePrompt();
  };

  const displayCommandOutput = (
    lines: string[],
    type: 'normal' | 'error' | 'success' | 'warning' | 'info' = 'normal'
  ) => {
    if (!xtermRef.current) return;

    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
      setTypewriterTimeout(null);
    }

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
        let colorCode = '\x1b[37m';
        switch (type) {
          case 'error':
            colorCode = '\x1b[31m';
            break;
          case 'success':
            colorCode = '\x1b[92m';
            break;
          case 'warning':
            colorCode = '\x1b[33m';
            break;
          case 'info':
            colorCode = '\x1b[36m';
            break;
          default:
            colorCode = '\x1b[37m';
        }

        xtermRef.current!.write(colorCode + currentLine[currentCharIndex]);
        currentCharIndex++;
        const timeout = setTimeout(typeNextChar, TERMINAL_CONFIG.typewriter.charDelay);
        setTypewriterTimeout(timeout);
      } else {
        xtermRef.current!.write('\x1b[0m\r\n');
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

    if (type === 'command') {
      const commandData = (commandsData as any[]).find((c) => c.cmd === command);
      if (commandData && commandData.outputLines && xtermRef.current) {
        if (typewriterTimeout) {
          clearTimeout(typewriterTimeout);
          setTypewriterTimeout(null);
        }
        isTypingRef.current = true;
        setIsTyping(true);
        const term = xtermRef.current;
        const extraLines = commandData.cmd === 'whoami'
          ? (Array.isArray(whoamiExtra.outputLines) ? whoamiExtra.outputLines : [])
          : [];
        const outputLines = [...commandData.outputLines, ...extraLines];
        let lineNum = term.buffer.active.baseY + term.buffer.active.cursorY + 1;
        const hyperlinks = commandData.hyperlinks || [];
        const writeLine = (index: number) => {
          if (index >= outputLines.length) {
            isTypingRef.current = false;
            setIsTyping(false);
            term.write('\r\n');
            if (hyperlinks.length > 0 && term.registerLinkProvider && !globalLinkProviderRef.current) {
              globalLinkProviderRef.current = term.registerLinkProvider({
                provideLinks: (y: number, callback: Function) => {
                  const links = globalLinkMeta.current
                    .filter((meta) => meta.y === y)
                    .map((meta) => ({
                      text: meta.text,
                      range: {
                        start: { x: meta.start, y },
                        end: { x: meta.end, y }
                      },
                      activate: () => window.open(meta.url, '_blank'),
                      hover: (event: MouseEvent) => {
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
          const line = outputLines[index];
          let charIdx = 0;
          const thisLine = lineNum;
          const typeChar = () => {
            if (charIdx < line.length) {
              term.write(line[charIdx]);
              charIdx++;
              setTimeout(typeChar, TERMINAL_CONFIG.typewriter.charDelay || 30);
            } else {
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
              const timeout = setTimeout(() => writeLine(index + 1), TERMINAL_CONFIG.typewriter.lineDelay || 200);
              setTypewriterTimeout(timeout);
            }
          };
          typeChar();
        };
        writeLine(0);
        return;
      }
    }

    if (type === 'command') {
      const commandData = (commandsData as Command[]).find((c) => c.cmd === command);
      if (commandData) {
        if (commandData.cmd === 'whoami') {
          const extraLines = Array.isArray(whoamiExtra.outputLines) ? whoamiExtra.outputLines : [];
          displayCommandOutput([...commandData.outputLines, ...extraLines]);
        } else {
          displayCommandOutput(commandData.outputLines);
        }
      }
    } else if (type === 'run') {
      setSubTerminalFile(param || '');
      writePrompt();
      setSubTerminalVisible(true);
    }
  };

  const handleCommand = (command: string) => {
    if (!xtermRef.current) return;
    if (command.trim()) {
      const lastCommand = commandHistory.current[commandHistory.current.length - 1];
      if (lastCommand !== command) {
        const nextHistory = [...commandHistory.current, command];
        commandHistory.current = nextHistory.slice(-maxHistoryLength);
        try {
          window.localStorage.setItem('terminalCommandHistory', JSON.stringify(commandHistory.current));
        } catch (error) {
          // Ignore persistence errors
        }
      }
    }

    const { cmd, args } = tokenizeCommandInput(command);

    let isAsciiOn = cmd === 'ascii on';
    let isAsciiOff = cmd === 'ascii off';
    if (isAsciiOn || isAsciiOff) {
      if ((isAsciiOn && asciiEnabledRef.current) || (isAsciiOff && !asciiEnabledRef.current)) {
        xtermRef.current.write('\r\n');
      }
    } else {
      xtermRef.current.write('\r\n');
    }

    if (!cmd) {
      writePrompt();
      return;
    }

    if (glitchEnabled) {
      setGlitchTriggerKey((prev) => prev + 1);
    }

    if (cmd === 'help') {
      const helpLines: string[] = [];
      (commandsData as any[]).forEach((item) => {
        if (item.type === 'label') {
          if (helpLines.length > 0) helpLines.push('');
          helpLines.push(item.label);
        } else if (item.cmd && item.desc) {
          const paddingCount = Math.max(1, 17 - item.cmd.length);
          const padding = ' '.repeat(paddingCount);
          helpLines.push(`  ${item.cmd}${padding}- ${item.desc}`);
        }
      });
      displayCommandOutput(helpLines, 'normal');
      return;
    }

    if (cmd === 'neofetch' || cmd === 'screenfetch') {
      const overviewLines = [
        '      __      __          ______      __      ',
        '     / /___ _/ /_____    / ____/___ _/ /_____ ',
        '    / / __ `/ __/ __ \\  / /   / __ `/ __/ __ \\',
        '   / / /_/ / /_/ /_/ / / /___/ /_/ / /_/ /_/ /',
        '  /_/\\__,_/\\__/\\____/  \\____/\\__,_/\\__/\\____/ ',
        '',
        '   CODERHINO OS :: terminal interface',
        '   User: guest@c0derhin0-wp.com',
        '   Uptime: 00:42:13',
        '   Shell: rhino-sh 6.1',
        '   Theme: neon-green',
        '   Kernel: 6.1.0-21-rhino',
        '   Memory: 4096MiB / 8192MiB',
        '   CPU: RhinoCore i9 (8) @ 4.2GHz',
        '   GPU: C0DE-RH1N0 Integrated',
        '   Net: tunnel:encrypted :: status=stable'
      ];

      displayCommandOutput(overviewLines, 'info');
      return;
    }

    if (cmd === 'sudo') {
      const arg = args.join(' ').trim();
      if (!arg) {
        displayCommandOutput(['usage: sudo <command>'], 'error');
        return;
      }
      const responseLines = [
        '[sudo] password for visitor:',
        '',
        'Sorry, try again.',
        `sudo: ${arg}: command not found`,
        'Hint: There is no password prompt in a browser.'
      ];
      displayCommandOutput(responseLines, 'warning');
      return;
    }

    if (cmd === 'matrix') {
      const arg = args.join(' ').trim();
      if (arg === '--init') {
        setMatrixEnabled(true);
        displayCommandOutput([
          'Matrix mode enabled.',
          'Binary rain synced to green phosphor.'
        ], 'success');
      } else {
        displayCommandOutput(['Usage: matrix --init'], 'error');
      }
      return;
    }

    if (cmd === 'top' || cmd === 'htop') {
      const snapshot = createSystemSnapshot(Date.now());
      const monitorLines = buildSystemMonitorLines(snapshot);
      displayCommandOutput(monitorLines, 'normal');
      return;
    }

    if (cmd === 'clear') {
      isClearingRef.current = true;
      setIsClearing(true);
      if (clearingLoaderRef.current) {
        clearingLoaderRef.current.start();
      }
      return;
    }

    if (cmd === 'ascii' || cmd.startsWith('ascii ')) {
      const arg = args.join(' ').trim();
      if (!arg) {
        displayCommandOutput(['ascii requires an argument. Usage: ascii [on/off]'], 'error');
        return;
      }
      if (arg === 'on') {
        if (asciiEnabledRef.current) {
          displayCommandOutput(['ASCII art is already enabled.'], 'error');
        } else {
          setAsciiEnabled(true);
        }
        return;
      }
      if (arg === 'off') {
        if (!asciiEnabledRef.current) {
          displayCommandOutput(['ASCII art is already disabled.'], 'error');
        } else {
          setAsciiEnabled(false);
        }
        return;
      }
      displayCommandOutput(['Usage: ascii [on/off]'], 'error');
      return;
    }

    if (cmd === 'theme' || cmd.startsWith('theme ')) {
      const arg = args.join(' ').trim();
      if (!arg) {
        displayCommandOutput(['theme requires an argument. Usage: theme [1/2/3]'], 'error');
        return;
      }

      const validThemes = ['1', '2', '3'];
      if (validThemes.includes(arg)) {
        if (currentThemeRef.current === arg) {
          displayCommandOutput([`Theme ${arg} is already active.`], 'error');
        } else {
          setCurrentTheme(arg);
          setTimeout(() => {
            const activeTheme = (TERMINAL_CONFIG as any).themes[arg];
            displayCommandOutput([`Successfully changed theme to ${activeTheme.name}`], 'success');
          }, 50);
        }
        return;
      }

      displayCommandOutput(['Invalid theme. Usage: theme [1/2/3]'], 'error');
      return;
    }

    if (cmd === 'effects') {
      const arg = args.join(' ').trim();
      if (!arg) {
        displayCommandOutput([
          `effects status: crt=${crtEnabled ? 'on' : 'off'}, glitch=${glitchEnabled ? 'on' : 'off'}, sounds=${keyboardSoundsEnabled ? 'on' : 'off'}`
        ], 'info');
        return;
      }

      const [target = '', value = ''] = arg.split(/\s+/);
      const normalizedValue = value.toLowerCase();
      const isToggle = normalizedValue === 'on' || normalizedValue === 'off';

      if (!value || !isToggle) {
        displayCommandOutput(['Usage: effects [crt|glitch|sounds] [on/off]'], 'error');
        return;
      }

      if (target === 'crt') {
        const next = normalizedValue === 'on';
        if (next === crtEnabledRef.current) {
          displayCommandOutput([`CRT overlay is already ${next ? 'enabled' : 'disabled'}.`], 'error');
          return;
        }
        setCrtEnabled(next);
        saveVisualEffectsSettings({ crtEnabled: next, glitchEnabled });
        displayCommandOutput([`CRT overlay ${next ? 'enabled' : 'disabled'}.`], 'success');
        return;
      }
      if (target === 'glitch') {
        const next = normalizedValue === 'on';
        if (next === glitchEnabledRef.current) {
          displayCommandOutput([`Glitch effects are already ${next ? 'enabled' : 'disabled'}.`], 'error');
          return;
        }
        setGlitchEnabled(next);
        saveVisualEffectsSettings({ crtEnabled, glitchEnabled: next });
        displayCommandOutput([`Glitch effects ${next ? 'enabled' : 'disabled'}.`], 'success');
        return;
      }
      if (target === 'sounds') {
        const next = normalizedValue === 'on';
        if (next === keyboardSoundsEnabledRef.current) {
          displayCommandOutput([`Keyboard sounds are already ${next ? 'enabled' : 'disabled'}.`], 'error');
          return;
        }
        setKeyboardSoundsEnabled(next);
        displayCommandOutput([`Keyboard sounds ${next ? 'enabled' : 'disabled'}.`], 'success');
        return;
      }

      displayCommandOutput(['Usage: effects [crt|glitch|sounds] [on/off]'], 'error');
      return;
    }

    const directoryCommands = ['cd', 'ls', 'pwd', 'run'];
    const isDirectoryCommand = directoryCommands.includes(cmd);

    if (isDirectoryCommand) {
      if (cmd === 'cd') {
        const newDir = args.join(' ').trim();
        if (!newDir) {
          if (currentDirectoryRef.current !== TERMINAL_CONFIG.appearance.defaultDirectory) {
            currentDirectoryRef.current = TERMINAL_CONFIG.appearance.defaultDirectory;
            setCurrentDirectory(TERMINAL_CONFIG.appearance.defaultDirectory);
            writePrompt();
          } else {
            writePrompt();
          }
          return;
        }
        if (newDir === '~' || newDir === '$HOME') {
          displayCommandOutput(['Permission denied'], 'error');
          return;
        }
        if (newDir === '..') {
          if (currentDirectoryRef.current === 'secret') {
            currentDirectoryRef.current = TERMINAL_CONFIG.appearance.defaultDirectory;
            setCurrentDirectory(TERMINAL_CONFIG.appearance.defaultDirectory);
            writePrompt();
          } else {
            displayCommandOutput(['Permission denied'], 'error');
          }
          return;
        }
        if (
          newDir.startsWith('~/')
          || newDir.startsWith('/Users')
          || newDir.startsWith('~/Users')
        ) {
          displayCommandOutput(['Permission denied'], 'error');
          return;
        }
        const validDirectories = ['c0derhin0-wp.com', 'secret'];
        if (validDirectories.includes(newDir)) {
          if (currentDirectoryRef.current !== newDir) {
            currentDirectoryRef.current = newDir;
            setCurrentDirectory(newDir);
            writePrompt();
          } else {
            writePrompt();
          }
        } else {
          displayCommandOutput([`Directory not found: ${newDir}`], 'error');
        }
      } else if (cmd === 'ls') {
        const hasArgs = args.length > 0;
        const isAll = hasArgs && args.length === 1 && args[0] === '-a';
        if (hasArgs && !isAll) {
          displayCommandOutput(['Usage: ls [-a]'], 'error');
          return;
        }

        let lsOutput: string[] = [];
        if (currentDirectoryRef.current === 'c0derhin0-wp.com') {
          lsOutput = ['clue.sh'];
        } else if (currentDirectoryRef.current === 'secret') {
          lsOutput = isAll
            ? ['secret.sh', '.hidden_flag']
            : [];
        }

        if (lsOutput.length > 0) {
          displayCommandOutput(lsOutput, 'normal');
        } else {
          writePrompt();
        }
      } else if (cmd === 'pwd') {
        const pwdOutput = `/Users/${TERMINAL_CONFIG.appearance.host}/Internet/${currentDirectoryRef.current}`;
        displayCommandOutput([pwdOutput], 'normal');
      } else if (cmd === 'run' || cmd.startsWith('run ')) {
        const param = args.join(' ').trim();
        const validFiles: string[] = [];
        if (currentDirectoryRef.current === 'c0derhin0-wp.com') {
          validFiles.push('clue.sh');
        }
        if (currentDirectoryRef.current === 'secret') {
          validFiles.push('secret.sh', '.hidden_flag');
        }
        if (!param) {
          displayCommandOutput(['run requires a parameter. Usage: run [file]'], 'error');
          return;
        }
        if (param === 'viral_strain.sh') {
          displayCommandOutput(['ACCESS VIOLATION: execution blocked.'], 'error');
          setShowJumpscare(true);
          return;
        }
        if (!validFiles.includes(param)) {
          displayCommandOutput([`No file found with name ${param}`], 'error');
          return;
        }

        isFetchingRef.current = true;
        setIsFetching(true);
        pendingCommandRef.current = { command, type: 'run', param };
        if (fetchingLoaderRef.current) {
          fetchingLoaderRef.current.start();
        }
      }
      return;
    }

    const socialCommand = (commandsData as any[]).find((c) => c.cmd === cmd);
    if (socialCommand) {
      isFetchingRef.current = true;
      setIsFetching(true);
      pendingCommandRef.current = { command: cmd, type: 'command' };
      if (fetchingLoaderRef.current) {
        fetchingLoaderRef.current.start();
      }
      if (glitchEnabled) {
        setGlitchTriggerKey((prev) => prev + 1);
      }
      return;
    }

    displayCommandOutput([`Command not found: ${cmd}`], 'error');
  };

  return {
    printBannerAndWelcome,
    writePrompt,
    clearTerminal,
    displayCommandOutput,
    executePendingCommand,
    handleCommand
  };
};
