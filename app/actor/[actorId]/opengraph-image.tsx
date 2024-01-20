import { DetailedPerson, ApiError } from '@/utils/types';
import { ImageResponse } from 'next/og';

type ActorData = DetailedPerson | ApiError;

export const runtime = 'edge';

export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: { actorId: string };
}) {
  const API_KEY: string = process.env.API_KEY!;

  const actor = (await fetch(
    `https://api.themoviedb.org/3/person/${params.actorId}?api_key=${API_KEY}&language=en-US&append_to_response=combined_credits`,
    { next: { revalidate: 3600 } }
  ).then((res) => res.json())) as ActorData;

  const background = (data: ActorData) => {
    if ('profile_path' in data && data.profile_path)
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${`https://image.tmdb.org/t/p/w500/${data.profile_path}`})`,
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
        {background(actor)}
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
      width: 500,
      height: 750,
    }
  );
}
