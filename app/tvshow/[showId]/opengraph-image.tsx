import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export const size = {
  width: 1280,
  height: 720,
};
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: { showId: string };
}) {
  const API_KEY: string = process.env.API_KEY!;

  const show = await fetch(
    `https://api.themoviedb.org/3/tv/${params.showId}?api_key=${API_KEY}&language=en-US&append_to_response=watch/providers,credits`
  ).then((res) => res.json());

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
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${`https://image.tmdb.org/t/p/w1280${show.backdrop_path}`})`,
            filter: 'blur(3px)',
          }}
        />
        <p
          style={{
            position: 'absolute',
            fontSize: 48,
            color: 'white',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid white',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '16px',
          }}
        >
          Ratings
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
