import React from 'react';
import { TrackingProvider } from './components/tracking/TrackingContext';

export default function Layout({ children }) {
  return (
    <TrackingProvider>
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    </TrackingProvider>
  );
}
