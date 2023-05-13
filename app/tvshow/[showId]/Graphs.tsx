'use client';

import { useEffect, useState } from 'react';
import { DetailedTv, Episode, Season } from '@/utils/types';
import LineGraph from '@/components/LineGraph/LineGraph';
import styles from './Graphs.module.css';

interface GraphsProps {
  tvData: DetailedTv;
  seasonData: Season;
}

const Graphs = ({ tvData, seasonData }: GraphsProps) => {
  const [episodesToDisplay] = useState<number>(10);
  const [seasonSelector, setSeasonSelector] = useState<string>('season/1');
  const [displayedData, setDisplayedData] = useState<Episode[]>();

  useEffect(() => {
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSeasonSelector(e.target.value);

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
    console.log(displayedData);

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

  return (
    <div className={styles.episodes}>
      <select name='season' id='season' onChange={handleChange}>
        {seasonOptions.map((seasonNumber, i) => (
          <option key={seasonNumber} value={`season/${i + 1}`}>
            {seasonNumber}
          </option>
        ))}
      </select>
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
