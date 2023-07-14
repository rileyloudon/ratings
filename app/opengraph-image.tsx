import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export const contentType = 'image/png';

export default async function Image() {
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
            backgroundColor: 'rgb(22, 22, 22)',
          }}
        />
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
      width: 1280,
      height: 720,
    }
  );
}
