import { DetailedMovie, ApiError } from '@/utils/types';
import { ImageResponse } from 'next/server';

type MovieData = DetailedMovie | ApiError;

export const runtime = 'edge';

export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: { movieId: string };
}) {
  const API_KEY: string = process.env.API_KEY!;

  const movie = (await fetch(
    `https://api.themoviedb.org/3/movie/${params.movieId}?api_key=${API_KEY}&language=en-US&append_to_response=watch/providers,credits`,
    { next: { revalidate: 86400 * 7 } }
  ).then((res) => res.json())) as MovieData;

  const dimensions = (data: MovieData): { width: number; height: number } => {
    if ('poster_path' in data && data.poster_path && !data.backdrop_path)
      return { width: 500, height: 750 };
    return { width: 1280, height: 720 };
  };

  const background = (data: MovieData) => {
    if ('backdrop_path' in data && data.backdrop_path)
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`})`,
            filter: 'blur(6px)',
          }}
        />
      );

    if ('poster_path' in data && data.poster_path)
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${`https://image.tmdb.org/t/p/w500/${data.poster_path}`})`,
            filter: 'blur(6px)',
          }}
        />
      );

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgb(22, 22, 22)',
        }}
      />
    );
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
        }}
      >
        {background(movie)}
        <p
          style={{
            position: 'absolute',
            fontSize: 72,
            color: 'white',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid white',
            backgroundColor: 'rgba(22, 22, 22, 0.7)',
            padding: '16px',
          }}
        >
          Ratings
        </p>
      </div>
    ),
    {
      ...dimensions(movie),
    }
  );
}
