"use client";

import * as React from "react";

type LinePoint = { x: number; y: number };

export type LineChartProps = {
    width?: number;
    height?: number;
    points: LinePoint[];
    stroke?: string;
    fill?: string;
    gridColor?: string;
    showDots?: boolean;
    className?: string;
};

function normalizePoints(points: LinePoint[], width: number, height: number): string
{
    if (points.length === 0) return "";
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    const toSvg = (p: LinePoint) =>
    {
        const nx = ((p.x - minX) / rangeX) * (width - 32) + 16;
        const ny = height - (((p.y - minY) / rangeY) * (height - 32) + 16);
        return `${nx},${ny}`;
    };

    return points.map(toSvg).join(" ");
}

export function LineChart(props: LineChartProps)
{
    const {
        width = 520,
        height = 220,
        points,
        stroke = "#22d3ee",
        fill = "rgba(34,211,238,0.12)",
        gridColor = "rgba(148,163,184,0.2)",
        showDots = true,
        className,
    } = props;

    const d = normalizePoints(points, width, height);
    const coordinates = React.useMemo(() => d.split(" ").map(pair =>
    {
        const [x, y] = pair.split(",").map(Number);
        return { x, y } as LinePoint;
    }), [d]);

    return (
        <div className={className}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Line chart">
                {/* grid */}
                <g>
                    <line x1="16" y1={height - 16} x2={width - 16} y2={height - 16} stroke={gridColor} strokeWidth="1" />
                    <line x1="16" y1="16" x2="16" y2={height - 16} stroke={gridColor} strokeWidth="1" />
                </g>
                {/* area */}
                {coordinates.length > 1 && (
                    <polygon
                        points={`16,${height - 16} ${d} ${width - 16},${height - 16}`}
                        fill={fill}
                    />
                )}
                {/* line */}
                {d && (
                    <polyline
                        points={d}
                        fill="none"
                        stroke={stroke}
                        strokeWidth={3}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                )}
                {/* dots */}
                {showDots && coordinates.map((p, idx) => (
                    <circle key={idx} cx={p.x} cy={p.y} r={3.5} fill={stroke} />
                ))}
            </svg>
        </div>
    );
}

export default LineChart;


