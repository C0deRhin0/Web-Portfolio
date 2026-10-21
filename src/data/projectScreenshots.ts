export type ProjectCapture = {
  slug: string;
  title: string;
  repo: string;
  kind: 'Interface' | 'Sample data' | 'Generated report' | 'CLI evidence';
  note: string;
  screens: Array<{ src: string; alt: string }>;
};

export const PROJECT_CAPTURES: ProjectCapture[] = [
  {
    "slug": "recall-reviewer",
    "title": "Recall",
    "repo": "https://github.com/C0deRhin0/recall-reviewer",
    "kind": "Sample data",
    "note": "Bundled 30-question bank in a fresh local checkout.",
    "screens": [
      {
        "src": "/projects/recall-reviewer/workspace.webp",
        "alt": "Running app · original sample question bank"
      },
      {
        "src": "/projects/recall-reviewer/practice.webp",
        "alt": "Running app · original sample question in a practice session"
      },
      {
        "src": "/projects/recall-reviewer/reasoning.webp",
        "alt": "Running app · graded sample answer and reasoning"
      }
    ]
  },
  {
    "slug": "rhinoguard",
    "title": "RhinoGuard",
    "repo": "https://github.com/C0deRhin0/rhinoguard",
    "kind": "Generated report",
    "note": "Scripted synthetic scenario; defended policy blocks unsafe tools.",
    "screens": [
      {
        "src": "/projects/rhinoguard/desktop.webp",
        "alt": "Generated report · deterministic local demonstration"
      },
      {
        "src": "/projects/rhinoguard/mobile.webp",
        "alt": "Responsive interface at 390 pixels"
      }
    ]
  },
  {
    "slug": "ai-regression-gate",
    "title": "AI Regression Gate",
    "repo": "https://github.com/C0deRhin0/ai-regression-gate",
    "kind": "CLI evidence",
    "note": "Actual regression/fix demo output, presented as an evidence page.",
    "screens": [
      {
        "src": "/projects/ai-regression-gate/desktop.webp",
        "alt": "AI Regression Gate: Actual regression/fix demo output, presented as an evidence page."
      }
    ]
  },
  {
    "slug": "a2a-lobby",
    "title": "A2A Lobby",
    "repo": "https://github.com/C0deRhin0/a2a-lobby",
    "kind": "Interface",
    "note": "Onboarding and approval entry screens with a disposable database.",
    "screens": [
      {
        "src": "/projects/a2a-lobby/activation.webp",
        "alt": "Running service · owner approval activation entry screen; disposable local database"
      },
      {
        "src": "/projects/a2a-lobby/onboarding.webp",
        "alt": "Running service · agent onboarding and protocol discovery"
      }
    ]
  },
  {
    "slug": "oncall-notification-public",
    "title": "On-call Notifications",
    "repo": "https://github.com/C0deRhin0/oncall-notification-public",
    "kind": "Sample data",
    "note": "Fictional incidents and schedules. No calls or messages sent.",
    "screens": [
      {
        "src": "/projects/oncall-notification-public/dashboard.webp",
        "alt": "Running app · fictional incidents in a disposable local database"
      },
      {
        "src": "/projects/oncall-notification-public/schedules.webp",
        "alt": "Running app · fictional engineer schedules"
      },
      {
        "src": "/projects/oncall-notification-public/logs.webp",
        "alt": "Running app · synthetic notification audit trail"
      }
    ]
  },
  {
    "slug": "corp-mind-ai",
    "title": "Corp Mind AI",
    "repo": "https://github.com/C0deRhin0/corp-mind-ai",
    "kind": "Interface",
    "note": "Document workspace preview. Retrieval and generation not exercised.",
    "screens": [
      {
        "src": "/projects/corp-mind-ai/workspace.webp",
        "alt": "Running frontend · empty document workspace; retrieval not exercised"
      },
      {
        "src": "/projects/corp-mind-ai/admin.webp",
        "alt": "Running frontend · document administration entry screen"
      }
    ]
  },
  {
    "slug": "law-rag",
    "title": "Legal RAG",
    "repo": "https://github.com/C0deRhin0/law-rag",
    "kind": "Interface",
    "note": "Local matter workspace preview. No legal documents uploaded.",
    "screens": [
      {
        "src": "/projects/law-rag/workspace.webp",
        "alt": "Running frontend · empty document workspace; retrieval not exercised"
      },
      {
        "src": "/projects/law-rag/admin.webp",
        "alt": "Running frontend · document administration entry screen"
      }
    ]
  },
  {
    "slug": "receipt-hybrid-ocr",
    "title": "Receipt Hybrid OCR",
    "repo": "https://github.com/C0deRhin0/receipt-hybrid-ocr",
    "kind": "Interface",
    "note": "Capture and review interface before receipt extraction.",
    "screens": [
      {
        "src": "/projects/receipt-hybrid-ocr/desktop.webp",
        "alt": "Running application · initial interface"
      },
      {
        "src": "/projects/receipt-hybrid-ocr/mobile.webp",
        "alt": "Responsive interface at 390 pixels"
      }
    ]
  },
  {
    "slug": "vector-mind-ai",
    "title": "Vector Mind AI",
    "repo": "https://github.com/C0deRhin0/vector-mind-ai",
    "kind": "Interface",
    "note": "Research and provider controls before model inference.",
    "screens": [
      {
        "src": "/projects/vector-mind-ai/research.webp",
        "alt": "Running frontend · research interface; model inference not exercised"
      },
      {
        "src": "/projects/vector-mind-ai/settings.webp",
        "alt": "Running frontend · provider settings interface"
      },
      {
        "src": "/projects/vector-mind-ai/knowledge.webp",
        "alt": "Running frontend · knowledge interface before ingestion"
      }
    ]
  },
  {
    "slug": "whisper-local",
    "title": "Whisper Local",
    "repo": "https://github.com/C0deRhin0/whisper-local",
    "kind": "Interface",
    "note": "Audio upload interface; no meeting recording processed.",
    "screens": [
      {
        "src": "/projects/whisper-local/desktop.webp",
        "alt": "Running application · initial interface"
      },
      {
        "src": "/projects/whisper-local/mobile.webp",
        "alt": "Responsive interface at 390 pixels"
      }
    ]
  },
  {
    "slug": "n8n-rag-chatbot",
    "title": "n8n RAG Chatbot",
    "repo": "https://github.com/C0deRhin0/n8n-rag-chatbot",
    "kind": "Interface",
    "note": "Running FAQ widget. No upstream chat request sent.",
    "screens": [
      {
        "src": "/projects/n8n-rag-chatbot/chat-widget.webp",
        "alt": "Running app · FAQ chat widget; no upstream request sent"
      },
      {
        "src": "/projects/n8n-rag-chatbot/chat-mobile.webp",
        "alt": "Running app · responsive FAQ widget"
      }
    ]
  },
  {
    "slug": "langgraph-research-pilot",
    "title": "Research Pilot",
    "repo": "https://github.com/C0deRhin0/langgraph-research-pilot",
    "kind": "Interface",
    "note": "Running Streamlit interface. Provider-backed research not invoked.",
    "screens": [
      {
        "src": "/projects/langgraph-research-pilot/desktop.webp",
        "alt": "Running Streamlit interface · provider-backed research not invoked"
      },
      {
        "src": "/projects/langgraph-research-pilot/mobile.webp",
        "alt": "Running Streamlit interface · responsive initial screen"
      }
    ]
  },
  {
    "slug": "privacy-gateway",
    "title": "Privacy Gateway",
    "repo": "https://github.com/C0deRhin0/privacy-gateway",
    "kind": "Interface",
    "note": "Running API documentation. No upstream provider request sent.",
    "screens": [
      {
        "src": "/projects/privacy-gateway/api.webp",
        "alt": "Running API · generated endpoint documentation; no provider request sent"
      }
    ]
  },
  {
    "slug": "security-concept-web-scraper",
    "title": "Security Digest",
    "repo": "https://github.com/C0deRhin0/security-concept-web-scraper",
    "kind": "Generated report",
    "note": "Offline fixture digest; not current threat intelligence.",
    "screens": [
      {
        "src": "/projects/security-concept-web-scraper/desktop.webp",
        "alt": "Generated report · deterministic local demonstration"
      },
      {
        "src": "/projects/security-concept-web-scraper/mobile.webp",
        "alt": "Responsive interface at 390 pixels"
      }
    ]
  },
  {
    "slug": "simple-port-scanner",
    "title": "Simple Port Scanner",
    "repo": "https://github.com/C0deRhin0/simple-port-scanner",
    "kind": "CLI evidence",
    "note": "Actual scan of a single disposable loopback service.",
    "screens": [
      {
        "src": "/projects/simple-port-scanner/desktop.webp",
        "alt": "Simple Port Scanner: Actual scan of a single disposable loopback service."
      }
    ]
  },
  {
    "slug": "local-cyber-llm",
    "title": "Local Cyber LLM",
    "repo": "https://github.com/C0deRhin0/local-cyber-llm",
    "kind": "CLI evidence",
    "note": "Actual single-turn native GGUF chat. No agent tools invoked.",
    "screens": [
      {
        "src": "/projects/local-cyber-llm/desktop.webp",
        "alt": "Local Cyber LLM: Actual single-turn native GGUF chat. No agent tools invoked."
      }
    ]
  },
  {
    "slug": "adnu-cevas-lamp",
    "title": "AdNU CEVAS",
    "repo": "https://github.com/C0deRhin0/adnu-cevas-lamp",
    "kind": "Interface",
    "note": "Static certificate prototype page; PHP/database flow not exercised.",
    "screens": [
      {
        "src": "/projects/adnu-cevas-lamp/desktop.webp",
        "alt": "Static prototype page · backend integration not exercised"
      },
      {
        "src": "/projects/adnu-cevas-lamp/mobile.webp",
        "alt": "Static prototype page · mobile viewport"
      }
    ]
  },
  {
    "slug": "semantic-chunk-router",
    "title": "Semantic Chunk Router",
    "repo": "https://github.com/C0deRhin0/semantic-chunk-router",
    "kind": "CLI evidence",
    "note": "Offline mock-embedding example. It does not measure semantic quality.",
    "screens": [
      {
        "src": "/projects/semantic-chunk-router/desktop.webp",
        "alt": "Semantic Chunk Router: Offline mock-embedding example. It does not measure semantic quality."
      }
    ]
  }
];
