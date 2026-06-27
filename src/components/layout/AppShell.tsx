'use client';

import React from 'react';
import { AppHeader } from './AppHeader';

interface AppShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showNav?: boolean;
}

export function AppShell({ children, showHeader = true, showNav = true }: AppShellProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg-primary)]">
      {showHeader && <AppHeader showNav={showNav} />}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
