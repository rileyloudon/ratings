import { Metadata } from 'next';
import {
  ApiError,
  SearchResultMovie,
  SearchResultPerson,
  SearchResultTv,
} from '@/utils/types';
import SearchResults from './SearchResults';
import styles from './page.module.css';

interface Results {
  page: number;
  results?: (SearchResultTv | SearchResultMovie | SearchResultPerson)[];
  total_pages: number;
  total_results: number;
}

type SearchResults = Results | ApiError;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Search`,
    openGraph: {
      title: `Search`,
    },
  };
}

const Page = async ({
  searchParams,
}: {
  searchParams: { q?: string; page?: number };
}) => {
  const API_KEY: string = process.env.API_KEY!;
  const { q, page } = searchParams;

  if (!q) return <p className={styles.error}>No Search String Found.</p>;
  if (!page) return <p className={styles.error}>No Page Number Found</p>;

  let searchData;
  let error;

  try {
    const decodedQuery = decodeURIComponent(q);
    searchData = (await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${decodedQuery}&page=${page}`,
      { next: { revalidate: 3600 } }
    ).then((res) => res.json())) as SearchResults;
  } catch (e) {
    error = e as Error;
  }

  if (error) return <p className={styles.error}>{error.message}</p>;

  if (searchData && 'status_message' in searchData)
    return <p className={styles.error}>{searchData.status_message}</p>;

  if (searchData?.results === undefined || !searchData.results.length)
    return <p className={styles['no-results']}>No results found</p>;

  return (
    searchData && (
      <SearchResults
        results={searchData.results}
        pageNumber={searchData.page}
        totalPages={searchData.total_pages}
      />
    )
  );
};

export default Page;
