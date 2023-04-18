import { DetailedTv, Season, ApiError } from '../../../utils/types';
import Graphs from './Graphs';
import TvShow from './TvShow';
import styles from './page.module.css';

type TvData = DetailedTv | ApiError;
type SeasonData = Season | ApiError;

const GetTvShow = async ({ params }: { params: { showId: string } }) => {
  const API_KEY: string = process.env.API_KEY!;

  if (!params.showId)
    return <p className={styles.error}>No Tv Show Id Found</p>;

  let tvData;
  let allSeasons: Season = {};
  let error;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${params.showId}?api_key=${API_KEY}&language=en-US&append_to_response=watch/providers,credits`
    );
    tvData = (await response.json()) as TvData;
  } catch (err) {
    error = err as Error;
  }

  if (error) return <p className={styles.error}>{error.message}</p>;
  if (tvData && 'status_message' in tvData)
    return <p className={styles.error}>{tvData.status_message}</p>;

  if (tvData && 'seasons' in tvData) {
    // Filter unreleased seasons
    const now = Date.now();
    const filteredSeasons = tvData.seasons.filter(
      (a) =>
        a.air_date !== null &&
        new Date(a.air_date).getTime() < now &&
        a.season_number > 0
    );

    tvData = {
      ...tvData,
      seasons: filteredSeasons,
      number_of_seasons: filteredSeasons.length,
    };

    // Get all released seasons
    // append_to_response has a limit of 20 sub requests
    // need to split fetch into groups of 20 or less.
    let appendString = '';
    const appendStringArray = [];
    for (let i = 1; i <= tvData.number_of_seasons; i += 1) {
      appendString += `season/${i},`;
      if (i % 20 === 0 || i === tvData.number_of_seasons) {
        appendStringArray.push(appendString);
        appendString = '';
      }
    }

    const promises = [];
    for (let i = 0; i < appendStringArray.length; i += 1) {
      promises.push(
        fetch(
          `https://api.themoviedb.org/3/tv/${params.showId}?api_key=${API_KEY}&append_to_response=${appendStringArray[i]}`
        )
      );
    }

    const res = await Promise.all(promises);
    const data = (await Promise.all(res.map((r) => r.json()))) as SeasonData[];

    const combinedData = Object.assign({}, ...data) as SeasonData;

    if ('status_message' in combinedData)
      return (
        <p className={styles.error}>{combinedData.status_message.toString()}</p>
      );

    Object.keys(combinedData).forEach((key) => {
      if (key.includes('season/')) allSeasons[key] = combinedData[key];
    });
  }

  return (
    tvData && (
      <>
        <TvShow tvData={tvData} />
        {<Graphs tvData={tvData} seasonData={allSeasons} />}
      </>
    )
  );
};

export default GetTvShow;
