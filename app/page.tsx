import Search from '@/components/Search/Search';
import {
  ApiError,
  SearchResultTv,
  SearchResultMovie,
  SearchResultPerson,
} from '@/utils/types';
import Popular from './Popular';
import styles from './page.module.css';

interface Results {
  page: 1;
  results: (SearchResultTv | SearchResultMovie | SearchResultPerson)[];
  total_results: number;
  total_pages: number;
}

type PopularResponse = Results | ApiError;

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url, { next: { revalidate: 3600 } });
  return response.json() as T;
}

const Page = async () => {
  const API_KEY: string = process.env.API_KEY!;

  let popularData: PopularResponse | Error;

  try {
    const popularUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`;
    popularData = await fetchData<PopularResponse>(popularUrl);
  } catch (err) {
    popularData = err as Error;
  }

  if (popularData instanceof Error)
    return <p className={styles.error}>{popularData.message}</p>;

  if (popularData && 'status_message' in popularData)
    return <p className={styles.error}>{popularData.status_message}</p>;

  return (
    <div className={styles.container}>
      <p className={styles.instructions}>
        Search for Movies, TV Shows, or People
      </p>
      <Search />
      <Popular popularData={popularData.results} />
    </div>
  );
};

export default Page;
