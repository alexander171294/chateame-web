import React from 'react';

// Mock navigation exports used by @/i18n/navigation
export const useRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
});

export const usePathname = () => '/';

export const Link = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
  <a href={href} {...props}>{children}</a>
);

export const redirect = vi.fn();
export const getPathname = vi.fn(() => '/');
