"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

interface ViewsOverTime { date: string; views: number }
interface CategoryViews { name: string; views: number; color: string }

export function ViewsOverTimeChart({ data }: { data: ViewsOverTime[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(43,41,38,0.08)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8b8f99" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#8b8f99" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={{ fontSize: 12, fontFamily: "sans-serif" }} />
          <Line type="monotone" dataKey="views" stroke="#8C2F2F" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryViewsChart({ data }: { data: CategoryViews[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" tick={{ fontSize: 11, fill: "#8b8f99" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#8b8f99" }} axisLine={false} tickLine={false} width={110} />
          <Tooltip contentStyle={{ fontSize: 12, fontFamily: "sans-serif" }} />
          <Bar dataKey="views" fill="#C79A45" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
