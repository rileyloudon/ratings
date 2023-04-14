import { DetailedMovie, ApiError } from '../../../utils/types';
import NoPoster from '@/components/NoPoster/NoPoster';
import CastCard from '@/components/CastCard/CastCard';
import Image from 'next/image';
import styles from './Movie.module.css';

const Movie = ({ movieData }: { movieData: DetailedMovie | ApiError }) => {
  if ('status_message' in movieData)
    return <p className={styles.error}>{movieData.status_message}</p>;

  const renderWatchProviders = (): string => {
    if (movieData && 'watch/providers' in movieData) {
      const countryCode = Intl.DateTimeFormat()
        .resolvedOptions()
        .locale.slice(-2);

      const watchProviders = movieData['watch/providers'].results[countryCode];
      if (watchProviders?.flatrate)
        return `Stream on ${watchProviders.flatrate[0].provider_name}`;
    }

    return 'Unavailable to Stream';
  };

  const renderMovie = (): JSX.Element => {
    const yearReleased = movieData.release_date.slice(0, 4);
    const hours =
      'runtime' in movieData ? Math.trunc(movieData.runtime / 60) : 0;
    const minutes = 'runtime' in movieData ? movieData.runtime % 60 : 0;
    const time =
      hours || minutes
        ? `${hours ? `${hours}h` : ''} ${minutes ? `${minutes}m` : ''}`
        : 'Unknown';
    return (
      <div className={styles.header}>
        {movieData.backdrop_path === null && movieData.poster_path !== null && (
          <Image
            className={styles.poster}
            src={`https://image.tmdb.org/t/p/w500/${movieData.poster_path}`}
            alt=''
            width={500}
            height={450}
          />
        )}
        {movieData.backdrop_path === null && movieData.poster_path === null && (
          <NoPoster />
        )}
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
                height={500}
              />
              <h2 className={styles.title}>
                {movieData.title}
                <span className={styles.released}> ({yearReleased})</span>
              </h2>
            </div>
          ) : (
            <h2 className={styles.title}>
              {movieData.title}
              <span className={styles.released}> ({yearReleased})</span>
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
            <span>{renderWatchProviders()}</span>
          </div>
          {'credits' in movieData && movieData.credits.cast.length && (
            <CastCard cast={movieData.credits.cast} />
          )}
          <p className={styles.overview}>{movieData.overview}</p>
        </div>
      </div>
    );
  };

  return renderMovie();
};

export default Movie;
