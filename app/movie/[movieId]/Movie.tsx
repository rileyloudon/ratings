import { DetailedMovie } from '@/utils/types';
import NoPoster from '@/components/NoPoster/NoPoster';
import CastCard from '@/components/CastCard/CastCard';
import WatchProvider from '@/components/WatchProvider/WatchProvider';
import Image from 'next/image';
import styles from './Movie.module.css';

const Movie = ({ movieData }: { movieData: DetailedMovie }) => {
  const yearReleased = movieData.release_date.slice(0, 4);
  const hours = 'runtime' in movieData ? Math.trunc(movieData.runtime / 60) : 0;
  const minutes = 'runtime' in movieData ? movieData.runtime % 60 : 0;
  const time =
    hours || minutes
      ? `${hours ? `${hours}h` : ''} ${minutes ? `${minutes}m` : ''}`
      : 'Unknown';

  return (
    <div className={styles.header}>
      {!movieData.backdrop_path && movieData.poster_path && (
        <Image
          className={styles.poster}
          src={`https://image.tmdb.org/t/p/w500/${movieData.poster_path}`}
          alt=''
          width={300}
          height={450}
        />
      )}
      {!movieData.backdrop_path && !movieData.poster_path && <NoPoster />}
      <div
        className={
          movieData.backdrop_path
            ? styles['backdrop-container']
            : styles['poster-container']
        }
      >
        {movieData.backdrop_path ? (
          <div className={styles.top}>
            <Image
              className={styles.backdrop}
              src={`https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}`}
              alt=''
              width={1280}
              height={720}
            />
            <h2 className={styles.title}>
              {movieData.title}
              {yearReleased && (
                <span className={styles.released}> ({yearReleased})</span>
              )}
            </h2>
          </div>
        ) : (
          <h2 className={styles.title}>
            {movieData.title}
            {yearReleased && (
              <span className={styles.released}> ({yearReleased})</span>
            )}
          </h2>
        )}
        <div className={styles.info}>
          <span className={styles.genres}>
            {'genres' in movieData && movieData.genres.length
              ? movieData.genres?.map(
                  (item, i) => `${i ? ', ' : ''}${item.name}`
                )
              : 'Unknown'}{' '}
          </span>
          <span>{time} </span>
          <WatchProvider watchData={movieData['watch/providers']} />
        </div>
        {'credits' in movieData && movieData.credits.cast.length && (
          <CastCard cast={movieData.credits.cast} />
        )}
        <p className={styles.overview}>{movieData.overview}</p>
      </div>
    </div>
  );
};

export default Movie;
