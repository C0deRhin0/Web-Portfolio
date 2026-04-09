# CODERHINO Terminal Portfolio

An interactive, highly immersive "hacker-terminal" web portfolio built with Next.js, TypeScript, and xterm.js. Experience a fully functional terminal interface in your browser complete with ASCII art, typewriter effects, CRT scanlines, and an authentic boot sequence.

## 🚀 Features

- **Immersive Boot Sequence**: Authentic Linux-style kernel loading animation.
- **Interactive Terminal**: Real terminal experience powered by `xterm.js` and custom parsing logic.
- **Visual Effects**: Matrix-style binary rain, CRT monitor scanlines, and glitch transitions.
- **Auditory Experience**: Mechanical keyboard typing sounds and audio cues (toggleable).
- **Themes & ASCII Art**: Custom rhino branding, dynamic theme switching (Green, Amber, Monochrome).
- **System Tools**: Built-in mock commands like `top`, `htop`, `neofetch`, and `matrix` mode.
- **Hidden CTF Challenges**: Find hidden flags and secret files spread across the application.
- **Responsive Design**: Adapts cleanly from ultra-wide monitors down to mobile devices.
- **Extensible Architecture**: Easy to add new commands via JSON configuration.

## 🛠️ Tech Stack

- **Next.js 15** - React framework with static export
- **TypeScript** - Type-safe development
- **xterm.js** - Terminal emulator for the browser
- **CSS Modules & Custom CSS** - No heavy component libraries, just pure styling

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/C0deRhin0/Web-Portfolio.git
   cd Web-Portfolio/codebase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## 🏃‍♂️ Development

### Run in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Build for Production
```bash
npm run build
```
This creates a static export in the `out/` directory.

### Preview Production Build
```bash
npx serve out/
```

## 📝 Adding New Commands

The portfolio is designed to be easily extensible. To add new commands, edit `src/data/commands.json`.

```json
{
  "cmd": "skills",
  "desc": "My technical skills",
  "category": "Portfolio",
  "outputLines": [
    "Languages: JavaScript, TypeScript, Python, Go",
    "Security: Penetration Testing, CTF"
  ]
}
```

The terminal's `help` command automatically picks up new entries defined in the JSON file.

### Built-in Commands

- `help` - Shows all available commands dynamically
- `clear` - Clears the terminal and shows the welcome banner
- `whoami` / `projects` / `skills` - Portfolio content
- `cd` / `ls` / `run` - Simulated filesystem commands
- `theme [1/2/3]` - Change terminal color theme
- `effects [crt|glitch|sounds] [on/off]` - Toggle visual/audio enhancements
- `matrix` / `neofetch` / `top` - System tool simulations

## 🎨 Customization

- **Visual Effects**: Edit `src/components/effects/` and `src/components/BinaryRainOverlay.tsx`
- **Boot Sequence**: Tweak boot messages and kernel logs in `src/utils/bootMessages.ts`
- **Global Styling**: Update `--terminal-bg` and other variables in `src/styles/globals.css`

## 📁 Project Structure

```
src/
├── components/
│   ├── terminal/         # Core terminal components & handlers
│   ├── effects/          # CRT, Glitch, Audio components
│   └── BootSequence.tsx  # Initial loading screen
├── data/
│   └── commands.json     # Dynamic command definitions
├── styles/
│   └── globals.css       # Global styles & variables
├── utils/
│   └── commandParsing.ts # Tokenizer and command logic
└── pages/
    └── index.tsx         # Main entry point
```

## 👨‍💻 Author

**Paulo "C0DERHIN0" Perez**
- Cybersecurity Enthusiast
- Bicol, Philippines

---

*Built with ❤️ and lots of terminal love. Can you find all the flags?*
