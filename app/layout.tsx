import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Lato } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import './global.css';

export const metadata: Metadata = {
  metadataBase: new URL(`https://${process.env.VERCEL_URL}`),
  title: { template: '%s - Ratings', default: 'Ratings' },
  description: 'View TMDB Rating Graphs',
  openGraph: {
    title: { template: '%s - Ratings', default: 'Ratings' },
    description: 'View TMDB Rating Graphs',
  },
};

export const viewport: Viewport = {
  themeColor: '#161616',
};

const lato = Lato({ weight: '400', subsets: ['latin'], preload: false });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={lato.className}
        style={{ backgroundColor: 'var(--background)' }}
      >
        <Header />
        <div style={{ minHeight: 'calc(100vh - 151px)' }}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
