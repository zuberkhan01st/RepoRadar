import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import { Providers } from './providers';
import AnimatedCursor from './components/AnimatedCursor';

export const metadata: Metadata = {
  title: "RepoRadar - AI-Powered GitHub Repository Analysis",
  description: "Analyze any GitHub repository with AI and get instant insights",
  icons: {
    icon: '../app/favicon.png', // Uses the existing file in your public folder
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body>
        <Providers>
          {children}
          <AnimatedCursor />
        </Providers>
      </body>
    </html>
  );
}
