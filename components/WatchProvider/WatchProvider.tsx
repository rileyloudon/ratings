'use client';

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
  const countryCode = Intl.DateTimeFormat().resolvedOptions().locale.slice(-2);

  const watchProviders = watchData.results[countryCode];
  if (watchProviders?.flatrate)
    return <span>Stream on {watchProviders.flatrate[0].provider_name}</span>;

  return <span>Unavailable to Stream</span>;
};

export default WatchProvider;
