import { DetailedTv } from '@/utils/types';
import NoPoster from '@/components/NoPoster/NoPoster';
import CastCard from '@/components/CastCard/CastCard';
import Image from 'next/image';
import styles from './TvShow.module.css';

const TvShow = ({ tvData }: { tvData: DetailedTv }) => {
  const renderWatchProviders = (): string => {
    const countryCode = Intl.DateTimeFormat()
      .resolvedOptions()
      .locale.slice(-2);

    if (tvData && 'watch/providers' in tvData) {
      const watchProviders = tvData['watch/providers'].results[countryCode];
      if (watchProviders?.flatrate)
        return `Stream on ${watchProviders.flatrate[0].provider_name}`;
    }

    return 'Unavailable to Stream';
  };

  const renderSeasonCount = (seasons: number | false) => {
    if (seasons === 0) return 'Unreleased';
    else return `${seasons} ${seasons === 1 ? 'Season' : 'Seasons'}`;
  };

  const renderTvShow = (): JSX.Element => {
    const yearStart = tvData.first_air_date.slice(0, 4);
    const seasons = 'number_of_seasons' in tvData && tvData.number_of_seasons;
    return (
      <div className={styles.header}>
        {tvData.backdrop_path === null && tvData.poster_path !== null && (
          <Image
            className={styles.poster}
            src={`https://image.tmdb.org/t/p/w500/${tvData.poster_path}`}
            alt=''
            width={300}
            height={450}
          />
        )}
        {tvData.backdrop_path === null && tvData.poster_path === null && (
          <NoPoster />
        )}
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
                <span className={styles.released}> ({yearStart})</span>
              </h2>
            </div>
          ) : (
            <h2 className={styles.title}>
              {tvData.name}
              <span className={styles.released}> ({yearStart})</span>
            </h2>
          )}
          <div className={styles.info}>
            <span className={styles.genres}>
              {'genres' in tvData && tvData.genres.length
                ? tvData.genres.map((item, i) => `${i ? ', ' : ''}${item.name}`)
                : 'Unknown'}{' '}
            </span>
            <span>{renderSeasonCount(seasons)} </span>
            <span>{renderWatchProviders()}</span>
          </div>
          {'credits' in tvData && tvData.credits.cast.length && (
            <CastCard cast={tvData.credits.cast} />
          )}
          <p className={styles.overview}>{tvData.overview}</p>
        </div>
      </div>
    );
  };

  return renderTvShow();
};

export default TvShow;
