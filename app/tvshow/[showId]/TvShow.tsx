import { DetailedTv } from '@/utils/types';
import NoPoster from '@/components/NoPoster/NoPoster';
import CastCard from '@/components/CastCard/CastCard';
import WatchProvider from '@/components/WatchProvider/WatchProvider';
import Image from 'next/image';
import styles from './TvShow.module.css';

const TvShow = ({ tvData }: { tvData: DetailedTv }) => {
  const yearStart = tvData.first_air_date.slice(0, 4);
  const seasons = 'number_of_seasons' in tvData && tvData.number_of_seasons;

  const renderSeasonCount = (seasons: number | false) => {
    if (seasons === 0) return 'Unreleased';
    else return `${seasons} ${seasons === 1 ? 'Season' : 'Seasons'}`;
  };

  return (
    <div className={styles.header}>
      {!tvData.backdrop_path && tvData.poster_path && (
        <Image
          className={styles.poster}
          src={`https://image.tmdb.org/t/p/w500/${tvData.poster_path}`}
          alt=''
          width={300}
          height={450}
        />
      )}
      {!tvData.backdrop_path && !tvData.poster_path && <NoPoster />}
      <div
        className={
          tvData.backdrop_path
            ? styles['backdrop-container']
            : styles['poster-container']
        }
      >
        {tvData.backdrop_path ? (
          <div className={styles.top}>
            <Image
              className={styles.backdrop}
              src={`https://image.tmdb.org/t/p/w1280${tvData.backdrop_path}`}
              alt=''
              width={1280}
              height={720}
            />
            <h2 className={styles.title}>
              {tvData.name}
              {yearStart && (
                <span className={styles.released}> ({yearStart})</span>
              )}
            </h2>
          </div>
        ) : (
          <h2 className={styles.title}>
            {tvData.name}
            {yearStart && (
              <span className={styles.released}> ({yearStart})</span>
            )}
          </h2>
        )}
        <div className={styles.container}>
          <div className={styles.info}>
            <span className={styles.genres}>
              {'genres' in tvData && tvData.genres.length
                ? tvData.genres.map((item, i) => `${i ? ', ' : ''}${item.name}`)
                : 'Unknown'}{' '}
            </span>
            <span>{renderSeasonCount(seasons)} </span>
            <WatchProvider watchData={tvData['watch/providers']} />
          </div>
          {'credits' in tvData && tvData.credits.cast.length && (
            <CastCard cast={tvData.credits.cast} />
          )}
          <p className={styles.overview}>{tvData.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default TvShow;
