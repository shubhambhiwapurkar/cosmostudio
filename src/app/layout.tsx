
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Astra AI',
  description: 'Discover what the stars say about you.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0c0a1e] text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}

    