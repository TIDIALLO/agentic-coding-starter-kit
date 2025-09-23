"use client";

import * as React from "react";

export type DonutSlice = {
    label: string;
    value: number;
    color: string;
};

export type DonutChartProps = {
    size?: number;
    thickness?: number;
    data: DonutSlice[];
    className?: string;
};

function getTotal(data: DonutSlice[]): number
{
    return data.reduce((sum, s) => sum + (Number.isFinite(s.value) ? s.value : 0), 0) || 1;
}

export function DonutChart(props: DonutChartProps)
{
    const { size = 220, thickness = 22, data, className } = props;
    const radius = size / 2;
    const inner = radius - thickness;
    const total = getTotal(data);

    let cumulative = 0;
    const arcs = data.map((slice, index) =>
    {
        const start = (cumulative / total) * Math.PI * 2 - Math.PI / 2;
        cumulative += slice.value;
        const end = (cumulative / total) * Math.PI * 2 - Math.PI / 2;

        const x1 = radius + radius * Math.cos(start);
        const y1 = radius + radius * Math.sin(start);
        const x2 = radius + radius * Math.cos(end);
        const y2 = radius + radius * Math.sin(end);
        const largeArc = end - start > Math.PI ? 1 : 0;

        const outerArc = `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        const innerArc = `M ${radius} ${radius} L ${radius + inner * Math.cos(end)} ${radius + inner * Math.sin(end)} A ${inner} ${inner} 0 ${largeArc} 0 ${radius + inner * Math.cos(start)} ${radius + inner * Math.sin(start)} Z`;

        return { outerArc, innerArc, color: slice.color, label: slice.label, value: slice.value, index };
    });

    return (
        <div className={className}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    {arcs.map(a => (
                        <clipPath key={`c-${a.index}`} id={`clip-${a.index}`}>
                            <path d={a.innerArc} />
                        </clipPath>
                    ))}

                </defs>
                {/* background ring */}
                <circle cx={radius} cy={radius} r={radius} fill={"rgba(148,163,184,0.15)"} />
                <circle cx={radius} cy={radius} r={inner} fill={"white"} />

                {/* slices */}
                {arcs.map(a => (
                    <g key={a.index}>
                        <path d={a.outerArc} fill={a.color} />
                        <path d={a.innerArc} fill={"white"} />
                    </g>
                ))}
            </svg>

            {/* legend */}
            <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
                            <span className="text-slate-600 dark:text-slate-300">{d.label}</span>
                        </div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{d.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DonutChart;


