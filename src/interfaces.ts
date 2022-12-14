export interface TvShow {
  poster_path: string | null;
  popularity: number;
  id: number;
  overview: string;
  backdrop_path: string | null;
  vote_average: number;
  media_type?: 'tv';
  first_air_date: string;
  origin_country: string[];
  genre_ids: number[];
  original_language: string;
  vote_count: number;
  name: string;
  original_name: string;
}

export interface DetailedTv extends TvShow {
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
    season_number: string;
  }[];
  status: string;
  tagline: string;
}

export interface Movie {
  poster_path: string | null;
  adult: boolean;
  overview: string;
  release_date: string;
  original_title: string;
  genre_ids: number[];
  id: number;
  media_type?: 'movie';
  original_language: string;
  title: string;
  backdrop_path: string | null;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
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
}

export interface Person {
  profile_path: string | null;
  adult: boolean;
  id: number;
  media_type: 'person';
  known_for: (TvShow | Movie)[];
  name: string;
  popularity: number;
}

export interface ApiError {
  status_message: string;
  status_code: number;
}
