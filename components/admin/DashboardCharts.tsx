"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const BRAND = "#4F46E5";
const PALETTE = ["#4F46E5", "#818CF8", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];

const cardCls = "card p-5";
const titleCls = "text-sm font-semibold text-ink/70";

export function RequestsOverTime({ data }: { data: { label: string; count: number }[] }) {
  return (
    <div className={cardCls}>
      <h3 className={titleCls}>Requests over time</h3>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="reqFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
                <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#71717A" }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#71717A" }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
            <Area type="monotone" dataKey="count" stroke={BRAND} strokeWidth={2.5} fill="url(#reqFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ProjectsStatus({ data }: { data: { name: string; value: number }[] }) {
  const filtered = data.filter((d) => d.value > 0);
  return (
    <div className={cardCls}>
      <h3 className={titleCls}>Projects by status</h3>
      <div className="mt-4 h-56">
        {filtered.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-ink/40">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={filtered} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                {filtered.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {filtered.map((d, i) => (
          <span key={d.name} className="flex items-center gap-1.5 text-xs text-ink/60">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
            {d.name} ({d.value})
          </span>
        ))}
      </div>
    </div>
  );
}

export function MostRequestedServices({ data }: { data: { name: string; count: number }[] }) {
  return (
    <div className={cardCls}>
      <h3 className={titleCls}>Most requested content</h3>
      <div className="mt-4 h-56">
        {data.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-ink/40">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
              <XAxis type="number" allowDecimals={false} hide />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: "#71717A" }} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "#00000008" }} contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              <Bar dataKey="count" fill={BRAND} radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export function CreatorRatings({ data }: { data: { name: string; rating: number }[] }) {
  return (
    <div className={cardCls}>
      <h3 className={titleCls}>Top creator ratings</h3>
      <div className="mt-4 h-56">
        {data.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-ink/40">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#71717A" }} tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: "#71717A" }} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "#00000008" }} contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              <Bar dataKey="rating" fill="#F59E0B" radius={[6, 6, 0, 0]} barSize={26} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
