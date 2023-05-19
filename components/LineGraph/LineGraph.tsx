import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import {
  DetailedMovie,
  Episode,
  Movie,
  SearchResultMovie,
  SearchResultTv,
} from '../../utils/types';
import { usePathname, useRouter } from 'next/navigation';
import styles from './LineGraph.module.css';

interface LineGraphProps {
  data: {
    id: number;
    vote_average: number;
    media_type?: 'person' | 'movie' | 'tv';
  }[];
  xAxisDataKey: string;
  xAxisLabel: string;
  allowClick?: boolean;
  highlightDot?: DetailedMovie;
}

interface ClickPayload {
  activePayload?: {
    payload: SearchResultMovie | SearchResultTv | Movie;
  }[];
}

interface DotPayload {
  payload: Movie;
  cx: number;
  cy: number;
}

const LineGraph = ({
  data,
  xAxisDataKey,
  xAxisLabel,
  allowClick = false,
  highlightDot,
}: LineGraphProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const tickFormatter = (value: string): string => {
    if (typeof value === 'string') {
      const limit = 20;
      if (value.length <= limit) return value;
      return `${value.substring(0, limit)}...`;
    }
    return value;
  };

  const handleClick = (e: ClickPayload) => {
    if (e !== null && allowClick && e.activePayload) {
      const { payload } = e.activePayload[0];

      // media_type wont exist on Movie, so default to that
      // tv shows will always include media_type
      const type =
        'media_type' in payload && payload.media_type === 'tv'
          ? 'tvshow'
          : 'movie';

      if (pathname !== `/${type}/${payload.id}`)
        router.push(`/${type}/${payload.id}`);
    }
  };

  const customDot = (e: DotPayload): JSX.Element => (
    <circle
      key={e.cx}
      cx={e.cx}
      cy={e.cy}
      r='3'
      fill={
        highlightDot && e.payload.title === highlightDot?.title
          ? 'var(--blue)'
          : 'var(--text)'
      }
    >
      {highlightDot && e.payload.title === highlightDot?.title && (
        <animate
          attributeName='r'
          values='3;7;3'
          dur='2s'
          repeatCount='indefinite'
        />
      )}
    </circle>
  );

  const customTooltip = ({
    active,
    payload,
  }: TooltipProps<number, string>): JSX.Element | null => {
    if (active && payload && payload.length) {
      const hovered = payload[0].payload as Episode | Movie;
      return (
        <div className={styles.tooltip}>
          <p>{'name' in hovered ? hovered.name : hovered.title}</p>
          <p>{`${'Rating'} : ${payload[0].value || 'None'}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.graph}>
      <ResponsiveContainer width='100%' height={350}>
        <LineChart
          // Key makes sure animation works
          key={pathname}
          data={data}
          onClick={(e) => handleClick(e)}
          style={allowClick && { cursor: 'pointer' }}
          margin={{
            top: 5,
            right: 75,
            left: 10,
            bottom: 85,
          }}
        >
          <Line
            name='Rating'
            dataKey='vote_average'
            stroke='var(--text)'
            type='monotone'
            dot={(e: DotPayload) => customDot(e)}
            activeDot={{ fill: 'var(--blue)', stroke: 'var(--blue)' }}
          />
          <XAxis
            tick={{ fill: 'var(--text)' }}
            dataKey={xAxisDataKey.toString()}
            interval={0}
            tickFormatter={tickFormatter}
            angle={xAxisLabel === 'Episode' ? 0 : 315}
          >
            <Label
              value={xAxisLabel}
              position='insideBottom'
              offset={-70}
              style={{ fill: 'var(--text)' }}
            />
          </XAxis>
          <YAxis
            tick={{ fill: 'var(--text)' }}
            type='number'
            domain={[0, 10]}
            tickCount={6}
            allowDecimals={false}
            allowDataOverflow={false}
          >
            <Label
              value='Rating'
              position='insideLeft'
              angle={-90}
              style={{ fill: 'var(--text)' }}
            />
          </YAxis>
          <Tooltip
            wrapperClassName={styles['tooltip-wrapper']}
            contentStyle={{ backgroundColor: 'var(--background)' }}
            cursor={{ stroke: 'var(--text', opacity: '75%' }}
            content={customTooltip}
          />
          <CartesianGrid strokeDasharray='2 1' opacity='50%' />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;
