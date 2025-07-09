import type { AppProps } from 'next/app';
import '../styles/globals.css';

/**
 * Custom App component for Next.js
 * Handles global styles and layout configuration
 */
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp; 