export interface ProjectDetail {
  title: string;
  slug: string;
  aliases: string[];
  link: string;
  stack: string;
  lines: string[];
}

export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    title: 'Web-Portfolio — Interactive Terminal Portfolio',
    slug: 'web-portfolio',
    aliases: ['web-portfolio', 'portfolio'],
    link: 'https://github.com/C0deRhin0/Web-Portfolio',
    stack: 'Next.js, TypeScript, React, xterm.js',
    lines: [
      'Interactive hacker-terminal portfolio with command parsing, autocomplete, CTF-style secrets, boot sequence, CRT effects, and keyboard audio.',
      'Uses JSON-backed portfolio content and a custom terminal command handler for a CLI-native browsing experience.',
      'Deployed as a static-friendly Next.js app for Vercel.'
    ]
  },
  {
    title: 'AI-Centric Email Security Responder',
    slug: 'ai-centric-email-security',
    aliases: ['ai-centric-email-security', 'email-security'],
    link: 'https://github.com/C0deRhin0/ai-centric-email-security',
    stack: 'Power Automate, n8n, LLM API',
    lines: [
      'Automates email security response drafting with Power Automate and n8n orchestration.',
      'Generates context-aware security replies using an LLM API.',
      'Reduced average response drafting time by ~76% across 3 monitored mailboxes.'
    ]
  },
  {
    title: 'LED-Entropy — Hardware True Random Number Generator',
    slug: 'led-entropy',
    aliases: ['led-entropy', 'entropy'],
    link: 'https://github.com/C0deRhin0/LED-entropy',
    stack: 'Raspberry Pi, Python, Cryptography, Electronics',
    lines: [
      'Hardware entropy source using analog noise, photoresistor sensing, and chaotic LED patterns.',
      'Acts as a miniaturized analogue of Cloudflare\'s LavaLamp entropy approach.',
      'Generates 2,400+ cryptographically-useful random bits per second with ~38% lower entropy bias than software PRNGs.'
    ]
  },
  {
    title: 'NuecAI Receipt Hybrid OCR',
    slug: 'receipt-hybrid-ocr',
    aliases: ['receipt-hybrid-ocr', 'receipt-ocr'],
    link: 'https://github.com/C0deRhin0/receipt-hybrid-ocr',
    stack: 'React, Vite, Node.js, Claude Vision, Tesseract.js, Ollama, Tailwind CSS',
    lines: [
      'Dual-mode receipt digitization system with cloud OCR routing and local privacy fallback.',
      'Extracts vendor, date, line items, and totals into structured JSON.',
      'Supports CSV and Google Sheets export for finance and operations workflows.'
    ]
  },
  {
    title: 'n8n RAG Chatbot',
    slug: 'n8n-rag-chatbot',
    aliases: ['n8n-rag-chatbot', 'rag-chatbot'],
    link: 'https://github.com/C0deRhin0/n8n-rag-chatbot',
    stack: 'n8n, Qdrant, OpenAI Embeddings, Node.js, Python',
    lines: [
      'RAG-powered customer support chatbot using workflow automation and vector search.',
      'Uses a FAQ ingestion pipeline and webhook-backed sessions for multi-turn support flows.',
      'Replaces manual FAQ lookup with semantic retrieval against a structured knowledge base.'
    ]
  },
  {
    title: 'On-Call Notification Public',
    slug: 'oncall-notification-public',
    aliases: ['oncall-notification-public', 'oncall-public'],
    link: 'https://github.com/C0deRhin0/oncall-notification-public',
    stack: 'Python, Notification Automation',
    lines: [
      'Public-safe on-call notification workflow for alert routing and response coordination.',
      'Demonstrates notification logic without exposing private operational data.',
      'Useful as a lightweight incident-response automation reference.'
    ]
  },
  {
    title: 'Forensic Security Analysis Suite',
    slug: 'forensic-security-analysis-suite',
    aliases: ['forensic-security-analysis-suite', 'forensic-suite'],
    link: 'https://github.com/C0deRhin0/forensic-security-analysis-suite',
    stack: 'Python, Security Analysis, Forensics',
    lines: [
      'Security analysis toolkit focused on repeatable forensic workflows.',
      'Organizes evidence collection and analysis outputs for incident review.',
      'Built for defensive investigation and training contexts.'
    ]
  },
  {
    title: 'keylogger-py — Controlled Lab Keylogging Demo',
    slug: 'keylogger-py',
    aliases: ['keylogger-py', 'keylogger'],
    link: 'https://github.com/C0deRhin0/keylogger-py',
    stack: 'Python, Endpoint Security Education',
    lines: [
      'Controlled lab project for understanding keyboard event capture risk.',
      'Intended for defensive education, endpoint awareness, and detection discussion.',
      'Should only be used in authorized training environments.'
    ]
  },
  {
    title: 'Offensive Python Scripts',
    slug: 'offensive-python-scripts',
    aliases: ['offensive-python-scripts', 'offensive-python'],
    link: 'https://github.com/C0deRhin0/offensive-python-scripts',
    stack: 'Python, MITRE ATT&CK, Red/Blue Team Training',
    lines: [
      'MITRE ATT&CK-mapped attack simulations spanning reconnaissance, execution, persistence, credential access, and exfiltration.',
      'Pairs simulations with detection logic and mitigation guidance.',
      'Designed for controlled red-blue training and security education.'
    ]
  },
  {
    title: 'LangGraph Research Pilot',
    slug: 'langgraph-research-pilot',
    aliases: ['langgraph-research-pilot', 'langgraph'],
    link: 'https://github.com/C0deRhin0/langgraph-research-pilot',
    stack: 'LangGraph, Python, LLM Workflows',
    lines: [
      'Prototype research workflow using graph-based LLM orchestration.',
      'Explores structured agent routing for planning, retrieval, synthesis, and review.',
      'Serves as a pilot for larger multi-agent research systems.'
    ]
  },
  {
    title: 'NuecAI Whisper Local — Offline Meeting Transcriber',
    slug: 'whisper-local',
    aliases: ['whisper-local', 'whisper'],
    link: 'https://github.com/C0deRhin0/whisper-local',
    stack: 'whisper.cpp, Ollama, pyannote.audio, React, Python',
    lines: [
      '100% offline meeting transcription and record-extraction system with Metal GPU acceleration.',
      'Handles 60+ minute recordings using silence-based chunking and neural speaker diarization.',
      'Exports structured speaker-labeled output and reduces post-meeting documentation time by an estimated ~75%.'
    ]
  },
  {
    title: 'AdNU CEVAS LAMP Certificate Validation',
    slug: 'adnu-cevas-lamp',
    aliases: ['adnu-cevas-lamp', 'cevas', 'adnu-cevas'],
    link: 'https://github.com/C0deRhin0/adnu-cevas-lamp',
    stack: 'LAMP, Docker, Kubernetes, PHP, MySQL',
    lines: [
      'Certificate validation platform using SHA-256 cryptographic hashing.',
      'Supports authenticity checks for academic certificate workflows.',
      'Containerized for portable Docker or Kubernetes deployment.'
    ]
  },
  {
    title: 'Corp-Mind-AI — On-Premise HR Knowledge Assistant',
    slug: 'corp-mind-ai',
    aliases: ['corp-mind-ai', 'corp'],
    link: 'https://github.com/C0deRhin0/corp-mind-ai',
    stack: 'FastAPI, Qdrant, Ollama, React, Vite, sentence-transformers',
    lines: [
      'Fully on-premise RAG HR assistant with hybrid semantic + BM25 search via Qdrant RRF fusion.',
      'Returns source-cited answers with page-level document traceability while keeping employee data inside the network.',
      'Adds a 2-hour TTL answer cache, admin ingestion panel, and service health diagnostics.'
    ]
  },
  {
    title: 'Vector-Mind-AI — Multi-Agent Research Orchestrator',
    slug: 'vector-mind-ai',
    aliases: ['vector-mind-ai', 'vector'],
    link: 'https://github.com/C0deRhin0/vector-mind-ai',
    stack: 'Ollama, Qdrant, FastAPI, React, OpenAI, Anthropic API',
    lines: [
      '6-agent wave-based research platform: Planner -> Researcher -> Analyst -> Writer -> Critic -> Fact Checker.',
      'Supports local and cloud LLM backends with persistent RAG and cross-session knowledge graph visualization.',
      'Generates research briefs, blogs, executive summaries, presentation scripts, and social content from a single query.'
    ]
  },
  {
    title: 'CheatScale — Enterprise AI Development Orchestration',
    slug: 'opencode-cheatscale',
    aliases: ['opencode-cheatscale', 'cheatscale'],
    link: 'https://github.com/C0deRhin0/opencode-cheatscale',
    stack: 'OpenCode, Python, Obsidian',
    lines: [
      'AI development orchestration system with 24 specialized agents across a 3-tier architecture.',
      'Uses wave-based task routing, graph-linked documentation, and automated roadmap generation.',
      'Enforces 80%+ unit test coverage by separating domain logic from rendering layers.'
    ]
  },
  {
    title: 'Automated System Security Logging',
    slug: 'automated-system-logging',
    aliases: ['automated-system-logging', 'system-logging'],
    link: 'https://github.com/C0deRhin0/automated-system-logging',
    stack: 'Bash, PowerShell, Wazuh, Splunk',
    lines: [
      'Cross-platform forensic logging scripts for Linux and Windows.',
      'Aggregates authentication, process, network, and file-integrity signals into structured reports.',
      'Outputs are designed to be ingestible by Wazuh and Splunk.'
    ]
  },
  {
    title: 'Vulnerable Smart Contract Demo',
    slug: 'vulnerable-smart-contract',
    aliases: ['vulnerable-smart-contract', 'smart-contract'],
    link: 'https://github.com/C0deRhin0/vulnerable-smart-contract',
    stack: 'Solidity, Ethereum, Hardhat',
    lines: [
      'Security education project demonstrating reentrancy risk in a vulnerable bank contract.',
      'Includes an attacker contract/script for controlled demonstration.',
      'Useful for explaining smart-contract exploit mechanics and mitigation patterns.'
    ]
  },
  {
    title: 'Simple Port Scanner',
    slug: 'simple-port-scanner',
    aliases: ['simple-port-scanner', 'port-scanner'],
    link: 'https://github.com/C0deRhin0/simple-port-scanner',
    stack: 'Python, Networking',
    lines: [
      'Lightweight TCP port scanning utility for networking fundamentals and lab use.',
      'Demonstrates socket programming, target enumeration, and service discovery basics.',
      'Intended for authorized environments only.'
    ]
  },
  {
    title: 'AWS Cloud DevSecOps Pipeline',
    slug: 'aws-cloud-devsecops',
    aliases: ['aws-cloud-devsecops', 'aws'],
    link: 'https://github.com/C0deRhin0/aws-cloud-devsecops',
    stack: 'AWS, GitHub Actions, IaC',
    lines: [
      'Provisioned CI/CD across S3, EC2, IAM, CodeArtifact, CodeBuild, CodeDeploy, and CodePipeline.',
      'Reduced deployment steps from 14 to 2 and cut build-to-deploy cycle time by ~72%.',
      'Enforced least-privilege IAM across 4 roles with zero standing admin access.'
    ]
  },
  {
    title: 'HybridRF-IoT-IDS',
    slug: 'hybridrf-iot-ids',
    aliases: ['hybridrf-iot-ids', 'hybridrf', 'iot-ids'],
    link: 'https://github.com/C0deRhin0/HybridRF-IoT-IDS',
    stack: 'Python, IoT Security, IDS Research',
    lines: [
      'Research-oriented IDS prototype for hybrid RF and IoT security scenarios.',
      'Explores traffic and signal-aware detection concepts for constrained environments.',
      'Fits the broader software-defined intrusion prevention and SOHO network security research track.'
    ]
  },
  {
    title: 'Juice Shop Penetration',
    slug: 'juiceshop-penetration',
    aliases: ['juiceshop-penetration', 'juice-shop'],
    link: 'https://github.com/C0deRhin0/juiceshop-penetration',
    stack: 'OWASP Juice Shop, Web Security Testing',
    lines: [
      'Web application security practice project based on OWASP Juice Shop.',
      'Documents penetration-testing workflow against intentionally vulnerable targets.',
      'Useful for mapping findings to web security concepts and remediation discussion.'
    ]
  },
  {
    title: 'On-Call Notification Local',
    slug: 'oncall-notification-local',
    aliases: ['oncall-notification-local', 'oncall-local'],
    link: 'https://github.com/C0deRhin0/oncall-notification-local',
    stack: 'Python, Local Automation',
    lines: [
      'Local-first on-call notification workflow for alert testing and incident-response drills.',
      'Keeps notification logic runnable without external service dependencies.',
      'Complements the public-safe version with local execution behavior.'
    ]
  },
  {
    title: 'new-trashtrackr — Forked Mobile Project',
    slug: 'new-trashtrackr',
    aliases: ['new-trashtrackr', 'trashtrackr'],
    link: 'https://github.com/C0deRhin0/new-trashtrackr',
    stack: 'Dart, Flutter',
    lines: [
      'Forked mobile project for waste-tracking workflows.',
      'Useful as a reference for mobile UI and app-structure experimentation.',
      'Marked as a fork in the project index.'
    ]
  }
];

export const PROJECT_COMMANDS = PROJECT_DETAILS.map((project) => `project ${project.slug}`);

export const findProjectDetail = (name: string): ProjectDetail | undefined => {
  const normalizedName = name.trim().toLowerCase();
  return PROJECT_DETAILS.find((project) => (
    project.slug === normalizedName || project.aliases.includes(normalizedName)
  ));
};
