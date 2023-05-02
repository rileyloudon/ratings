'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Search from '../Search/Search';
import styles from './Header.module.css';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className={styles.container}>
      <h2 className={styles.title}>
        <Link href='/'>Ratings</Link>
      </h2>
      {pathname !== '/' && <Search />}
    </header>
  );
};
export default Header;
