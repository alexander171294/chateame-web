import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Chateame — Respuestas automáticas para tus DMs',
    template: '%s | Chateame',
  },
  description: 'Respondé tus DMs de Instagram y Facebook automáticamente. Conectá en 3 taps, configurá con chat, activá.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://chateame.com'),
  openGraph: {
    type: 'website',
    siteName: 'Chateame',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={montserrat.variable}>
        {children}
      </body>
    </html>
  );
}
