import { cn } from '@/lib/utils';

export interface PieChartItem {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartItem[];
  size?: number;
  className?: string;
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = [
    'M',
    x,
    y,
    'L',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    'Z',
  ].join(' ');
  return d;
}

export default function PieChart({
  data,
  size = 200,
  className,
}: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const center = size / 2;
  const radius = size / 2 - 4;
  const innerRadius = radius * 0.55;

  let cumulativeAngle = 0;

  const slices = data.map((item, index) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle = endAngle;

    const isFullCircle = sliceAngle >= 359.999;

    let outerPath: string;
    if (isFullCircle) {
      outerPath = `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center - 0.001} ${center - radius} Z`;
    } else {
      outerPath = describeArc(center, center, radius, startAngle, endAngle);
    }

    let innerPath: string;
    if (isFullCircle) {
      innerPath = `M ${center} ${center - innerRadius} A ${innerRadius} ${innerRadius} 0 1 0 ${center - 0.001} ${center - innerRadius} Z`;
    } else {
      innerPath = describeArc(center, center, innerRadius, startAngle, endAngle);
    }

    const midAngle = startAngle + sliceAngle / 2;
    const labelRadius = (radius + innerRadius) / 2;
    const labelPos = polarToCartesian(center, center, labelRadius, midAngle);

    return {
      ...item,
      index,
      outerPath,
      innerPath,
      labelPos,
      percentage: ((item.value / total) * 100).toFixed(1),
      sliceAngle,
    };
  });

  return (
    <div className={cn('flex flex-col items-center gap-6', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          <defs>
            {slices.map((slice) => (
              <filter
                key={`shadow-${slice.index}`}
                id={`pie-shadow-${slice.index}`}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="3"
                  floodColor={slice.color}
                  floodOpacity="0.25"
                />
              </filter>
            ))}
          </defs>

          {slices.map((slice) => (
            <g
              key={slice.index}
              className="cursor-pointer transition-all duration-300 hover:scale-105 origin-center"
              style={{ transformOrigin: `${center}px ${center}px` }}
            >
              <path
                d={slice.outerPath}
                fill={slice.color}
                filter={`url(#pie-shadow-${slice.index})`}
                className="transition-opacity duration-200 hover:opacity-90"
              />
              <path
                d={slice.innerPath}
                fill="#FDF8F3"
              />
            </g>
          ))}

          {slices.map((slice) => {
            if (slice.sliceAngle < 15) return null;
            return (
              <text
                key={`label-${slice.index}`}
                x={slice.labelPos.x}
                y={slice.labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none fill-spice-charcoal text-xs font-semibold"
              >
                {slice.percentage}%
              </text>
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-display font-bold text-spice-charcoal">
            {total}
          </span>
          <span className="text-xs text-spice-brown/70">总计</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 w-full max-w-xs">
        {slices.map((slice) => (
          <div
            key={slice.index}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div
              className="h-3 w-3 shrink-0 rounded-md shadow-sm transition-transform duration-200 group-hover:scale-125"
              style={{ backgroundColor: slice.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium text-spice-charcoal">
                {slice.label}
              </div>
              <div className="text-xs text-spice-brown/70">
                {slice.value} ({slice.percentage}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
