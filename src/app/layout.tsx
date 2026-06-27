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
    default: 'Minibox — Respuestas automáticas para tus DMs',
    template: '%s | Minibox',
  },
  description: 'Respondé tus DMs de Instagram y Facebook automáticamente. Conectá en 3 taps, configurá con chat, activá.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://minibox.ar'),
  openGraph: {
    type: 'website',
    siteName: 'Minibox',
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
