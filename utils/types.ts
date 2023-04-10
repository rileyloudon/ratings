// Tv Types
export interface TvShow {
  poster_path: string | null;
  popularity: number;
  id: number;
  overview: string;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  origin_country: string[];
  genre_ids: number[];
  original_language: string;
  vote_count: number;
  name: string;
  original_name: string;
}

export interface SearchResultTv extends TvShow {
  media_type: 'tv';
}

export interface DetailedTv extends TvShow {
  number_of_episodes: number;
  number_of_seasons: number;
  episode_run_time: number[];
  genres: { id: number; name: string }[];
  last_air_date: string;
  seasons: {
    air_date: string;
    epside_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
  }[];
  status: string;
  tagline: string;

  // from append_to_response=watch/providers
  'watch/providers': {
    results: {
      [countryCode: string]: {
        link: string;
        flatrate?: { logo_path: string; provider_name: string }[];
      };
    };
  };

  // from append_to_response=credits
  credits: {
    cast: Credit[];
  };
}

export interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  id: number;
}

export interface Season {
  [season: string]: {
    name: string;
    season_number: number;
    episodes: Episode[];
  };
}

// Movie Types
export interface Movie {
  poster_path: string | null;
  adult: boolean;
  overview: string;
  release_date: string;
  original_title: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  title: string;
  backdrop_path: string | null;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

export interface SearchResultMovie extends Movie {
  media_type: 'movie';
}

export interface DetailedMovie extends Movie {
  genres: { id: number; name: string }[];
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
  runtime: number;

  // from append_to_response=watch/providers
  'watch/providers': {
    results: {
      [countryCode: string]: {
        link: string;
        flatrate?: { logo_path: string; provider_name: string }[];
      };
    };
  };

  // from append_to_response=credits
  credits: {
    cast: Credit[];
  };
}

export interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  parts: Movie[];
}

// Actor Types
export interface Person {
  profile_path: string | null;
  adult: boolean;
  id: number;
  known_for: (TvShow | Movie)[];
  name: string;
  popularity: number;
}

export interface SearchResultPerson extends Person {
  media_type: 'person';
}

export interface DetailedPerson extends Person {
  birthday: string;
  biography: string;
  combined_credits: {
    cast: (Movie | TvShow)[];
  };
}

// Misc
export interface Credit {
  character: string;
  name: string;
  id: number;
  profile_path: string;
}

export interface ApiError {
  status_message: string;
  status_code: number;
}
