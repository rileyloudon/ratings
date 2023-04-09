import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';
import { Lato } from 'next/font/google';
import './global.css';

export const metadata = {
  title: 'Ratings',
  description: 'View TMDB Rating Graphs',
  themeColor: '#161616',
  openGraph: {
    title: 'Ratings',
    images: [
      {
        url: '/og-image.png',
      },
    ],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

const lato = Lato({ weight: '400', subsets: ['latin'] });

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
