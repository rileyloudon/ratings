import Search from '@/components/Search/Search';
import Popular from './Popular';
import styles from './page.module.css';

const App = () => {
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <p className={styles.instructions}>Search for Movies or TV Shows</p>
        <Search />
        {/* @ts-expect-error Async Server Component */}
        <Popular />
      </div>
    </div>
  );
};

export default App;
