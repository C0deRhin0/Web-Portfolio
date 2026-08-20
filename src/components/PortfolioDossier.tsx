import React, { useRef, useState } from 'react';
import { playKeyboardSound } from '../utils/audioManager';
import { PROJECT_DETAILS } from '../data/projectDetails';

interface PortfolioDossierProps {
  onReturnToTerminal: () => void;
}

const EXPERIENCE = [
  ['Jun 2026 — Present', 'Cybersecurity Engineer', 'Nueca Technologies Inc.', 'Vice Chair, AI Transformation Team · Compliance Officer for Privacy. Global administration of Entra ID, Microsoft 365, and Azure for 55 users; Zero-Trust controls, production AI systems, and privacy operations.'],
  ['Nov 2025 — Apr 2026', 'AI Engineer, LLM Training & Data', 'Mindrift', 'Delivered 3,200+ annotated data samples and built a Python, BeautifulSoup, and Selenium pipeline that reduced per-task manual processing by about 85%.'],
  ['Sep 2025 — May 2026', 'Cybersecurity Associate (Part-Time)', 'Nueca Technologies Inc.', 'Delivered network and email security, privacy compliance, security orientations, consulting, AI orchestration, and ERP development for a 55-person organization.'],
  ['May 2025 — Jul 2025', 'Network & Cloud Security Analyst Intern', 'Nueca Technologies Inc.', 'Audited legacy infrastructure, deployed Wazuh SIEM/HIDS, improved macOS CIS compliance, migrated services to Kubernetes, and resolved SPF, DKIM, and DMARC gaps.']
];

const PortfolioDossier: React.FC<PortfolioDossierProps> = ({ onReturnToTerminal }) => {
  const [activeSection, setActiveSection] = useState('about');
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'view' | 'help' | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [statusText, setStatusText] = useState('Ready.');
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState<{ width: number; height: number } | null>(null);
  const [isWindowPositioned, setIsWindowPositioned] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number; left: number; top: number; edge: string } | null>(null);
  const contentRef = useRef<HTMLElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  const selectSection = (section: string) => {
    setActiveSection(section);
    setIsStartOpen(false);
    setOpenMenu(null);
    setStatusText(`${section}.txt opened.`);
  };

  const togglePortfolioWindow = () => setIsMinimized((value) => !value);
  const isCompactWindow = Boolean(windowSize && windowSize.width < 700);
  const folderEntries = [
    { key: 'about', label: 'readme.txt' },
    { key: 'projects', label: 'projects.txt' },
    { key: 'experience', label: 'experience.txt' },
    { key: 'skills', label: 'skills.txt' },
    { key: 'contact', label: 'contact.txt' }
  ];
  const currentFileName = folderEntries.find((entry) => entry.key === activeSection)?.label ?? 'readme.txt';

  const copyContactAddress = async () => {
    try {
      await navigator.clipboard.writeText('pauloperez9754@gmail.com');
      setStatusText('Email address copied to Clipboard.');
    } catch (error) {
      setStatusText('Email: pauloperez9754@gmail.com');
    }
    setOpenMenu(null);
  };

  const selectAllRecords = () => {
    const content = contentRef.current;
    if (content) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(content);
      selection?.removeAllRanges();
      selection?.addRange(range);
      setStatusText('All visible portfolio records selected.');
    }
    setOpenMenu(null);
  };

  const startWindowDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (isMaximized || (event.target as HTMLElement).closest('button')) {
      return;
    }
    const windowElement = event.currentTarget.parentElement;
    const desktopElement = desktopRef.current;
    if (!windowElement || !desktopElement) {
      return;
    }
    const windowRect = windowElement.getBoundingClientRect();
    const desktopRect = desktopElement.getBoundingClientRect();
    const currentPosition = { x: windowRect.left - desktopRect.left, y: windowRect.top - desktopRect.top };
    setWindowPosition(currentPosition);
    setIsWindowPositioned(true);
    dragStartRef.current = { x: event.clientX, y: event.clientY, left: currentPosition.x, top: currentPosition.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveWindow = (event: React.PointerEvent<HTMLElement>) => {
    const resizeStart = resizeStartRef.current;
    if (resizeStart) {
      const deltaX = event.clientX - resizeStart.x;
      const deltaY = event.clientY - resizeStart.y;
      const resizeFromWest = resizeStart.edge.includes('w');
      const resizeFromNorth = resizeStart.edge.includes('n');
      const nextWidth = Math.max(480, Math.min(window.innerWidth * 1.2, resizeStart.width + (resizeFromWest ? -deltaX : deltaX)));
      const nextHeight = Math.max(360, Math.min(window.innerHeight * 1.2, resizeStart.height + (resizeFromNorth ? -deltaY : deltaY)));
      setWindowSize({ width: nextWidth, height: nextHeight });
      setWindowPosition({
        x: resizeFromWest ? resizeStart.left + resizeStart.width - nextWidth : resizeStart.left,
        y: resizeFromNorth ? resizeStart.top + resizeStart.height - nextHeight : resizeStart.top
      });
      return;
    }
    const dragStart = dragStartRef.current;
    if (!dragStart || isMaximized) {
      return;
    }
    const nextX = Math.max(-window.innerWidth * 0.45, Math.min(window.innerWidth * 0.45, dragStart.left + event.clientX - dragStart.x));
    const nextY = Math.max(-window.innerHeight * 0.2, Math.min(window.innerHeight * 0.65, dragStart.top + event.clientY - dragStart.y));
    setWindowPosition({ x: nextX, y: nextY });
  };

  const finishWindowDrag = (event: React.PointerEvent<HTMLElement>) => {
    dragStartRef.current = null;
    resizeStartRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const startWindowResize = (event: React.PointerEvent<HTMLElement>, edge: string) => {
    if (isMaximized) {
      return;
    }
    const windowElement = (event.currentTarget.parentElement as HTMLElement | null);
    if (!windowElement) {
      return;
    }
    const rect = windowElement.getBoundingClientRect();
    const desktopRect = desktopRef.current?.getBoundingClientRect();
    const currentPosition = desktopRect
      ? { x: rect.left - desktopRect.left, y: rect.top - desktopRect.top }
      : windowPosition;
    setWindowPosition(currentPosition);
    setIsWindowPositioned(true);
    resizeStartRef.current = { x: event.clientX, y: event.clientY, width: rect.width, height: rect.height, left: currentPosition.x, top: currentPosition.y, edge };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handleDesktopClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button, a')) {
      playKeyboardSound();
    }
  };

  return (
    <div className={`win95-desktop${isMaximized ? ' win95-desktop--maximized' : ''}`} onClickCapture={handleDesktopClick} ref={desktopRef}>
      <div className="win95-icons"><button onClick={togglePortfolioWindow} type="button"><span>▣</span><small>My Portfolio</small></button></div>
      {!isMinimized && <main className={`win95-window${isWindowPositioned ? ' win95-window--positioned' : ''}`} aria-label="Wilfredo Paulo Perez III portfolio" style={{ transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)`, width: windowSize?.width, height: windowSize?.height }}>
        <header className="win95-titlebar" onPointerDown={startWindowDrag} onPointerMove={moveWindow} onPointerUp={finishWindowDrag} onPointerCancel={finishWindowDrag}><span className="win95-titlebar__mark">▣</span><strong>Wilfredo Paulo Perez III — Portfolio</strong><div><button aria-label="Minimize" onClick={() => setIsMinimized(true)} type="button">_</button><button aria-label="Maximize" onClick={() => { setIsMaximized((value) => !value); setWindowPosition({ x: 0, y: 0 }); }} type="button">□</button><button aria-label="Close" onClick={() => setShowExitDialog(true)} type="button">×</button></div></header>
        <nav className="win95-menubar" aria-label="Portfolio navigation"><button onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')} type="button">File</button><button onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')} type="button">Edit</button><button onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')} type="button">View</button><button onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')} type="button">Help</button>{openMenu && <div className="win95-dropdown">{openMenu === 'file' && <><button onClick={() => setShowExitDialog(true)} type="button">Exit Portfolio</button><button onClick={onReturnToTerminal} type="button">Open Terminal…</button></>}{openMenu === 'edit' && <><button onClick={copyContactAddress} type="button">Copy contact address</button><button onClick={selectAllRecords} type="button">Select All</button></>}{openMenu === 'view' && <><button onClick={() => { setShowToolbar((value) => !value); setOpenMenu(null); }} type="button">{showToolbar ? 'Hide' : 'Show'} Toolbar</button><button onClick={() => { setShowSidebar((value) => !value); setOpenMenu(null); }} type="button">{showSidebar ? 'Hide' : 'Show'} Folder Pane</button><button onClick={() => { setShowStatusBar((value) => !value); setOpenMenu(null); }} type="button">{showStatusBar ? 'Hide' : 'Show'} Status Bar</button></>}{openMenu === 'help' && <p>Portfolio.exe<br />Version 95.2026</p>}</div>}</nav>
        {showToolbar && !isCompactWindow && <div className="win95-toolbar"><button onClick={() => selectSection('about')} type="button">◀ Back</button><button onClick={() => selectSection('projects')} type="button">▰ Projects</button><button onClick={() => selectSection('contact')} type="button">✉ Contact</button><span>Address: <b>C:\portfolio\{currentFileName}</b></span></div>}
        <div className={`win95-body${showSidebar && !isCompactWindow ? '' : ' win95-body--without-sidebar'}`}>
          {showSidebar && !isCompactWindow && <aside className="win95-sidebar" aria-label="Portfolio folders">
            <p>portfolio</p>
            {folderEntries.map((entry) => <button className={activeSection === entry.key ? 'is-active' : ''} key={entry.key} onClick={() => selectSection(entry.key)} type="button"><span aria-hidden="true">{activeSection === entry.key ? '▣' : '▤'}</span> {entry.label}</button>)}
            <a href="/resume.pdf" target="_blank" rel="noreferrer"><span aria-hidden="true">▤</span> resume.pdf</a>
          </aside>}
          <section className="win95-content" ref={contentRef}>
            {activeSection === 'about' && <div className="win95-about">
              <div className="win95-about__hero"><div className="win95-monitor" aria-hidden="true"><div>WP</div></div><div><h1>Wilfredo Paulo<br />Perez III</h1><p>Cybersecurity engineer building privacy-conscious infrastructure and practical AI systems.</p><div className="win95-actions"><button onClick={() => selectSection('projects')} type="button">View selected work</button><button onClick={() => selectSection('contact')} type="button">Contact me</button></div></div></div>
              <div className="win95-notice"><b>System status:</b> Available for security, AI operations, and privacy-focused work.</div>
              <div className="win95-stats"><div><b>55</b><span>users supported across enterprise identity, cloud & security</span></div><div><b>6+</b><span>production AI systems maintained</span></div><div><b>80%</b><span>reduction in privileged-access vulnerabilities</span></div></div>
              <div className="win95-group"><h2>Profile</h2><p>I work where cybersecurity, AI operations, and data privacy meet—making complex internal systems safer, more useful, and easier to govern.</p></div>
            </div>}
            {activeSection === 'projects' && <div><h1>All projects</h1><div className="win95-projects">{PROJECT_DETAILS.map((project) => <article key={project.slug}><header><span>▣</span><div><h2><a href={project.link} target="_blank" rel="noreferrer">{project.title}</a></h2><p>{project.slug}</p></div></header><p className="win95-projects__stack">{project.stack}</p><p>{project.lines[0]}</p><footer><a href={project.link} target="_blank" rel="noreferrer">↗ Open project repository</a></footer></article>)}</div></div>}
            {activeSection === 'experience' && <div><h1>Experience</h1><div className="win95-list">{EXPERIENCE.map(([period, role, organization, detail]) => <article key={role}><p>{period}</p><div><h2>{role}</h2><h3>{organization}</h3><p>{detail}</p></div></article>)}</div></div>}
            {activeSection === 'skills' && <div><h1>Tools & foundations</h1><div className="win95-skill-grid"><article><h2>Security</h2><p>Wazuh SIEM · Suricata · Nmap · OpenVAS · Nessus · pfSense · MITRE ATT&CK · Data Privacy Compliance</p></article><article><h2>AI & automation</h2><p>RAG · Qdrant · Ollama · n8n · Whisper · FastAPI · Multi-agent orchestration · LLM training data</p></article><article><h2>Cloud & delivery</h2><p>Azure · AWS · Docker · Kubernetes · GitHub Actions · CI/CD · React · TypeScript</p></article><article><h2>Education & credentials</h2><p>B.S. Computer Science, Magna Cum Laude · Ateneo de Naga University, 2022—2026<br /><br />ISC² CC · Google Cybersecurity · CCSP-AWS · CNSP · BTL0 · TOPCIT Level III</p></article></div></div>}
            {activeSection === 'contact' && <div className="win95-contact"><h1>Let’s talk.</h1><div className="win95-group"><h2>Message</h2><p>For security engineering, AI systems, cloud operations, and privacy-focused collaboration.</p><a className="win95-primary-link" href="mailto:pauloperez9754@gmail.com">✉ pauloperez9754@gmail.com</a></div><div className="win95-contact__links"><a href="https://linkedin.com/in/wppereziii" target="_blank" rel="noreferrer">▣ LinkedIn</a><a href="https://github.com/C0deRhin0" target="_blank" rel="noreferrer">▣ GitHub</a><a href="/resume.pdf" target="_blank" rel="noreferrer">▤ Download resume (PDF)</a></div></div>}
          </section>
        </div>
        {showStatusBar && <footer className="win95-statusbar"><span>{statusText}</span><span>{activeSection.toUpperCase()}</span></footer>}
        {!isMaximized && <><span className="win95-resize-handle win95-resize-handle--nw" onPointerDown={(event) => startWindowResize(event, 'nw')} onPointerMove={moveWindow} onPointerUp={finishWindowDrag} /><span className="win95-resize-handle win95-resize-handle--ne" onPointerDown={(event) => startWindowResize(event, 'ne')} onPointerMove={moveWindow} onPointerUp={finishWindowDrag} /><span className="win95-resize-handle win95-resize-handle--sw" onPointerDown={(event) => startWindowResize(event, 'sw')} onPointerMove={moveWindow} onPointerUp={finishWindowDrag} /><span className="win95-resize-handle win95-resize-handle--se" onPointerDown={(event) => startWindowResize(event, 'se')} onPointerMove={moveWindow} onPointerUp={finishWindowDrag} /></>}
      </main>}
      {showWelcome && <div className="win95-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="welcome-title"><div className="win95-dialog"><header id="welcome-title">Welcome to Portfolio.exe</header><div><span className="win95-dialog__icon">i</span><p>Welcome to the desktop portfolio of Wilfredo Paulo Perez III.<br /><br />Use the folders, menus, and taskbar to explore.</p></div><footer><button autoFocus onClick={() => setShowWelcome(false)} type="button">OK</button></footer></div></div>}
      {showExitDialog && <div className="win95-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="exit-title"><div className="win95-dialog"><header id="exit-title">Portfolio.exe</header><div><span className="win95-dialog__icon">?</span><p>Exit Portfolio.exe and return to the terminal?</p></div><footer><button onClick={onReturnToTerminal} type="button">Yes</button><button autoFocus onClick={() => setShowExitDialog(false)} type="button">No</button></footer></div></div>}
      <div className="win95-taskbar"><button className="win95-start" onClick={() => setIsStartOpen((open) => !open)} type="button">▣ Start</button>{isStartOpen && <div className="win95-start-menu"><b>Wilfredo Paulo Perez III</b><button onClick={() => { setIsStartOpen(false); togglePortfolioWindow(); }} type="button">▣ Portfolio</button><button onClick={onReturnToTerminal} type="button">▸ Terminal mode</button></div>}<button className={`win95-taskbar__app${isMinimized ? ' is-minimized' : ''}`} onClick={togglePortfolioWindow} type="button">▣ Portfolio</button><time>2026</time></div>
    </div>
  );
};

export default PortfolioDossier;
