import { Metadata } from 'next';
import {
  DetailedMovie,
  ApiError,
  Movie as MovieType,
  Collection,
} from '@/utils/types';
import Movie from './Movie';
import Graphs from './Graphs';
import styles from './page.module.css';

type MovieData = DetailedMovie | ApiError;
type CollectionData = Collection | ApiError;

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url, { next: { revalidate: 3600 } });
  return response.json() as T;
}

export async function generateMetadata({
  params,
}: {
  params: { movieId: string };
}): Promise<Metadata> {
  const API_KEY: string = process.env.API_KEY!;

  const movieUrl = `https://api.themoviedb.org/3/movie/${params.movieId}?api_key=${API_KEY}&language=en-US&append_to_response=watch/providers,credits`;
  const movieData = await fetchData<MovieData>(movieUrl);

  if ('title' in movieData)
    return {
      title: `${movieData.title}`,
      openGraph: {
        title: `${movieData.title}`,
        description: `View a rating graph for ${movieData.title}.`,
      },
    };

  return {};
}

const Page = async ({ params }: { params: { movieId: string } }) => {
  const API_KEY: string = process.env.API_KEY!;

  if (!params.movieId) return <p className={styles.error}>No Movie Id Found</p>;

  let movieData: MovieData | undefined;
  let collectionData: CollectionData | undefined;
  let error: Error | undefined;

  try {
    const movieUrl = `https://api.themoviedb.org/3/movie/${params.movieId}?api_key=${API_KEY}&language=en-US&append_to_response=watch/providers,credits`;
    movieData = await fetchData<MovieData>(movieUrl);

    if (
      'belongs_to_collection' in movieData &&
      movieData.belongs_to_collection !== null
    ) {
      const collectionUrl = `https://api.themoviedb.org/3/collection/${movieData.belongs_to_collection?.id}?api_key=${API_KEY}&language=en-US`;
      const tempCollection = await fetchData<CollectionData>(collectionUrl);

      if ('parts' in tempCollection) {
        // filtered date is 3 months from now. today + months * milliseconds
        const filterDate = Date.now() + 3 * 2628000000;
        const sortedParts: MovieType[] = tempCollection.parts
          .filter((a) => new Date(a.release_date).getTime() < filterDate)
          .sort((a, b) => a.release_date.localeCompare(b.release_date));
        collectionData = { ...tempCollection, parts: sortedParts };
      } else collectionData = tempCollection;
    }
  } catch (err) {
    error = err as Error;
  }

  if (error) return <p className={styles.error}>{error.message}</p>;

  if (movieData && 'status_message' in movieData)
    return <p className={styles.error}>{movieData.status_message}</p>;

  if (collectionData && 'status_message' in collectionData)
    return <p className={styles.error}>{collectionData.status_message}</p>;

  return (
    movieData && (
      <div className={styles.movie}>
        <Movie movieData={movieData} />
        <Graphs collectionData={collectionData} movieData={movieData} />
      </div>
    )
  );
};

export default Page;
