'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { DetailedPerson } from '@/utils/types';
import NoPoster from '@/components/NoPoster/NoPoster';
import Image from 'next/image';
import styles from './Actor.module.css';

const Actor = ({ actorData }: { actorData: DetailedPerson }) => {
  const [textHeight, setTextHeight] = useState<number>(0);
  const [showMoreBio, setShowMoreBio] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleElementResize = () => {
    if (ref.current && ref.current.scrollHeight !== textHeight)
      setTextHeight(ref.current?.offsetHeight);
  };

  const resizeObserver =
    typeof window !== 'undefined' && new ResizeObserver(handleElementResize);

  useLayoutEffect(() => {
    if (ref.current && resizeObserver) resizeObserver.observe(ref.current);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
    };
  });

  const getAge = (actorBirthday: string, actorDeath: string | null) => {
    const endDate = actorDeath ? new Date(actorDeath).getTime() : Date.now();
    const ageDiff = endDate - new Date(actorBirthday).getTime();
    const date = new Date(ageDiff);
    return <span>{Math.abs(date.getUTCFullYear() - 1970)} Years Old</span>;
  };

  return (
    <div className={styles.header}>
      {actorData.profile_path ? (
        <Image
          className={styles.poster}
          src={`https://image.tmdb.org/t/p/w500/${actorData.profile_path}`}
          alt={`Headshot of ${actorData.name}`}
          width={300}
          height={450}
          priority
        />
      ) : (
        <NoPoster />
      )}
      {'biography' in actorData && (
        <div
          ref={ref}
          className={`${styles.text} ${
            textHeight >= 450 && !showMoreBio
              ? styles['hidden-bio']
              : styles['long-bio']
          }`}
        >
          <h2 className={styles.name}>{actorData.name}</h2>
          <div className={styles.info}>
            {getAge(actorData.birthday, actorData.deathday)}
            <span>
              {actorData.combined_credits.cast.length} Credit
              {actorData.combined_credits.cast.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className={styles.bio}>{actorData.biography}</p>
        </div>
      )}
      {textHeight >= 450 && (
        <button type='button' onClick={() => setShowMoreBio(!showMoreBio)}>
          {showMoreBio ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default Actor;
