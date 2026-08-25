import React, { useEffect, useRef, useState } from 'react';
import { playKeyboardSound } from '../utils/audioManager';
import { PROJECT_DETAILS, type ProjectDetail } from '../data/projectDetails';
import GitHubActivity from './GitHubActivity';

interface PortfolioDossierProps {
  onReturnToTerminal: () => void;
}

const EXPERIENCE = [
  ['Jun 2026 — Present', 'Cybersecurity Engineer', 'Nueca Technologies Inc.', 'Vice Chair, AI Transformation Team · Compliance Officer for Privacy. Global administration of Entra ID, Microsoft 365, and Azure for 55 users; Zero-Trust controls, production AI systems, and privacy operations.'],
  ['Nov 2025 — Apr 2026', 'AI Engineer, LLM Training & Data', 'Mindrift', 'Delivered 3,200+ annotated data samples and built a Python, BeautifulSoup, and Selenium pipeline that reduced per-task manual processing by about 85%.'],
  ['Sep 2025 — May 2026', 'Cybersecurity Associate (Part-Time)', 'Nueca Technologies Inc.', 'Delivered network and email security, privacy compliance, security orientations, consulting, AI orchestration, and ERP development for a 55-person organization.'],
  ['May 2025 — Jul 2025', 'Network & Cloud Security Analyst Intern', 'Nueca Technologies Inc.', 'Audited legacy infrastructure, deployed Wazuh SIEM/HIDS, improved macOS CIS compliance, migrated services to Kubernetes, and resolved SPF, DKIM, and DMARC gaps.']
];

const FEATURED_SLUGS = ['privacy-gateway', 'a2a-lobby', 'n8n-rag-chatbot', 'ai-centric-email-security', 'corp-mind-ai', 'home-lab-firewall'];
const LAB_SLUGS = ['keylogger-py', 'offensive-python-scripts', 'vulnerable-smart-contract', 'simple-port-scanner', 'juiceshop-penetration', 'new-trashtrackr'];
const ENGINEERING_GROUPS = [
  { title: 'AI & Agent Systems', slugs: ['privacy-first-agent-harness', 'semantic-chunk-router', 'receipt-hybrid-ocr', 'langgraph-research-pilot', 'whisper-local', 'vector-mind-ai', 'opencode-cheatscale'] },
  { title: 'Security & Privacy', slugs: ['forensic-security-analysis-suite', 'automated-system-logging', 'oncall-notification-public', 'oncall-notification-local'] },
  { title: 'Cloud / Infrastructure', slugs: ['aws-cloud-devsecops', 'adnu-cevas-lamp', 'led-entropy'] },
  { title: 'Research & Experiments', slugs: ['web-portfolio', 'hybridrf-iot-ids'] }
];

type ProjectFilterKey = 'all' | 'featured' | 'ai' | 'security' | 'cloud' | 'research' | 'labs';

const PROJECT_FILTERS: Array<{ key: ProjectFilterKey; label: string; slugs?: string[] }> = [
  { key: 'all', label: 'All projects' },
  { key: 'featured', label: 'Featured', slugs: FEATURED_SLUGS },
  { key: 'ai', label: 'AI & Agent Systems', slugs: ['a2a-lobby', 'privacy-gateway', 'privacy-first-agent-harness', 'semantic-chunk-router', 'ai-centric-email-security', 'receipt-hybrid-ocr', 'n8n-rag-chatbot', 'langgraph-research-pilot', 'whisper-local', 'corp-mind-ai', 'vector-mind-ai', 'opencode-cheatscale'] },
  { key: 'security', label: 'Security & Privacy', slugs: ['privacy-gateway', 'privacy-first-agent-harness', 'home-lab-firewall', 'ai-centric-email-security', 'oncall-notification-public', 'forensic-security-analysis-suite', 'keylogger-py', 'offensive-python-scripts', 'automated-system-logging', 'vulnerable-smart-contract', 'simple-port-scanner', 'hybridrf-iot-ids', 'juiceshop-penetration', 'oncall-notification-local'] },
  { key: 'cloud', label: 'Cloud / Infrastructure', slugs: ['home-lab-firewall', 'adnu-cevas-lamp', 'aws-cloud-devsecops', 'oncall-notification-public', 'oncall-notification-local'] },
  { key: 'research', label: 'Research & Experiments', slugs: ['web-portfolio', 'semantic-chunk-router', 'led-entropy', 'langgraph-research-pilot', 'hybridrf-iot-ids'] },
  { key: 'labs', label: 'Security Labs', slugs: LAB_SLUGS }
];

const CASE_STUDY_NOTES: Record<string, { problem: string; constraints: string; architecture: string; decisions: string }> = {
  'privacy-gateway': {
    problem: 'Sensitive internal prompts needed a reliable path to external AI providers without placing privacy hygiene on individual employees.',
    constraints: 'Privacy-sensitive enterprise operations, provider compatibility, JSON and streaming responses, and fail-closed behavior when contextual protections cannot run.',
    architecture: 'Employee app → secret redaction → contextual pseudonymization → PII detection → external LLM → output DLP → employee app',
    decisions: 'Request-scoped opaque tokens, output DLP, configurable BASE/STANDARD/STRICT modes, and fail-closed contextual routes make privacy controls enforceable at the gateway.'
  },
  'a2a-lobby': {
    problem: 'Employee AI agents needed governed direct handoffs without exposing private sessions, memories, credentials, or local context.',
    constraints: 'Durable delivery, explicit human control, private 1:1 exchanges, and auditable agreement between participants.',
    architecture: 'Agent A → A2A/MCP lobby → PostgreSQL message record → Redis delivery → bilateral approval → Agent B',
    decisions: 'One-time hashed invitations, acknowledgement-driven turns, and immutable SHA-256 agreement versions put governance into the protocol rather than documentation.'
  },
  'n8n-rag-chatbot': {
    problem: 'Support teams needed faster, more consistent answers than manual FAQ lookup could provide.',
    constraints: 'Multi-turn conversations, company knowledge retrieval, real-time web sessions, and practical operational deployment.',
    architecture: 'Customer query → Node.js session proxy → n8n workflow → OpenAI embeddings → Qdrant retrieval → cited response',
    decisions: 'The ingestion pipeline and vector store keep knowledge updates separate from the live response path for maintainable operations.'
  },
  'ai-centric-email-security': {
    problem: 'Security response drafting was taking analyst time away from higher-value investigation work.',
    constraints: 'Email context, consistent tone, monitored mailboxes, and keeping a human in the response loop.',
    architecture: 'Security alert → Power Automate → n8n orchestration → LLM draft → analyst review → response',
    decisions: 'The system drafts rather than autonomously sends, preserving analyst ownership over security communications.'
  },
  'corp-mind-ai': {
    problem: 'HR needed traceable answers from internal documents without employee data leaving the network.',
    constraints: 'On-premise deployment, page-level traceability, hybrid retrieval, and operational diagnostics.',
    architecture: 'Internal documents → ingestion admin → Qdrant hybrid search → Ollama → source-cited HR response',
    decisions: 'RRF fusion, page citations, a TTL cache, and health diagnostics make retrieval both explainable and maintainable.'
  },
  'home-lab-firewall': {
    problem: 'A home lab needed meaningful segmentation and visibility to test defensive controls safely.',
    constraints: 'VLAN separation, IDS/IPS visibility, east-west traffic control, and repeatable threat simulations.',
    architecture: 'Devices → VLAN segmentation → pfSense policy layer → Suricata IDS/IPS → security telemetry',
    decisions: 'Policy-based rules and real-time IDS visibility make lateral-movement testing observable rather than theoretical.'
  }
};

const METRICS = [
  ['55', 'users supported across enterprise identity, cloud & security', 'Scope: Entra ID, Microsoft 365, Azure, LAN, and security operations supporting 55 employees across five departments.'],
  ['6+', 'production AI systems maintained', 'Count: RAG, hybrid OCR, offline transcription, AI orchestration, an on-premise HR assistant, and an email security responder.'],
  ['~80%', 'reduction in privileged-access vulnerabilities', 'Measured from identified privileged-access exposure before and after Zero-Trust role restriction and tenant-role remediation.']
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
  const [activeCaseStudy, setActiveCaseStudy] = useState<string | null>(null);
  const [metricDetail, setMetricDetail] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<ProjectFilterKey>('all');
  const dragStartRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number; left: number; top: number; edge: string } | null>(null);
  const contentRef = useRef<HTMLElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const hasModal = showWelcome || showExitDialog || Boolean(metricDetail);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showExitDialog) {
          setShowExitDialog(false);
        } else if (metricDetail) {
          setMetricDetail(null);
        } else if (showWelcome) {
          setShowWelcome(false);
        } else if (openMenu) {
          setOpenMenu(null);
        } else if (isStartOpen) {
          setIsStartOpen(false);
        }
        return;
      }

      if (event.key !== 'Tab' || !hasModal || !dialogRef.current) {
        return;
      }

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hasModal, isStartOpen, metricDetail, openMenu, showExitDialog, showWelcome]);

  useEffect(() => {
    if (!hasModal) {
      return;
    }
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusFrame = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>('button, [href]')?.focus();
    });
    return () => {
      window.cancelAnimationFrame(focusFrame);
      previouslyFocused?.focus();
    };
  }, [hasModal]);

  const selectSection = (section: string) => {
    setActiveSection(section);
    setIsStartOpen(false);
    setOpenMenu(null);
    setStatusText(`${section}.txt opened.`);
    setActiveCaseStudy(null);
    window.requestAnimationFrame?.(() => contentRef.current?.focus());
  };

  const openCaseStudy = (slug: string) => {
    setActiveSection('projects');
    setActiveCaseStudy(slug);
    setStatusText('Case study opened.');
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
  const featuredProjects = FEATURED_SLUGS
    .map((slug) => PROJECT_DETAILS.find((project) => project.slug === slug))
    .filter((project): project is (typeof PROJECT_DETAILS)[number] => Boolean(project));
  const nonFeaturedProjects = PROJECT_DETAILS.filter((project) => !FEATURED_SLUGS.includes(project.slug) && !LAB_SLUGS.includes(project.slug));
  const labProjects = PROJECT_DETAILS.filter((project) => LAB_SLUGS.includes(project.slug));
  const activeProjectFilter = PROJECT_FILTERS.find((filter) => filter.key === projectFilter) ?? PROJECT_FILTERS[0];
  const filteredProjects = projectFilter === 'all'
    ? PROJECT_DETAILS
    : PROJECT_DETAILS.filter((project) => activeProjectFilter.slugs?.includes(project.slug));
  const selectedCaseStudy = activeCaseStudy ? PROJECT_DETAILS.find((project) => project.slug === activeCaseStudy) : null;
  const selectedCaseNotes = activeCaseStudy ? CASE_STUDY_NOTES[activeCaseStudy] : null;

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
    const target = event.target as HTMLElement;
    if (!target.closest('.win95-menubar')) {
      setOpenMenu(null);
    }
    if (!target.closest('.win95-start-menu, .win95-start')) {
      setIsStartOpen(false);
    }
    if (target.closest('button, a')) {
      playKeyboardSound();
    }
  };

  const selectProjectFilter = (filter: ProjectFilterKey) => {
    setProjectFilter(filter);
    const label = PROJECT_FILTERS.find((item) => item.key === filter)?.label ?? 'All projects';
    setStatusText(`${label} filter applied.`);
  };

  const renderProjectCard = (project: ProjectDetail) => (
    <article key={project.slug}>
      <header><span aria-hidden="true">▣</span><div><h2>{project.title}</h2><p>{project.stack}</p></div></header>
      <p><b>What:</b> {project.lines[0]}</p>
      <p><b>Engineering:</b> {project.lines[1]}</p>
      <p><b>Impact:</b> {project.lines[2]}</p>
      <footer><button onClick={() => openCaseStudy(project.slug)} type="button">View case study →</button><a href={project.link} target="_blank" rel="noreferrer">GitHub ↗</a></footer>
    </article>
  );

  return (
    <div className={`win95-desktop${isMaximized ? ' win95-desktop--maximized' : ''}`} onClickCapture={handleDesktopClick} ref={desktopRef}>
      <div className="win95-icons" inert={hasModal}><button onClick={togglePortfolioWindow} type="button"><span aria-hidden="true">▣</span><small>My Portfolio</small></button></div>
      {!isMinimized && <main className={`win95-window${isWindowPositioned ? ' win95-window--positioned' : ''}`} aria-label="Wilfredo Paulo Perez III portfolio" inert={hasModal} style={{ transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)`, width: windowSize?.width, height: windowSize?.height }}>
        <header className="win95-titlebar" onPointerDown={startWindowDrag} onPointerMove={moveWindow} onPointerUp={finishWindowDrag} onPointerCancel={finishWindowDrag}><span className="win95-titlebar__mark">▣</span><strong>Wilfredo Paulo Perez III — Portfolio</strong><div><button aria-label="Minimize" onClick={() => setIsMinimized(true)} type="button">_</button><button aria-label="Maximize" onClick={() => { setIsMaximized((value) => !value); setWindowPosition({ x: 0, y: 0 }); }} type="button">□</button><button aria-label="Close" onClick={() => setShowExitDialog(true)} type="button">×</button></div></header>
        <nav className="win95-menubar" aria-label="Portfolio application menu">
          {(['file', 'edit', 'view', 'help'] as const).map((menu) => <button aria-controls={`win95-${menu}-menu`} aria-expanded={openMenu === menu} aria-haspopup="menu" key={menu} onClick={() => setOpenMenu(openMenu === menu ? null : menu)} type="button">{menu[0].toUpperCase() + menu.slice(1)}</button>)}
          {openMenu && <div className="win95-dropdown" id={`win95-${openMenu}-menu`} role="menu">
            {openMenu === 'file' && <><button onClick={() => setShowExitDialog(true)} role="menuitem" type="button">Exit Portfolio</button><button onClick={onReturnToTerminal} role="menuitem" type="button">Open Terminal…</button></>}
            {openMenu === 'edit' && <><button onClick={copyContactAddress} role="menuitem" type="button">Copy contact address</button><button onClick={selectAllRecords} role="menuitem" type="button">Select All</button></>}
            {openMenu === 'view' && <><button onClick={() => { setShowToolbar((value) => !value); setOpenMenu(null); }} role="menuitem" type="button">{showToolbar ? 'Hide' : 'Show'} Toolbar</button><button onClick={() => { setShowSidebar((value) => !value); setOpenMenu(null); }} role="menuitem" type="button">{showSidebar ? 'Hide' : 'Show'} Folder Pane</button><button onClick={() => { setShowStatusBar((value) => !value); setOpenMenu(null); }} role="menuitem" type="button">{showStatusBar ? 'Hide' : 'Show'} Status Bar</button></>}
            {openMenu === 'help' && <p role="note">Portfolio.exe<br />Version 95.2026</p>}
          </div>}
        </nav>
        {showToolbar && !isCompactWindow && <div className="win95-toolbar"><button onClick={() => selectSection('about')} type="button">◀ Back</button><button onClick={() => selectSection('projects')} type="button">▰ Projects</button><button onClick={() => selectSection('contact')} type="button">✉ Contact</button><span>Address: <b>C:\portfolio\{currentFileName}</b></span></div>}
        <div className={`win95-body${showSidebar && !isCompactWindow ? '' : ' win95-body--without-sidebar'}`}>
          {showSidebar && !isCompactWindow && <aside className="win95-sidebar" aria-label="Portfolio folders">
            <p>portfolio</p>
            {folderEntries.map((entry) => <button aria-current={activeSection === entry.key ? 'page' : undefined} className={activeSection === entry.key ? 'is-active' : ''} key={entry.key} onClick={() => selectSection(entry.key)} type="button"><span aria-hidden="true">{activeSection === entry.key ? '▣' : '▤'}</span> {entry.label}</button>)}
            <a href="/resume.pdf" target="_blank" rel="noreferrer"><span aria-hidden="true">▤</span> resume.pdf</a>
          </aside>}
          <section aria-label={`${currentFileName} content`} className="win95-content" ref={contentRef} tabIndex={-1}>
            {activeSection === 'about' && <div className="win95-about">
              <div className="win95-about__hero"><div className="win95-monitor" aria-hidden="true"><div>WP</div></div><div><h1>Wilfredo Paulo<br />Perez III</h1><p>Cybersecurity engineer building privacy-conscious infrastructure and practical AI systems.</p><div className="win95-actions"><button onClick={() => selectSection('projects')} type="button">View selected work</button><a className="win95-button" href="/resume.pdf" target="_blank" rel="noreferrer">Résumé (PDF) ↓</a></div><button className="win95-contact-link" onClick={() => selectSection('contact')} type="button">Contact me</button><button className="win95-mobile-terminal" onClick={onReturnToTerminal} type="button">Open terminal experience</button></div></div>
              <div className="win95-notice"><b>System status:</b> Available for security, AI operations, and privacy-focused work.</div>
              <div className="win95-stats">{METRICS.map(([value, label, detail]) => <button key={value} onClick={() => setMetricDetail(detail)} type="button"><b>{value}</b><span>{label}</span><small>View proof</small></button>)}</div>
              <section className="win95-featured"><h2>Featured Work</h2><div>{featuredProjects.slice(0, 4).map((project) => <article key={project.slug}><p>{project.title}</p><span>{project.lines[2]}</span><footer><button onClick={() => openCaseStudy(project.slug)} type="button">Case Study →</button><a href={project.link} target="_blank" rel="noreferrer">GitHub ↗</a></footer></article>)}</div></section>
              <GitHubActivity />
              <div className="win95-group"><h2>Profile</h2><p>I work where cybersecurity, AI operations, and data privacy meet—making complex internal systems safer, more useful, and easier to govern.</p></div>
            </div>}
            {activeSection === 'projects' && !selectedCaseStudy && <div><h1>Projects</h1><div className="win95-project-filters" role="group" aria-label="Filter projects by discipline">{PROJECT_FILTERS.map((filter) => <button aria-pressed={projectFilter === filter.key} key={filter.key} onClick={() => selectProjectFilter(filter.key)} type="button">{filter.label}</button>)}</div><p className="win95-project-count" aria-live="polite">Showing {filteredProjects.length} of {PROJECT_DETAILS.length} projects</p>{projectFilter === 'all' ? <><h2 className="win95-section-title">Featured Systems</h2><div className="win95-projects win95-projects--featured">{featuredProjects.map(renderProjectCard)}</div><h2 className="win95-section-title">More Engineering Work</h2>{ENGINEERING_GROUPS.map((group) => { const projects = nonFeaturedProjects.filter((project) => group.slugs.includes(project.slug)); return projects.length ? <section className="win95-project-group" key={group.title}><h3>{group.title}</h3><div className="win95-compact-projects">{projects.map((project) => <article key={project.slug}><div><h3>{project.title}</h3><p>{project.stack}</p></div><a href={project.link} target="_blank" rel="noreferrer">GitHub ↗</a></article>)}</div></section> : null; })}<h2 className="win95-section-title">Security Labs & Earlier Work</h2><div className="win95-compact-projects">{labProjects.map((project) => <article key={project.slug}><div><h3>{project.title}</h3><p>{project.stack}</p></div><a href={project.link} target="_blank" rel="noreferrer">GitHub ↗</a></article>)}</div></> : <><h2 className="win95-section-title">{activeProjectFilter.label}</h2><div className="win95-projects">{filteredProjects.map(renderProjectCard)}</div></>}</div>}
            {activeSection === 'projects' && selectedCaseStudy && <article className="win95-case-study"><button onClick={() => setActiveCaseStudy(null)} type="button">← Back to projects</button><h1>{selectedCaseStudy.title}</h1><p className="win95-projects__stack">{selectedCaseStudy.stack}</p><section><h2>Problem</h2><p>{selectedCaseNotes?.problem ?? selectedCaseStudy.lines[0]}</p></section><section><h2>Constraints</h2><p>{selectedCaseNotes?.constraints ?? 'Delivery, security, maintainability, and practical operational use.'}</p></section><section><h2>Architecture</h2><pre>{selectedCaseNotes?.architecture ?? selectedCaseStudy.lines[1]}</pre></section><section><h2>What I built</h2><p>{selectedCaseStudy.lines[1]}</p></section><section><h2>Security & privacy decisions</h2><p>{selectedCaseNotes?.decisions ?? 'The implementation prioritizes controlled, maintainable, and authorized use.'}</p></section><section><h2>Result</h2><p>{selectedCaseStudy.lines[2]}</p></section><a className="win95-button" href={selectedCaseStudy.link} target="_blank" rel="noreferrer">Open GitHub repository ↗</a></article>}
            {activeSection === 'experience' && <div><h1>Experience</h1><div className="win95-list">{EXPERIENCE.map(([period, role, organization, detail]) => <article key={role}><p>{period}</p><div><h2>{role}</h2><h3>{organization}</h3><p>{detail}</p></div></article>)}</div></div>}
            {activeSection === 'skills' && <div><h1>Tools & foundations</h1><div className="win95-skill-grid"><article><h2>Security operations</h2><p>Wazuh SIEM · Suricata · Nmap · OpenVAS · pfSense · MITRE ATT&CK</p><small>Used in: Home-Lab Firewall · Automated Security Logging</small></article><article><h2>RAG & retrieval</h2><p>Qdrant · embeddings · hybrid retrieval · source citations · Ollama</p><small>Used in: Corp-Mind-AI · RAG Support Chatbot</small></article><article><h2>Agent systems</h2><p>A2A · MCP · LangGraph · multi-agent orchestration · privacy gateways</p><small>Used in: A2A Lobby · Vector-Mind-AI · Privacy Gateway</small></article><article><h2>Cloud & delivery</h2><p>Azure · AWS · Docker · Kubernetes · GitHub Actions · CI/CD · React · TypeScript</p><small>Used in: AWS Cloud DevSecOps · production platform work</small></article><article><h2>Education & credentials</h2><p>B.S. Computer Science, Magna Cum Laude · Ateneo de Naga University, 2022—2026</p><small>ISC² CC · Google Cybersecurity · CCSP-AWS · CNSP · BTL0 · TOPCIT Level III</small></article></div></div>}
            {activeSection === 'contact' && <div className="win95-contact"><h1>Let’s talk.</h1><div className="win95-group"><h2>Message</h2><p>For security engineering, AI systems, cloud operations, and privacy-focused collaboration.</p><a className="win95-primary-link" href="mailto:pauloperez9754@gmail.com">✉ pauloperez9754@gmail.com</a></div><div className="win95-contact__links"><a href="https://linkedin.com/in/wppereziii" target="_blank" rel="noreferrer">▣ LinkedIn</a><a href="https://github.com/C0deRhin0" target="_blank" rel="noreferrer">▣ GitHub</a><a href="/resume.pdf" target="_blank" rel="noreferrer">▤ Download resume (PDF)</a></div></div>}
          </section>
        </div>
        {showStatusBar && <footer className="win95-statusbar"><span aria-live="polite">{statusText}</span><span>{activeSection.toUpperCase()}</span></footer>}
        {!isMaximized && <><span aria-hidden="true" className="win95-resize-handle win95-resize-handle--nw" onPointerDown={(event) => startWindowResize(event, 'nw')} onPointerMove={moveWindow} onPointerUp={finishWindowDrag} /><span aria-hidden="true" className="win95-resize-handle win95-resize-handle--ne" onPointerDown={(event) => startWindowResize(event, 'ne')} onPointerMove={moveWindow} onPointerUp={finishWindowDrag} /><span aria-hidden="true" className="win95-resize-handle win95-resize-handle--sw" onPointerDown={(event) => startWindowResize(event, 'sw')} onPointerMove={moveWindow} onPointerUp={finishWindowDrag} /><span aria-hidden="true" className="win95-resize-handle win95-resize-handle--se" onPointerDown={(event) => startWindowResize(event, 'se')} onPointerMove={moveWindow} onPointerUp={finishWindowDrag} /></>}
      </main>}
      {showWelcome && <div className="win95-dialog-backdrop"><div aria-labelledby="welcome-title" aria-modal="true" className="win95-dialog" ref={dialogRef} role="dialog"><header id="welcome-title">Welcome to Portfolio.exe</header><div><span aria-hidden="true" className="win95-dialog__icon">i</span><p>Welcome to the desktop portfolio of Wilfredo Paulo Perez III.<br /><br />Use the folders, menus, and taskbar to explore.</p></div><footer><button autoFocus onClick={() => setShowWelcome(false)} type="button">OK</button></footer></div></div>}
      {showExitDialog && <div className="win95-dialog-backdrop"><div aria-describedby="exit-description" aria-labelledby="exit-title" aria-modal="true" className="win95-dialog" ref={dialogRef} role="dialog"><header id="exit-title">Portfolio.exe</header><div><span aria-hidden="true" className="win95-dialog__icon">?</span><p id="exit-description">Exit Portfolio.exe and return to the terminal?</p></div><footer><button onClick={onReturnToTerminal} type="button">Yes</button><button autoFocus onClick={() => setShowExitDialog(false)} type="button">No</button></footer></div></div>}
      {metricDetail && <div className="win95-dialog-backdrop"><div aria-describedby="metric-description" aria-labelledby="metric-title" aria-modal="true" className="win95-dialog" ref={dialogRef} role="dialog"><header id="metric-title">Metric evidence</header><div><span aria-hidden="true" className="win95-dialog__icon">i</span><p id="metric-description">{metricDetail}</p></div><footer><button autoFocus onClick={() => setMetricDetail(null)} type="button">OK</button></footer></div></div>}
      <div className="win95-taskbar" inert={hasModal}><button aria-expanded={isStartOpen} aria-haspopup="menu" className="win95-start" onClick={() => setIsStartOpen((open) => !open)} type="button">▣ Start</button>{isStartOpen && <div className="win95-start-menu" role="menu"><b>Wilfredo Paulo Perez III</b><button onClick={() => { setIsStartOpen(false); togglePortfolioWindow(); }} role="menuitem" type="button">▣ Portfolio</button><button onClick={onReturnToTerminal} role="menuitem" type="button">▸ Terminal mode</button></div>}<button className={`win95-taskbar__app${isMinimized ? ' is-minimized' : ''}`} onClick={togglePortfolioWindow} type="button">▣ Portfolio</button><time dateTime="2026">2026</time></div>
    </div>
  );
};

export default PortfolioDossier;
