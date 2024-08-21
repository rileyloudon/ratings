'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DetailedTv, Episode, Season } from '@/utils/types';
import LineGraph from '@/components/LineGraph/LineGraph';
import styles from './Graphs.module.css';

interface GraphsProps {
  tvData: DetailedTv;
  seasonData: Season;
}

const Graphs = ({ tvData, seasonData }: GraphsProps) => {
  const router = useRouter();

  const [episodesToDisplay] = useState<number>(10);
  const [seasonSelector, setSeasonSelector] = useState<string>('season/1');
  const [displayedData, setDisplayedData] = useState<Episode[]>();
  const ref = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const hashSeason = Number(location.hash.replace('#season=', ''));

    const defaultSeason =
      hashSeason > 0 && hashSeason <= tvData.number_of_seasons
        ? `season/${hashSeason}`
        : 'season/1';

    setSeasonSelector(defaultSeason);

    if (ref.current !== null) ref.current.value = defaultSeason;

    window.innerWidth < 400 &&
    tvData.number_of_episodes / tvData.number_of_seasons > 100
      ? 5
      : 10;
  }, [tvData]);

  useEffect(() => {
    if (
      seasonData &&
      !('status_message' in seasonData) &&
      seasonData[seasonSelector].episodes.length
    )
      setDisplayedData(
        seasonData[seasonSelector].episodes.slice(0, episodesToDisplay)
      );
  }, [seasonData, seasonSelector, episodesToDisplay]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeasonSelector(e.target.value);

    router.replace(`#season=${e.target.value.replace('season/', '')}`, {
      scroll: false,
    });
  };

  const handlePrevClick = () => {
    if (seasonData && !('status_message' in seasonData) && displayedData) {
      const { episodes } = seasonData[seasonSelector];

      const endingValue = episodes.findIndex(
        (obj) => obj.id === displayedData[0].id
      );

      setDisplayedData(
        episodes.slice(
          endingValue - episodesToDisplay >= 0
            ? endingValue - episodesToDisplay
            : 0,
          endingValue
        )
      );
    }
  };

  const handleNextClick = () => {
    if (seasonData && !('status_message' in seasonData) && displayedData) {
      const { episodes } = seasonData[seasonSelector];

      const startingValue = episodes.findIndex(
        (obj) => obj.id === displayedData[displayedData.length - 1].id
      );

      setDisplayedData(
        episodes.slice(
          startingValue + 1,
          startingValue + episodesToDisplay + 1 <= episodes.length
            ? startingValue + episodesToDisplay + 1
            : episodes.length
        )
      );
    }
  };

  const seasonOptions = Array.from(
    { length: tvData.number_of_seasons },
    (x, i) => `Season ${i + 1}`
  );

  const renderSeasonDropdown = () => {
    if (seasonOptions.length === 1) {
      return <p className={styles.season}>Season 1</p>;
    }
    return (
      <select
        name='seasonDropdown'
        id='seasonDropdown'
        onChange={handleChange}
        ref={ref}
      >
        {seasonOptions.map((seasonNumber, i) => (
          <option key={seasonNumber} value={`season/${i + 1}`}>
            {seasonNumber}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className={styles.episodes}>
      {renderSeasonDropdown()}
      {displayedData && (
        <LineGraph
          data={displayedData}
          xAxisDataKey='episode_number'
          xAxisLabel='Episode'
        />
      )}
      {seasonData &&
        seasonData[seasonSelector].episodes.length > episodesToDisplay && (
          <div className={styles.nav}>
            <button
              disabled={
                displayedData &&
                displayedData[0].id ===
                  seasonData[seasonSelector].episodes[0].id
              }
              type='button'
              onClick={handlePrevClick}
            >
              Previous
            </button>
            <button
              disabled={
                displayedData &&
                displayedData[displayedData.length - 1].id ===
                  seasonData[seasonSelector].episodes[
                    seasonData[seasonSelector].episodes.length - 1
                  ].id
              }
              type='button'
              onClick={handleNextClick}
            >
              Next
            </button>
          </div>
        )}
    </div>
  );
};

export default Graphs;
