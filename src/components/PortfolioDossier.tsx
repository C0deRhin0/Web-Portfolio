import React, { useState } from 'react';

interface PortfolioDossierProps {
  onReturnToTerminal: () => void;
}

const PROJECTS = [
  ['Agent-to-Agent Coordination Lobby', 'Aug 2026 — Present', 'TypeScript, Fastify, PostgreSQL, Redis, A2A, MCP', 'Governed 1:1 agent coordination with durable messaging, bilateral approval, and isolated private context.', '29-test automated suite'],
  ['PII-Redacting Privacy Gateway', 'Aug 2026 — Present', 'Python, FastAPI, Presidio, HTTPX, DLP', 'A fail-closed LLM gateway that redacts secrets, pseudonymizes context, and scans provider outputs.', '3 privacy modes'],
  ['Privacy-First AI Agent Harness', 'Apr 2026 — Aug 2026', 'VPS, Sandboxed Runtime, LLM Orchestration', 'A dedicated, isolated agent runtime designed to keep local machines, personal data, and credentials out of reach.', '97% task-completion parity'],
  ['NuecAI RAG Customer Support Chatbot', 'Apr 2026 — May 2026', 'n8n, Qdrant, OpenAI Embeddings, Node.js', 'Production customer support RAG with multi-turn sessions and sub-second semantic retrieval.', '≈70% faster resolution'],
  ['NuecAI Receipt Hybrid OCR', 'Apr 2026 — May 2026', 'React, Node.js, Claude Vision, Tesseract.js, Ollama', 'Dual-mode receipt digitization: cloud accuracy when appropriate, local OCR when privacy matters.', '≈92% less manual entry'],
  ['Corp-Mind-AI', 'Mar 2026 — May 2026', 'FastAPI, Qdrant, Ollama, React', 'On-premise HR knowledge assistant with source-cited answers and page-level traceability.', 'Zero employee data leaves the network'],
  ['Vector-Mind-AI', 'Mar 2026 — May 2026', 'Ollama, Qdrant, FastAPI, React', 'Six-agent research orchestrator with interchangeable local and cloud LLM backends.', '6-agent workflow'],
  ['LED-Entropy', 'Mar 2026', 'Raspberry Pi, Python, Electronics', 'Hardware true random-number source using analogue noise, photoresistor sensing, and chaotic LED patterns.', '2,400+ random bits/sec']
];

const EXPERIENCE = [
  ['Jun 2026 — Present', 'Cybersecurity Engineer', 'Nueca Technologies Inc.', 'Vice Chair, AI Transformation Team · Compliance Officer for Privacy. Global administration of Entra ID, Microsoft 365, and Azure for 55 users; Zero-Trust controls, production AI systems, and privacy operations.'],
  ['Nov 2025 — Apr 2026', 'AI Engineer, LLM Training & Data', 'Mindrift', 'Delivered 3,200+ annotated data samples and built a Python, BeautifulSoup, and Selenium pipeline that reduced per-task manual processing by about 85%.'],
  ['Sep 2025 — May 2026', 'Cybersecurity Associate (Part-Time)', 'Nueca Technologies Inc.', 'Delivered network and email security, privacy compliance, security orientations, consulting, AI orchestration, and ERP development for a 55-person organization.'],
  ['May 2025 — Jul 2025', 'Network & Cloud Security Analyst Intern', 'Nueca Technologies Inc.', 'Audited legacy infrastructure, deployed Wazuh SIEM/HIDS, improved macOS CIS compliance, migrated services to Kubernetes, and resolved SPF, DKIM, and DMARC gaps.']
];

const PortfolioDossier: React.FC<PortfolioDossierProps> = ({ onReturnToTerminal }) => {
  const [activeSection, setActiveSection] = useState('about');
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<'file' | 'view' | 'help' | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const selectSection = (section: string) => {
    setActiveSection(section);
    setIsStartOpen(false);
  };

  return (
    <div className={`win95-desktop${isMaximized ? ' win95-desktop--maximized' : ''}`}>
      <div className="win95-icons" aria-hidden="true"><span>▣<small>My Portfolio</small></span><span>▤<small>Projects</small></span><span>✉<small>Contact</small></span></div>
      {!isMinimized && <main className="win95-window" aria-label="Wilfredo Paulo Perez III portfolio">
        <header className="win95-titlebar"><span className="win95-titlebar__mark">▣</span><strong>Wilfredo Paulo Perez III — Portfolio.exe</strong><div><button aria-label="Minimize" onClick={() => setIsMinimized(true)} type="button">_</button><button aria-label="Maximize" onClick={() => setIsMaximized((value) => !value)} type="button">□</button><button aria-label="Close" onClick={() => setShowExitDialog(true)} type="button">×</button></div></header>
        <nav className="win95-menubar" aria-label="Portfolio navigation"><button onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')} type="button">File</button><button type="button">Edit</button><button onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')} type="button">View</button><button onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')} type="button">Help</button>{openMenu && <div className="win95-dropdown">{openMenu === 'file' && <><button onClick={() => setShowExitDialog(true)} type="button">Exit Portfolio</button><button onClick={onReturnToTerminal} type="button">Open Terminal…</button></>}{openMenu === 'view' && <><button onClick={() => selectSection('about')} type="button">Home</button><button onClick={() => selectSection('projects')} type="button">Projects</button></>}{openMenu === 'help' && <p>Portfolio.exe<br />Version 95.2026</p>}</div>}<button onClick={onReturnToTerminal} type="button">Open Terminal…</button></nav>
        <div className="win95-toolbar"><button onClick={() => selectSection('about')} type="button">◀ Back</button><button onClick={() => selectSection('projects')} type="button">▰ Projects</button><button onClick={() => selectSection('contact')} type="button">✉ Contact</button><span>Address: <b>C:\Users\wpperez\portfolio</b></span></div>
        <div className="win95-body">
          <aside className="win95-sidebar" aria-label="Portfolio folders">
            <p>Portfolio</p>
            {['about', 'projects', 'experience', 'skills', 'contact'].map((section) => <button className={activeSection === section ? 'is-active' : ''} key={section} onClick={() => selectSection(section)} type="button">{section === 'about' ? '▣' : '▸'} {section}.txt</button>)}
            <a href="/resume.pdf" target="_blank" rel="noreferrer">▤ resume.pdf</a>
          </aside>
          <section className="win95-content">
            {activeSection === 'about' && <div className="win95-about">
              <div className="win95-about__hero"><div className="win95-monitor" aria-hidden="true"><div>WP</div></div><div><p className="win95-path">C:\PORTFOLIO\README.TXT</p><h1>Wilfredo Paulo<br />Perez III</h1><p>Cybersecurity engineer building privacy-conscious infrastructure and practical AI systems.</p><div className="win95-actions"><button onClick={() => selectSection('projects')} type="button">View selected work</button><button onClick={() => selectSection('contact')} type="button">Contact me</button></div></div></div>
              <div className="win95-notice"><b>System status:</b> Available for security, AI operations, and privacy-focused work.</div>
              <div className="win95-stats"><div><b>55</b><span>users supported across enterprise identity, cloud & security</span></div><div><b>6+</b><span>production AI systems maintained</span></div><div><b>80%</b><span>reduction in privileged-access vulnerabilities</span></div></div>
              <div className="win95-group"><h2>Profile</h2><p>I work where cybersecurity, AI operations, and data privacy meet—making complex internal systems safer, more useful, and easier to govern.</p></div>
            </div>}
            {activeSection === 'projects' && <div><p className="win95-path">C:\PORTFOLIO\PROJECTS\</p><h1>Selected projects</h1><div className="win95-projects">{PROJECTS.map(([title, period, stack, detail, proof]) => <article key={title}><header><span>▣</span><div><h2>{title}</h2><p>{period}</p></div></header><p className="win95-projects__stack">{stack}</p><p>{detail}</p><footer>{proof}</footer></article>)}</div><a className="win95-link" href="https://github.com/C0deRhin0" target="_blank" rel="noreferrer">↗ View all repositories on GitHub</a></div>}
            {activeSection === 'experience' && <div><p className="win95-path">C:\PORTFOLIO\EXPERIENCE.TXT</p><h1>Experience</h1><div className="win95-list">{EXPERIENCE.map(([period, role, organization, detail]) => <article key={role}><p>{period}</p><div><h2>{role}</h2><h3>{organization}</h3><p>{detail}</p></div></article>)}</div></div>}
            {activeSection === 'skills' && <div><p className="win95-path">C:\PORTFOLIO\SKILLS.INI</p><h1>Tools & foundations</h1><div className="win95-skill-grid"><article><h2>Security</h2><p>Wazuh SIEM · Suricata · Nmap · OpenVAS · Nessus · pfSense · MITRE ATT&CK · Data Privacy Compliance</p></article><article><h2>AI & automation</h2><p>RAG · Qdrant · Ollama · n8n · Whisper · FastAPI · Multi-agent orchestration · LLM training data</p></article><article><h2>Cloud & delivery</h2><p>Azure · AWS · Docker · Kubernetes · GitHub Actions · CI/CD · React · TypeScript</p></article><article><h2>Education & credentials</h2><p>B.S. Computer Science, Magna Cum Laude · Ateneo de Naga University, 2022—2026<br /><br />ISC² CC · Google Cybersecurity · CCSP-AWS · CNSP · BTL0 · TOPCIT Level III</p></article></div></div>}
            {activeSection === 'contact' && <div className="win95-contact"><p className="win95-path">C:\PORTFOLIO\CONTACT.ME</p><h1>Let’s talk.</h1><div className="win95-group"><h2>Message</h2><p>For security engineering, AI systems, cloud operations, and privacy-focused collaboration.</p><a className="win95-primary-link" href="mailto:pauloperez9754@gmail.com">✉ pauloperez9754@gmail.com</a></div><div className="win95-contact__links"><a href="https://linkedin.com/in/wppereziii" target="_blank" rel="noreferrer">▣ LinkedIn</a><a href="https://github.com/C0deRhin0" target="_blank" rel="noreferrer">▣ GitHub</a><a href="/resume.pdf" target="_blank" rel="noreferrer">▤ Download resume (PDF)</a></div></div>}
          </section>
        </div>
        <footer className="win95-statusbar"><span>Ready.</span><span>{activeSection.toUpperCase()}</span></footer>
      </main>}
      {showWelcome && <div className="win95-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="welcome-title"><div className="win95-dialog"><header id="welcome-title">Welcome to Portfolio.exe</header><div><span className="win95-dialog__icon">i</span><p>Welcome to the desktop portfolio of Wilfredo Paulo Perez III.<br /><br />Use the folders, menus, and taskbar to explore.</p></div><footer><button autoFocus onClick={() => setShowWelcome(false)} type="button">OK</button></footer></div></div>}
      {showExitDialog && <div className="win95-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="exit-title"><div className="win95-dialog"><header id="exit-title">Portfolio.exe</header><div><span className="win95-dialog__icon">?</span><p>Exit Portfolio.exe and return to the terminal?</p></div><footer><button onClick={onReturnToTerminal} type="button">Yes</button><button autoFocus onClick={() => setShowExitDialog(false)} type="button">No</button></footer></div></div>}
      <div className="win95-taskbar"><button className="win95-start" onClick={() => setIsStartOpen((open) => !open)} type="button">▣ Start</button>{isStartOpen && <div className="win95-start-menu"><b>Wilfredo Paulo Perez III</b><button onClick={() => selectSection('about')} type="button">▣ Portfolio</button><button onClick={() => selectSection('projects')} type="button">▰ Projects</button><button onClick={onReturnToTerminal} type="button">▸ Terminal mode</button></div>}<button className={`win95-taskbar__app${isMinimized ? ' is-minimized' : ''}`} onClick={() => setIsMinimized((value) => !value)} type="button">▣ Portfolio.exe</button><time>2026</time></div>
    </div>
  );
};

export default PortfolioDossier;
