import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Cloudflare Pages compatible settings
  output: 'standalone',
};

export default withNextIntl(nextConfig);
