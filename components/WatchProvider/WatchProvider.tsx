'use client';

import { useEffect, useState } from 'react';

const WatchProvider = ({
  watchData,
}: {
  watchData: {
    results: {
      [countryCode: string]: {
        link: string;
        flatrate?: { logo_path: string; provider_name: string }[];
      };
    };
  };
}) => {
  const [countryCode, setCountryCode] = useState<string>();

  useEffect(() => {
    if (typeof window !== 'undefined')
      setCountryCode(Intl.DateTimeFormat().resolvedOptions().locale.slice(-2));
  }, []);

  if (countryCode) {
    const watchProviders = watchData.results[countryCode];

    if (watchProviders?.flatrate)
      return <span>Stream on {watchProviders.flatrate[0].provider_name}</span>;

    return <span>Unavailable to Stream</span>;
  }

  return null;
};

export default WatchProvider;
