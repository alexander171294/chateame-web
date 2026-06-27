import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ConnectPage } from './ConnectPage';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ConnectPage />;
}
