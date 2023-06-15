import { ApiError, DetailedPerson } from '@/utils/types';
import Actor from './Actor';
import Graphs from './Graphs';
import styles from './page.module.css';

type ActorData = DetailedPerson | ApiError;

const Page = async ({ params }: { params: { actorId: string } }) => {
  const API_KEY: string = process.env.API_KEY!;

  if (!params.actorId) return <p className={styles.error}>No Actor Id Found</p>;

  let actorData;
  let error;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${params.actorId}?api_key=${API_KEY}&language=en-US&append_to_response=combined_credits`,
      { next: { revalidate: 86400 * 7 } }
    );
    actorData = (await response.json()) as ActorData;
  } catch (err) {
    error = err as Error;
  }

  if (error) return <p className={styles.error}>{error.message}</p>;

  if (actorData && 'status_message' in actorData)
    return <p className={styles.error}>{actorData.status_message}</p>;

  if (actorData) {
    const ids = actorData.combined_credits.cast.map((credit) => credit.id);
    const creditsByPopularity = actorData.combined_credits.cast
      .filter((credit, i) => !ids.includes(credit.id, i + 1))
      .map((credit) => ({
        ...credit,
        name: 'name' in credit ? credit.name : credit.title,
      }))
      .sort((a, b) => b.popularity - a.popularity);

    actorData = {
      ...actorData,
      combined_credits: { cast: creditsByPopularity },
    };
  }

  return (
    actorData && (
      <div className={styles.actor}>
        <Actor actorData={actorData} />
        {'combined_credits' in actorData &&
          actorData.combined_credits.cast.length && (
            <Graphs credits={actorData.combined_credits.cast} />
          )}
      </div>
    )
  );
};

export default Page;
