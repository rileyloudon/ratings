import NoPoster from '@/components/NoPoster/NoPoster';
import {
  ApiError,
  SearchResultTv,
  SearchResultMovie,
  SearchResultPerson,
} from '../utils/types';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Popular.module.css';

interface Results {
  page: 1;
  results: (SearchResultTv | SearchResultMovie | SearchResultPerson)[];
  total_results: number;
  total_pages: number;
}

type PopularResponse = Results | ApiError;

const Popular = async () => {
  const API_KEY: string = process.env.API_KEY!;

  let popularData;

  try {
    const popular = await fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`
    );
    popularData = (await popular.json()) as PopularResponse;
  } catch (err) {
    popularData = err as Error;
  }

  if (popularData instanceof Error)
    return <p className={styles.error}>{popularData.message}</p>;

  if (popularData && 'status_message' in popularData)
    return <p className={styles.error}>{popularData.status_message}</p>;

  if ('results' in popularData) {
    return (
      <div className={styles.popular}>
        <p>Popular This Week</p>
        <div className={styles.posters}>
          {popularData.results.map((item) => {
            const imgPath =
              item.media_type === 'person'
                ? item.profile_path
                : item.poster_path;
            const name = item.media_type === 'movie' ? item.title : item.name;

            let link = 'movie';
            if (item.media_type === 'tv') link = 'tvshow';
            else if (item.media_type === 'person') link = 'actor';

            return (
              <Link
                href={`/${link}/${item.id}`}
                key={item.id}
                className={styles.item}
              >
                {imgPath !== null ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${imgPath}`}
                    alt={`${name} Poster`}
                    width={250}
                    height={375}
                  />
                ) : (
                  <NoPoster />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default Popular;
