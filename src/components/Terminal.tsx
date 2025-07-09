import React, { useEffect, useRef, useState } from 'react';
import Banner from './Banner';
import CommandOutput from './CommandOutput';
import commandsData from '../data/commands.json';

interface Command {
  cmd: string;
  desc: string;
  outputLines: string[];
}

/**
 * Main Terminal component that handles the interactive terminal interface
 * Integrates xterm.js with custom command processing and typewriter effects
 */
const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize xterm.js terminal - only once
  useEffect(() => {
    // Only run on client and if not already initialized
    if (typeof window === 'undefined' || !terminalRef.current || isInitialized) return;

    let Terminal: any, FitAddon: any;
    let terminal: any, fitAddon: any;

    (async () => {
      try {
        const xtermPkg = await import('@xterm/xterm');
        const fitPkg = await import('@xterm/addon-fit');
        await import('@xterm/xterm/css/xterm.css');
        Terminal = xtermPkg.Terminal;
        FitAddon = fitPkg.FitAddon;

        terminal = new Terminal({
          cursorBlink: true,
          theme: {
            background: '#1e1e1e',
            foreground: '#cfcfcf',
            cursor: '#cfcfcf',
            black: '#000000',
            red: '#cd3131',
            green: '#0dbc79',
            yellow: '#e5e510',
            blue: '#2472c8',
            magenta: '#bc3fbc',
            cyan: '#11a8cd',
            white: '#e5e5e5',
            brightBlack: '#666666',
            brightRed: '#f14c4c',
            brightGreen: '#23d18b',
            brightYellow: '#f5f543',
            brightBlue: '#3b8eea',
            brightMagenta: '#d670d6',
            brightCyan: '#29b8db',
            brightWhite: '#ffffff'
          },
          fontFamily: 'Source Code Pro, monospace',
          fontSize: 14,
          lineHeight: 1.2,
          scrollback: 1000,
          cols: 80,
          rows: 24
        });

        fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(terminalRef.current);
        fitAddon.fit();

        // Store references
        xtermRef.current = terminal;
        fitAddonRef.current = fitAddon;
        setIsInitialized(true);

        // Display initial banner
        displayBanner();
        writePrompt();

        // Handle window resize
        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        // Handle terminal input
        let currentLine = '';
        terminal.onData((data: string) => {
          if (isTyping) return; // Don't accept input while typing

          const code = data.charCodeAt(0);
          
          if (code === 13) { // Enter key
            handleCommand(currentLine.trim());
            currentLine = '';
            setCurrentCommand('');
            setHistoryIndex(-1);
          } else if (code === 127) { // Backspace
            if (currentLine.length > 0) {
              currentLine = currentLine.slice(0, -1);
              setCurrentCommand(currentLine);
              terminal.write('\b \b');
            }
          } else if (code === 27) { // Escape sequence
            // Handle arrow keys
            if (data.length >= 3 && data[1] === '[') {
              const arrowCode = data[2];
              if (arrowCode === 'A') { // Up arrow
                navigateHistory('up');
              } else if (arrowCode === 'B') { // Down arrow
                navigateHistory('down');
              }
            }
          } else if (code >= 32) { // Printable characters
            currentLine += data;
            setCurrentCommand(currentLine);
            terminal.write(data);
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

  // Display the ASCII art banner
  const displayBanner = () => {
    if (!xtermRef.current) return;
    
    const rhinoArt = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡐⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡔⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⣼⢹⠀⠀⠀⠀⠀⠀⡀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣐⣠⣄⣐⡀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣼⣿⢹⠀⠀⠀⠀⡜⢲⡖⣶⣦⠀⠀⠀⡄⠀⠀⡄⢪⣾⠋⠀⣴⣾⣿⡗⢡⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⢡⡏⢾⡟⠀⠀⠀⠰⢰⡌⣿⠄⡬⣷⣩⠶⡾⠟⠛⠶⡾⠃⣠⣾⣿⣿⠄⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⡀⣾⠀⢾⣇⠅⠀⠀⠀⣾⣷⡹⣤⣿⠟⠁⠐⠀⠀⠀⠈⠰⠾⢿⣿⠿⠋⡌⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢡⡏⠀⡀⢿⡌⡀⠀⡇⣿⠌⢷⣴⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠈⠛⠳⢦⣅⡠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠡⠸⣿⡔⠀⡇⣿⠈⠄⠻⣿⡀⠀⠀⠀⠀⠀⠀⠀⣀⢀⡀⠀⠀⠀⡙⢿⣦⡀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠂⢹⣿⣮⡂⢻⡀⠈⠀⠈⠙⠶⡄⠀⠀⣠⠆⠀⠀⠠⡀⠀⠂⠀⠀⡀⠹⣿⡌⠄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⡜⣧⠀⠀⠈⠀⠻⡌⠻⣮⣷⣐⢄⡀⠢⣰⠏⠀⢰⣏⠀⠀⠀⠀⠙⣦⡀⠀⢂⠠⠀⢻⣿⡐⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠠⢻⡄⠀⠀⠀⠢⡙⠄⠀⠉⠛⠿⣿⡛⠁⠀⠀⡏⢸⠆⠀⢀⡤⠀⠘⣷⡄⠀⢢⠀⢸⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢊⢷⡀⠀⠀⠀⠀⠢⠀⠀⠀⠀⠀⢹⡆⠀⢠⣧⠏⢀⣴⣿⠀⠀⢈⣿⣿⡀⠈⠀⣼⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠊⢻⣄⠀⢄⠀⠀⠈⠐⠠⡀⠀⢼⡇⠠⠊⠁⢠⠎⣠⣿⠀⣠⣾⣿⣿⣧⠀⢰⣿⣿⢱⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠝⢧⣄⠳⣦⣀⠀⠀⠠⢈⡾⢁⡶⠛⢶⣇⠀⢡⣿⣾⣿⣿⣿⣿⣿⢠⣿⢟⡟⡁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⡍⣿⠶⢿⣿⡶⠶⠋⠀⠊⠀⣾⠀⣿⣴⣿⠿⠿⢿⣿⣿⣿⣿⣿⠟⡁⠑⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⢯⣀⠀⠀⠀⠀⠀⠀⣀⣀⣙⣤⣿⣿⢃⠀⠀⠁⠜⣿⣿⡿⠫⠀⠣⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢆⢿⡶⠶⠶⣶⣶⣤⣤⣨⣽⡿⠋⠑⠀⠀⠀⠀⢰⢸⠟⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠀⠀⠜⠛⠿⢿⣿⠟⠘⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;

    const coderhinoArt = `      _____           _____         _____        ______        _____    ____   ____  ____  _____   ______           _____    
  ___|\\    \\     ____|\\    \\    ___|\\    \\   ___|\\     \\   ___|\\    \\  |    | |    ||    ||\\    \\ |\\     \\     ____|\\    \\   
 /    /\\    \\   /     /\\    \\  |    |\\    \\ |     \\     \\ |    |\\    \\ |    | |    ||    | \\\\    \\| \\     \\   /     /\\    \\  
|    |  |    | /     /  \\    \\ |    | |    ||     ,_____/||    | |    ||    |_|    ||    |  \\|    \\  \\     | /     /  \\    \\ 
|    |  |____||     |    |    ||    | |    ||     \\--'\\_|/|    |/____/ |    .-.    ||    |   |     \\  |    ||     |    |    |
|    |   ____ |     |    |    ||    | |    ||     /___/|  |    |\\    \\ |    | |    ||    |   |      \\ |    ||     |    |    |
|    |  |    ||\\     \\  /    /||    | |    ||     \\____|\\ |    | |    ||    | |    ||    |   |    |\\ \\|    ||\\     \\  /    /|
|\\ ___\\/    /|| \\_____\\/____/ ||____|/____/||____ '     /||____| |____||____| |____||____|   |____||\\_____/|| \\_____\\/____/ |
| |   /____/ | \\ |    ||    | /|    /    | ||    /_____/ ||    | |    ||    | |    ||    |   |    |/ \\|   || \\ |    ||    | /
 \\|___|    | /  \\|____||____|/ |____|____|/ |____|     | /|____| |____||____| |____||____|   |____|   |___|/  \\|____||____|/ 
   \\( |____|/      \\(    )/      \\(    )/     \\( |_____|/   \\(     )/    \\(     )/    \\(       \\(       )/       \\(    )/    
    '   )/          '    '        '    '       '    )/       '     '      '     '      '        '       '         '    '     
        '                                           '                                                                        `;

    // Split the ASCII art into lines
    const rhinoLines = rhinoArt.split('\n');
    const coderhinoLines = coderhinoArt.split('\n');
    
    // Find the maximum number of lines
    const maxLines = Math.max(rhinoLines.length, coderhinoLines.length);
    
    // Display the ASCII art side by side
    for (let i = 0; i < maxLines; i++) {
      const rhinoLine = rhinoLines[i] || '';
      const coderhinoLine = coderhinoLines[i] || '';
      xtermRef.current.write(rhinoLine + '  ' + coderhinoLine + '\r\n');
    }
    
    xtermRef.current.write('\r\n');
    xtermRef.current.write('Welcome to the CODERHINO Terminal Portfolio\r\n');
    xtermRef.current.write('Type \'help\' for available commands\r\n');
    xtermRef.current.write('\r\n');
  };

  // Write the terminal prompt
  const writePrompt = () => {
    if (!xtermRef.current) return;
    xtermRef.current.write('visitor@c0derhin0-wp.com:~$ ');
  };

  // Navigate command history
  const navigateHistory = (direction: 'up' | 'down') => {
    if (!xtermRef.current) return;
    
    if (direction === 'up' && historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const command = commandHistory[commandHistory.length - 1 - newIndex];
      setCurrentCommand(command);
      
      // Clear current line and write new command
      xtermRef.current.write('\rvisitor@c0derhin0-wp.com:~$ ');
      xtermRef.current.write(' '.repeat(currentCommand.length));
      xtermRef.current.write('\rvisitor@c0derhin0-wp.com:~$ ');
      xtermRef.current.write(command);
    } else if (direction === 'down' && historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const command = commandHistory[commandHistory.length - 1 - newIndex];
      setCurrentCommand(command);
      
      // Clear current line and write new command
      xtermRef.current.write('\rvisitor@c0derhin0-wp.com:~$ ');
      xtermRef.current.write(' '.repeat(currentCommand.length));
      xtermRef.current.write('\rvisitor@c0derhin0-wp.com:~$ ');
      xtermRef.current.write(command);
    } else if (direction === 'down' && historyIndex === 0) {
      setHistoryIndex(-1);
      setCurrentCommand('');
      
      // Clear current line
      xtermRef.current.write('\rvisitor@c0derhin0-wp.com:~$ ');
      xtermRef.current.write(' '.repeat(currentCommand.length));
      xtermRef.current.write('\rvisitor@c0derhin0-wp.com:~$ ');
    }
  };

  // Handle command execution
  const handleCommand = (command: string) => {
    if (!xtermRef.current) return;
    
    // Add command to history
    if (command.trim()) {
      setCommandHistory(prev => [...prev, command]);
    }
    
    xtermRef.current.write('\r\n');
    
    if (!command.trim()) {
      writePrompt();
      return;
    }
    
    const cmd = command.toLowerCase();
    
    if (cmd === 'help') {
      displayHelp();
    } else if (cmd === 'clear') {
      clearTerminal();
    } else {
      const commandData = (commandsData as Command[]).find(c => c.cmd === cmd);
      
      if (commandData) {
        displayCommandOutput(commandData.outputLines);
      } else {
        xtermRef.current.write(`command not found: ${command}\r\n`);
        writePrompt();
      }
    }
  };

  // Display help information
  const displayHelp = () => {
    if (!xtermRef.current) return;
    
    xtermRef.current.write('Available commands:\r\n\r\n');
    
    (commandsData as Command[]).forEach(cmd => {
      const padding = ' '.repeat(15 - cmd.cmd.length);
      xtermRef.current!.write(`  ${cmd.cmd}${padding} - ${cmd.desc}\r\n`);
    });
    
    xtermRef.current.write('\r\n');
    writePrompt();
  };

  // Clear the terminal
  const clearTerminal = () => {
    if (!xtermRef.current) return;
    
    xtermRef.current.clear();
    displayBanner();
    writePrompt();
  };

  // Display command output with typewriter effect
  const displayCommandOutput = (lines: string[]) => {
    if (!xtermRef.current) return;
    
    setIsTyping(true);
    
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    
    const typeNextChar = () => {
      if (currentLineIndex >= lines.length) {
        setIsTyping(false);
        xtermRef.current!.write('\r\n');
        writePrompt();
        return;
      }
      
      const currentLine = lines[currentLineIndex];
      
      if (currentCharIndex < currentLine.length) {
        xtermRef.current!.write(currentLine[currentCharIndex]);
        currentCharIndex++;
        setTimeout(typeNextChar, 50);
      } else {
        xtermRef.current!.write('\r\n');
        currentLineIndex++;
        currentCharIndex = 0;
        setTimeout(typeNextChar, 200);
      }
    };
    
    typeNextChar();
  };

  return (
    <div className="terminal-container">
      <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default Terminal; 