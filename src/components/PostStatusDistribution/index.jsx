"use client";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./PostStatusDistribution.module.css";

export default function PostStatusDistribution({ data }) {
  const chartData = data || [
    { name: "Agendadas", value: 35, color: "#f093fb" },
    { name: "Publicadas", value: 45, color: "#4facfe" },
    { name: "Rascunhos", value: 20, color: "#fdbb2d" },
  ];

  const COLORS = chartData.map((item) => item.color);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>🎯 Distribuição de Status</h2>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a202c",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}