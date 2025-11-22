import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Do...Until Loop Explorer',
  description: 'Interactive guide explaining the Do...Until loop structure in Arabic and English.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
