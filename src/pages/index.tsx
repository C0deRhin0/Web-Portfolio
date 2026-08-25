import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Terminal from '../components/Terminal';
import dynamic from 'next/dynamic';
import BootSequence from '../components/BootSequence';
import PortfolioDossier from '../components/PortfolioDossier';
const BinaryRainOverlay = dynamic(() => import('../components/BinaryRainOverlay'), { ssr: false });
// import '../styles/globals.css';

const PORTFOLIO_MODE_KEY = 'portfolioMode';

const PERSON_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Wilfredo Paulo A. Perez III',
  url: 'https://portfolio.wpperez.com',
  jobTitle: 'Cybersecurity Engineer',
  email: 'mailto:pauloperez9754@gmail.com',
  sameAs: ['https://github.com/C0deRhin0', 'https://linkedin.com/in/wppereziii'],
  knowsAbout: ['Cybersecurity', 'AI systems', 'Data privacy', 'Cloud security', 'DevSecOps']
}).replace(/</g, '\\u003c');

/**
 * Main index page for the hacker-terminal portfolio
 * Single-page application that renders the interactive terminal
 */
const Home: React.FC = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const [theme, setTheme] = useState<'1' | '2' | '3'>('1');
  const [portfolioMode, setPortfolioMode] = useState<'terminal' | 'dossier'>('terminal');
  const [dossierSession, setDossierSession] = useState(0);

  const setPreferredMode = (mode: 'terminal' | 'dossier') => {
    setPortfolioMode(mode);
    try {
      window.localStorage.setItem(PORTFOLIO_MODE_KEY, mode);
    } catch (error) {
      // Storage can be unavailable in private or restricted browsing modes.
    }
  };

  const openDossier = () => {
    setDossierSession((session) => session + 1);
    setPreferredMode('dossier');
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // INTENTIONAL: Console flag for CTF challenge - do not remove.
    console.log(
      '%c 🚩 FLAG{C0NS0L3_M4ST3R} ',
      'background: #00ff00; color: #000000; font-size: 18px; font-weight: bold; padding: 8px 12px; border: 2px solid #00ff00;'
    );
    console.log(
      '%cYou found the DevTools flag! 🎉',
      'color: #00ff00; font-size: 12px; font-weight: 600;'
    );

    try {
      const storedTheme = window.localStorage.getItem('terminalTheme');
      if (storedTheme === '1' || storedTheme === '2' || storedTheme === '3') {
        setTheme(storedTheme);
      }

      const storedMode = window.localStorage.getItem(PORTFOLIO_MODE_KEY);
      if (storedMode === 'terminal' || storedMode === 'dossier') {
        setPortfolioMode(storedMode);
        if (storedMode === 'dossier') {
          setDossierSession((session) => session + 1);
        }
      } else if (window.matchMedia('(max-width: 720px)').matches) {
        setPortfolioMode('dossier');
        setDossierSession((session) => session + 1);
      }
    } catch (error) {
      if (window.matchMedia('(max-width: 720px)').matches) {
        setPortfolioMode('dossier');
        setDossierSession((session) => session + 1);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Wilfredo Paulo Perez III | Cybersecurity & AI Systems</title>
        <meta name="description" content="Portfolio of Wilfredo Paulo A. Perez III — cybersecurity engineer and builder of privacy-conscious AI systems." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/portfolio/icon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/portfolio/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicons/portfolio/icon-192x192.png" />
        <meta name="theme-color" content="#1e1e1e" />
        <meta name="author" content="Wilfredo Paulo A. Perez III" />
        <meta name="keywords" content="portfolio, terminal, cybersecurity, applied AI, cloud security, DevSecOps, SIEM, RAG, C0deRhin0" />
        <link rel="canonical" href="https://portfolio.wpperez.com" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Wilfredo Paulo Perez III | Cybersecurity & AI Systems" />
        <meta property="og:description" content="Cybersecurity, applied AI, and cloud security work by Wilfredo Paulo A. Perez III." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://portfolio.wpperez.com" />
        <meta property="og:image" content="https://portfolio.wpperez.com/og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wilfredo Paulo Perez III | Cybersecurity & AI Systems" />
        <meta name="twitter:description" content="Interactive terminal portfolio for cybersecurity, AI systems, and cloud security work." />
        <meta name="twitter:image" content="https://portfolio.wpperez.com/og.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: PERSON_JSON_LD }} />
      </Head>
      
      {/* FLAG{S0URC3_H4CK3R} */}
      <main className={`portfolio-shell portfolio-shell--${portfolioMode}`}>
        <a className="skip-link" href={portfolioMode === 'terminal' ? '#terminal-portfolio' : '#dossier-portfolio'}>Skip to portfolio content</a>
        <section className="portfolio-shell__terminal" id="terminal-portfolio" aria-hidden={portfolioMode === 'dossier'} inert={portfolioMode === 'dossier'}>
          <button className="terminal-mode-switch" onClick={openDossier} type="button">
            Prefer a scrollable portfolio? <span>View dossier →</span>
          </button>
          {!bootComplete && <BootSequence theme={theme} onComplete={() => setBootComplete(true)} />}
          <BinaryRainOverlay />
          <Terminal />
        </section>
        <section className="portfolio-shell__dossier" id="dossier-portfolio" aria-hidden={portfolioMode === 'terminal'} inert={portfolioMode === 'terminal'}>
          <PortfolioDossier key={dossierSession} onReturnToTerminal={() => setPreferredMode('terminal')} />
        </section>
      </main>
    </>
  );
};

export default Home; 
