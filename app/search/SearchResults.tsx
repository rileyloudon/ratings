'use client';

import {
  SearchResultMovie,
  SearchResultPerson,
  SearchResultTv,
} from '@/utils/types';
import NoPoster from '@/components/NoPoster/NoPoster';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './SearchResults.module.css';

const SearchResults = ({
  results,
  pageNumber,
  totalPages,
}: {
  results: (SearchResultTv | SearchResultMovie | SearchResultPerson)[];
  pageNumber: number;
  totalPages: number;
}) => {
  const router = useRouter();
  const search = useSearchParams();

  const query = search.get('q');
  const decodedQuery = query ? decodeURIComponent(query) : '';
  const page = Number(search.get('page')) || 1;

  return (
    <div className={styles.container}>
      <div className={styles.results}>
        {results.map((item) => {
          const imgPath =
            'profile_path' in item ? item.profile_path : item.poster_path;
          const name = 'name' in item ? item.name : item.title;

          let link = 'movie';
          if (item.media_type === 'tv') link = 'tvshow';
          else if (item.media_type === 'person') link = 'actor';

          return (
            <Link
              prefetch={false}
              href={`/${link}/${item.id}`}
              key={item.id}
              className={styles.item}
            >
              {imgPath !== null ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w300/${imgPath}`}
                  alt={`${name} Poster`}
                  width={300}
                  height={450}
                />
              ) : (
                <NoPoster />
              )}
              <p>{name}</p>
            </Link>
          );
        })}
      </div>
      <div className={styles['page-selector']}>
        <button
          disabled={pageNumber === 1}
          type='button'
          onClick={() =>
            router.push(`/search?q=${decodedQuery}&page=${page - 1}`)
          }
        >
          Previous Page
        </button>
        <button
          disabled={pageNumber === totalPages}
          type='button'
          onClick={() =>
            router.push(`/search?q=${decodedQuery}&page=${page + 1}`)
          }
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
