'use client';

import { useEffect, useState } from 'react';
import { Collection, DetailedMovie, Movie } from '@/utils/types';
import LineGraph from '@/components/LineGraph/LineGraph';
import styles from './Graphs.module.css';

const Graphs = ({
  collectionData,
  movieData,
}: {
  collectionData: Collection | undefined;
  movieData: DetailedMovie;
}) => {
  const [moviesToDisplay, setMoviesToDisplay] = useState<number>(10);
  const [displayedData, setDisplayedData] = useState<Movie[]>();

  useEffect(() => {
    window.innerWidth > 400 ? setMoviesToDisplay(10) : setMoviesToDisplay(5);
  }, []);

  useEffect(() => {
    if (collectionData && !('status_message' in collectionData))
      setDisplayedData(collectionData.parts.slice(0, moviesToDisplay));
  }, [collectionData, moviesToDisplay]);

  const handlePrevClick = () => {
    if (
      collectionData &&
      !('status_message' in collectionData) &&
      displayedData
    ) {
      const endingValue = collectionData.parts.findIndex(
        (obj) => obj.id === displayedData[0].id
      );

      setDisplayedData(
        collectionData.parts.slice(
          endingValue - moviesToDisplay >= 0
            ? endingValue - moviesToDisplay
            : 0,
          endingValue
        )
      );
    }
  };

  const handleNextClick = () => {
    if (
      collectionData &&
      !('status_message' in collectionData) &&
      displayedData
    ) {
      const startingValue = collectionData.parts.findIndex(
        (obj) => obj.id === displayedData[displayedData.length - 1].id
      );

      setDisplayedData(
        collectionData.parts.slice(
          startingValue + 1,
          startingValue + moviesToDisplay + 1 <= collectionData.parts.length
            ? startingValue + moviesToDisplay + 1
            : collectionData.parts.length
        )
      );
    }
  };

  return (
    <div className={styles.collection}>
      <p>{collectionData?.name || 'Standalone Movie'}</p>
      <LineGraph
        data={displayedData || [movieData]}
        xAxisDataKey='title'
        xAxisLabel='Movie Title'
        highlightDot={movieData}
        allowClick={!!collectionData}
      />
      {collectionData && collectionData.parts.length > moviesToDisplay && (
        <div className={styles.nav}>
          <button
            disabled={
              displayedData &&
              displayedData[0].id === collectionData.parts[0].id
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
                collectionData.parts[collectionData.parts.length - 1].id
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
