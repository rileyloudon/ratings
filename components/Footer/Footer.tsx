import Image from 'next/image';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <p className={styles.disclaimer}>
      This product uses the TMDB API but is not endorsed or certified by TMDB.
    </p>
    <p className={styles.from}>
      Data from
      <a
        className={styles.svg}
        href='https://www.themoviedb.org/'
        target='_blank'
        rel='noreferrer'
      >
        <Image
          fill
          src='/tmdb.svg'
          alt='TMDB Logo'
          sizes='(max-width: 768px) 100vw'
        />
      </a>
      and
      <a
        className={styles.svg}
        href='https://www.justwatch.com/'
        target='_blank'
        rel='noreferrer'
      >
        <Image
          fill
          src='/just-watch.svg'
          alt='JustWatch Logo'
          sizes='(max-width: 768px) 100vw'
        />
      </a>
    </p>
  </footer>
);

export default Footer;
