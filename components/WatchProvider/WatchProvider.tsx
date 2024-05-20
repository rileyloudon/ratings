'use client';

import { useEffect, useState } from 'react';

const WatchProvider = ({
  watchData,
  watchCountryCode,
}: {
  watchData: {
    results: {
      [countryCode: string]: {
        link: string;
        flatrate?: { logo_path: string; provider_name: string }[];
      };
    };
  };
  watchCountryCode: string | null;
}) => {
  const [countryCode, setCountryCode] = useState<string | null>(
    watchCountryCode
  );

  useEffect(() => {
    if (countryCode === null && typeof window !== 'undefined')
      setCountryCode(Intl.DateTimeFormat().resolvedOptions().locale.slice(-2));
  }, [countryCode]);

  if (countryCode) {
    const watchProviders = watchData.results[countryCode];

    if (watchProviders?.flatrate)
      return <span>Stream on {watchProviders.flatrate[0].provider_name}</span>;

    return <span>Unavailable to Stream</span>;
  }

  return null;
};

export default WatchProvider;
