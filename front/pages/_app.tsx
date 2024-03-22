// pages/_app.tsx
import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import FadeInWrapper from '@/components/wrappers/FadeIn';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <FadeInWrapper>
      <Component {...pageProps} />
    </FadeInWrapper>
  );
 
};

export default MyApp;
