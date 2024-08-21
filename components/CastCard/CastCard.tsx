'use client';

import HorizontalScoll from '../HorizontalScroll/HorizontalScroll';
import Link from 'next/link';
import { Credit } from '../../utils/types';
import { useRef } from 'react';
import Image from 'next/image';
import styles from './CastCard.module.css';

const CastCard = ({ cast }: { cast: Credit[] }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <HorizontalScoll containerRef={cardRef} maxWidthPerItem={185}>
      <div className={styles.castCards} ref={cardRef}>
        {cast.map(
          (person) =>
            person.profile_path && (
              <Link
                prefetch={false}
                href={`/actor/${person.id}`}
                key={person.id.toString() + person.character}
                className={styles.card}
                tabIndex={-1}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={`Headshot of ${person.name}`}
                  width={185}
                  height={277}
                />
                <p className={styles.name}>{person.name}</p>
                <p className={styles.character}>{person.character}</p>
              </Link>
            )
        )}
      </div>
    </HorizontalScoll>
  );
};

export default CastCard;
