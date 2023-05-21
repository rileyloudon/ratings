'use client';

import { useLayoutEffect, useRef } from 'react';
import NoPoster from '@/components/NoPoster/NoPoster';
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
  const ref = useRef<HTMLDivElement>(null);

  const handleElementResize = () => {
    if (ref.current) {
      // 300px is poster width from api - use that as max width per poster
      const postersToDisplay = Math.ceil(ref.current.clientWidth / 300);

      ref.current.style.setProperty(
        '--posters-displayed',
        postersToDisplay.toString()
      );
    }
  };

  const resizeObserver =
    typeof window !== 'undefined' && new ResizeObserver(handleElementResize);

  useLayoutEffect(() => {
    if (ref.current && resizeObserver) resizeObserver.observe(ref.current);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
    };
  });

  const handleScrollLeft = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ref.current) {
      const scrollIndex = Number(
        getComputedStyle(ref.current).getPropertyValue('--scroll-index')
      );

      ref.current.style.setProperty(
        '--scroll-index',
        (scrollIndex - 1).toString()
      );

      if (scrollIndex - 1 === 0) {
        e.currentTarget.style.visibility = 'hidden';
      }
    }
  };

  const handleScrollRight = () => {
    if (ref.current) {
      const scrollIndex = Number(
        getComputedStyle(ref.current).getPropertyValue('--scroll-index')
      );
      ref.current.style.setProperty(
        '--scroll-index',
        (scrollIndex + 1).toString()
      );

      // Display left scroll button
      // Hide right scroll button as needed
    }
  };

  return (
    <div className={styles.container}>
      <p>Popular This Week</p>
      <div className={styles.popular}>
        <button className={styles['nav-left']} onClick={handleScrollLeft}>
          {'<'}
        </button>
        <div className={styles.posters} ref={ref}>
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
        <button className={styles['nav-right']} onClick={handleScrollRight}>
          {'>'}
        </button>
      </div>
    </div>
  );
};

export default Popular;
