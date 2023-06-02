'use client';

import { useRef } from 'react';
import NoPoster from '@/components/NoPoster/NoPoster';
import HorizontalScoll from '@/components/HorizontalScroll/HorizontalScoll';
import {
  SearchResultMovie,
  SearchResultPerson,
  SearchResultTv,
} from '@/utils/types';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Popular.module.css';

const Popular = ({
  popularData,
}: {
  popularData: (SearchResultTv | SearchResultMovie | SearchResultPerson)[];
}) => {
  const posterRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.container}>
      <p>Popular This Week</p>
      <HorizontalScoll containerRef={posterRef} maxWidthPerItem={300}>
        <div className={styles.posters} ref={posterRef}>
          {popularData.map((item) => {
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
                prefetch={false}
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
      </HorizontalScoll>
    </div>
  );
};

export default Popular;
