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
  const posterRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLButtonElement>(null);
  const rightRef = useRef<HTMLButtonElement>(null);

  let amountScrolled = 0;

  const handleElementResize = () => {
    if (posterRef.current) {
      // 300px is poster width from api - use that as max width per poster
      const postersToDisplay = Math.ceil(posterRef.current.clientWidth / 300);

      posterRef.current.style.setProperty(
        '--posters-displayed',
        postersToDisplay.toString()
      );
    }
  };

  const resizeObserver =
    typeof window !== 'undefined' && new ResizeObserver(handleElementResize);

  useLayoutEffect(() => {
    if (posterRef.current && resizeObserver)
      resizeObserver.observe(posterRef.current);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
    };
  });

  const handleScrollLeft = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (posterRef.current && leftRef.current) {
      const { clientWidth } = posterRef.current;
      let scrollAmount = 1;
      amountScrolled -= clientWidth;

      if (amountScrolled - clientWidth < 0) {
        scrollAmount = amountScrolled / clientWidth;
        amountScrolled = 0;
      }

      const scrollIndex = Number(
        getComputedStyle(posterRef.current).getPropertyValue('--scroll-index')
      );

      posterRef.current.style.setProperty(
        '--scroll-index',
        (scrollIndex - scrollAmount).toString()
      );

      if (
        rightRef.current &&
        getComputedStyle(rightRef.current).getPropertyValue('visibility') ===
          'hidden'
      )
        rightRef.current.style.visibility = 'visible';
      if (amountScrolled === 0) leftRef.current.style.visibility = 'hidden';
    }
  };

  const handleScrollRight = () => {
    if (posterRef.current && rightRef.current) {
      const { clientWidth, scrollWidth } = posterRef.current;
      let scrollAmount = 1;

      amountScrolled += clientWidth;

      if (amountScrolled + clientWidth > scrollWidth) {
        scrollAmount = (scrollWidth - amountScrolled) / clientWidth;
        amountScrolled = scrollWidth;
      }

      const scrollIndex = Number(
        getComputedStyle(posterRef.current).getPropertyValue('--scroll-index')
      );

      posterRef.current.style.setProperty(
        '--scroll-index',
        (scrollIndex + scrollAmount).toString()
      );

      if (
        leftRef.current &&
        getComputedStyle(leftRef.current).getPropertyValue('visibility') ===
          'hidden'
      )
        leftRef.current.style.visibility = 'visible';
      if (amountScrolled === scrollWidth)
        rightRef.current.style.visibility = 'hidden';
    }
  };

  return (
    <div className={styles.container}>
      <p>Popular This Week</p>
      <div className={styles.popular}>
        <button
          ref={leftRef}
          className={styles['nav-left']}
          onClick={handleScrollLeft}
        >
          {'<'}
        </button>
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
        <button
          ref={rightRef}
          className={styles['nav-right']}
          onClick={handleScrollRight}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
};

export default Popular;
