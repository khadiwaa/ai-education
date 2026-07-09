import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Wraps the entire Docusaurus app. This is the standard place to mount
// app-wide, non-visual components like analytics.
export default function Root({ children }) {
  return (
    <>
      {children}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
