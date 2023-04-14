import {
  DetailedMovie,
  ApiError,
  Movie as MovieType,
  Collection,
} from '../../../utils/types';
import Movie from './Movie';
import Graphs from './Graphs';
import styles from './Movie.module.css';

type MovieData = DetailedMovie | ApiError;
type CollectionData = Collection | ApiError;

const GetMovie = async ({ params }: { params: { movieId: string } }) => {
  const API_KEY: string = process.env.API_KEY!;

  if (!params.movieId) return <p className={styles.error}>No MovieId Found</p>;

  let movieData;
  let collectionData;
  let error;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${params.movieId}?api_key=${API_KEY}&language=en-US&append_to_response=watch/providers,credits`
    );
    movieData = (await response.json()) as MovieData;

    if (
      'belongs_to_collection' in movieData &&
      movieData.belongs_to_collection !== null
    ) {
      const collectionResponse = await fetch(
        `https://api.themoviedb.org/3/collection/${movieData.belongs_to_collection?.id}?api_key=${API_KEY}&language=en-US`
      );
      const tempCollection =
        (await collectionResponse.json()) as CollectionData;
      if ('parts' in tempCollection) {
        const now = Date.now();
        const sortedParts: MovieType[] = tempCollection.parts
          .sort((a, b) => a.release_date.localeCompare(b.release_date))
          .filter((a) => new Date(a.release_date).getTime() < now);
        collectionData = { ...tempCollection, parts: sortedParts };
      } else collectionData = tempCollection;
    }
  } catch (err) {
    error = err as Error;
  }

  if (error) return <p className={styles.error}>{error.message}</p>;

  return (
    movieData && (
      <>
        <Movie movieData={movieData} />
        <Graphs collectionData={collectionData} movieData={movieData} />
      </>
    )
  );
};

export default GetMovie;
