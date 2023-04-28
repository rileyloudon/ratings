import Link from 'next/link';
import { Credit } from '../../utils/types';
import styles from './CastCard.module.css';
import Image from 'next/image';

const CastCard = ({ cast }: { cast: Credit[] }) => (
  <div className={styles.castCards}>
    {cast.map((person) =>
      person.profile_path !== null ? (
        <Link
          href={`/actor/${person.id}`}
          key={person.id.toString() + person.character}
          className={styles.card}
        >
          <Image
            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
            alt={`${person.name} Poster`}
            width={185}
            height={277}
          />
          <p className={styles.name}>{person.name}</p>
          <p className={styles.character}>{person.character}</p>
        </Link>
      ) : null
    )}
  </div>
);

export default CastCard;
