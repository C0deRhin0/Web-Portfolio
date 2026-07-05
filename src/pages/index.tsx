import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Terminal from '../components/Terminal';
import dynamic from 'next/dynamic';
import BootSequence from '../components/BootSequence';
const BinaryRainOverlay = dynamic(() => import('../components/BinaryRainOverlay'), { ssr: false });
// import '../styles/globals.css';

/**
 * Main index page for the hacker-terminal portfolio
 * Single-page application that renders the interactive terminal
 */
const Home: React.FC = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const [theme, setTheme] = useState<'1' | '2' | '3'>('1');

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
    } catch (error) {
      // Ignore storage errors
    }
  }, []);

  return (
    <>
      <Head>
        <title>Wilfredo Paulo Perez III - CODERHINO Terminal Portfolio</title>
        <meta name="description" content="Interactive terminal portfolio of Wilfredo Paulo A. Perez III — cybersecurity engineer, AI systems builder, and cloud security practitioner." />
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
        <meta property="og:title" content="Wilfredo Paulo Perez III - CODERHINO Terminal Portfolio" />
        <meta property="og:description" content="Cybersecurity, applied AI, and cloud security work by Wilfredo Paulo A. Perez III." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://portfolio.wpperez.com" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wilfredo Paulo Perez III - CODERHINO Terminal Portfolio" />
        <meta name="twitter:description" content="Interactive terminal portfolio for cybersecurity, AI systems, and cloud security work." />
      </Head>
      
      {/* FLAG{S0URC3_H4CK3R} */}
      <main>
        {!bootComplete && (
          <BootSequence
            theme={theme}
            onComplete={() => setBootComplete(true)}
          />
        )}
        <BinaryRainOverlay />
        <Terminal />
      </main>
    </>
  );
};

export default Home; 
