# CODERHINO Terminal Portfolio

An interactive hacker-terminal web portfolio built with Next.js, TypeScript, and xterm.js. Experience a fully functional terminal interface in your browser with ASCII art, typewriter effects, and extensible commands.

## 🚀 Features

- **Interactive Terminal**: Real terminal experience with xterm.js
- **ASCII Art Banners**: Custom rhino and CODERHINO branding
- **Typewriter Effects**: Animated command outputs with configurable timing
- **Command History**: Navigate through previous commands with arrow keys
- **Responsive Design**: Works on desktop and mobile devices
- **Static Export**: Fully static site that can be deployed anywhere
- **Extensible**: Easy to add new commands via JSON configuration

## 🛠️ Tech Stack

- **Next.js 15** - React framework with static export
- **TypeScript** - Type-safe development
- **xterm.js** - Terminal emulator for the browser

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/C0deRhin0/Web-Portfolio.git
   cd Web-Portfolio
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
Or use any static file server to serve the `out/` directory.

## 🚀 Deployment

### GitHub Pages
1. Build the project: `npm run build`
2. Push the `out/` directory to the `gh-pages` branch
3. Enable GitHub Pages in your repository settings

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Deploy!

### Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and deploy
3. The static export will be handled automatically

### Any Static Hosting
Since this generates a fully static site, you can deploy to any static hosting service:
- AWS S3 + CloudFront
- Firebase Hosting
- And many more!

## 📝 Adding New Commands

The portfolio is designed to be easily extensible. To add new commands:

### 1. Edit `src/data/commands.json`

Add a new command object to the array:

```json
{
  "cmd": "skills",
  "desc": "My technical skills",
  "outputLines": [
    "Languages: JavaScript, TypeScript, Python, Go",
    "Frontend: React, Next.js, Vue.js",
    "Backend: Node.js, Express, Django",
    "DevOps: Docker, Kubernetes, AWS",
    "Security: Penetration Testing, CTF"
  ]
}
```

### 2. Rebuild the Project

```bash
npm run build
```

That's it! No code changes required. The new command will be available immediately.

### Command Structure

Each command object has three properties:

- **`cmd`** (string): The command name users type
- **`desc`** (string): Description shown in the help menu
- **`outputLines`** (string[]): Array of lines to display with typewriter effect

### Built-in Commands

- `help` - Shows all available commands
- `clear` - Clears the terminal and shows banner
- `whoami` - About me information
- `projects` - My projects
- `experiences` - Work and education history

## 🎨 Customization

### Styling
Edit `src/styles/globals.css` to customize:
- Terminal colors and theme
- Font family and sizes
- Cursor animation
- Responsive breakpoints

### Terminal Configuration
Modify the terminal settings in `src/components/Terminal.tsx`:
- Font size and family
- Color scheme
- Terminal dimensions
- Scrollback buffer size

### ASCII Art
Update the banner in `src/components/Banner.tsx` or `src/components/Terminal.tsx` to change the ASCII art.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run export` - Build and export static files
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
Web-Portfolio/
├── public/                   # Static assets
├── src/
│   ├── components/
│   │   ├── Terminal.tsx      # Main terminal component
│   │   ├── Banner.tsx        # ASCII art banner
│   │   └── CommandOutput.tsx # Typewriter effect wrapper
│   ├── data/
│   │   └── commands.json     # Command definitions
│   ├── pages/
│   │   ├── _app.tsx          # Next.js app config
│   │   └── index.tsx         # Main page
│   └── styles/
│       └── globals.css       # Global styles
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 👨‍💻 Author

**Paulo "C0DERHIN0" Perez**
- Cybersecurity Enthusiast
- Bicol, Philippines

---

*Built with ❤️ and lots of terminal love*