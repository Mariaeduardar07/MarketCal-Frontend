"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from "./PostsChart.module.css";

export default function PostsChart({ data }) {
  const chartData = data || [
    { date: "Seg", posts: 12 },
    { date: "Ter", posts: 19 },
    { date: "Qua", posts: 15 },
    { date: "Qui", posts: 25 },
    { date: "Sex", posts: 22 },
    { date: "Sab", posts: 18 },
    { date: "Dom", posts: 14 },
  ];

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.title}>Postagens por Dia</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a202c",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="posts"
            stroke="#667eea"
            strokeWidth={3}
            dot={{ fill: "#667eea", r: 5 }}
            activeDot={{ r: 7 }}
            name="Postagens"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}