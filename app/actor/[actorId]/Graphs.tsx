'use client';

import { useEffect, useState } from 'react';
import { Movie, TvShow } from '@/utils/types';
import LineGraph from '@/components/LineGraph/LineGraph';
import styles from './Graphs.module.css';

interface GraphsProps {
  credits: (Movie | TvShow)[];
}

const Graphs = ({ credits }: GraphsProps) => {
  const [creditsToDisplay, setCreditsToDisplay] = useState<number>(10);
  const [displayedData, setDisplayedData] = useState<(Movie | TvShow)[]>(
    credits.slice(0, creditsToDisplay)
  );

  useEffect(() => {
    window.innerWidth > 400 ? setCreditsToDisplay(10) : setCreditsToDisplay(5);
  }, []);

  const handlePrevClick = () => {
    const endingValue = credits.findIndex(
      (obj) => obj.id === displayedData[0].id
    );

    setDisplayedData(
      credits.slice(
        endingValue - creditsToDisplay >= 0
          ? endingValue - creditsToDisplay
          : 0,
        endingValue
      )
    );
  };

  const handleNextClick = () => {
    const startingValue = credits.findIndex(
      (obj) => obj.id === displayedData[displayedData.length - 1].id
    );

    setDisplayedData(
      credits.slice(
        startingValue + 1,
        startingValue + creditsToDisplay + 1 <= credits.length
          ? startingValue + creditsToDisplay + 1
          : credits.length
      )
    );
  };

  return (
    <div className={styles.credits}>
      <p>Most Popular Credits</p>
      <div className={styles.nav}>
        <button
          disabled={displayedData[0].id === credits[0].id}
          type='button'
          onClick={handlePrevClick}
        >
          Previous {creditsToDisplay}
        </button>
        <button
          disabled={
            displayedData[displayedData.length - 1].id ===
            credits[credits.length - 1].id
          }
          type='button'
          onClick={handleNextClick}
        >
          Next {creditsToDisplay}
        </button>
      </div>
      <LineGraph
        data={displayedData}
        xAxisDataKey='name'
        xAxisLabel='Credit Name'
        allowClick
      />
    </div>
  );
};
export default Graphs;
