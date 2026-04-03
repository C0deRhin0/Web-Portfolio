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
        <title>CODERHINO - Terminal Portfolio</title>
        <meta name="description" content="Interactive hacker-terminal web portfolio of Paulo 'C0DERHIN0' Perez" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1e1e1e" />
        <meta name="author" content="Paulo 'C0DERHIN0' Perez" />
        <meta name="keywords" content="portfolio, terminal, developer, security, full-stack" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="CODERHINO - Terminal Portfolio" />
        <meta property="og:description" content="Interactive hacker-terminal web portfolio of Paulo 'C0DERHIN0' Perez" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://c0derhin0.github.io/Web-Portfolio" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CODERHINO - Terminal Portfolio" />
        <meta name="twitter:description" content="Interactive hacker-terminal web portfolio" />
      </Head>
      
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
