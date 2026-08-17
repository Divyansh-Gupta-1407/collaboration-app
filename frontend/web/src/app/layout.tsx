import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CollabSpace — Real-Time Collaboration Platform',
  description: 'Premium real-time collaborative editing platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
