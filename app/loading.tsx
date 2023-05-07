import Image from 'next/image';
import styles from './loading.module.css';

const loading = () => {
  return (
    <Image
      className={styles.spinner}
      src='/spinner.svg'
      alt='Loading...'
      width={24}
      height={24}
    />
  );
};

export default loading;
