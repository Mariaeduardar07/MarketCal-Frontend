"use client";
import { FileText, Users, Clock, CheckCircle } from "lucide-react";
import styles from "./DashboardStats.module.css";

export default function DashboardStats({ stats = {}, variant = "default" }) {
  const defaultStats = {
    totalPosts: 0,
    activeAccounts: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
  };

  const currentStats = { ...defaultStats, ...stats };

  const statsData = [
    {
      icon: <FileText size={20} strokeWidth={2.5} />,
      value: currentStats.totalPosts,
      label: "Total",
      color: "#fff",
    },
    {
      icon: <Users size={20} strokeWidth={2.5} />,
      value: currentStats.activeAccounts,
      label: "Contas",
      color: "#fff",
    },
    {
      icon: <Clock size={20} strokeWidth={2.5} />,
      value: currentStats.scheduledPosts,
      label: "Agendadas",
      color: "#fff",
    },
    {
      icon: <CheckCircle size={20} strokeWidth={2.5} />,
      value: currentStats.publishedPosts,
      label: "Publicadas",
      color: "#fff",
    },
  ];

  if (variant === "overview") {
    return (
      <>
        {statsData.map((stat, index) => (
          <div key={index} className={styles.miniStatCard}>
            <div className={styles.miniStatIcon} style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <p className={styles.miniStatValue}>{stat.value}</p>
            <p className={styles.miniStatLabel}>{stat.label}</p>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className={styles.statsGrid}>
      {statsData.map((stat, index) => (
        <div key={index} className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15` }}>
            <div style={{ color: stat.color }}>{stat.icon}</div>
          </div>
          <div className={styles.statContent}>
            <p className={styles.statValue}>{stat.value}</p>
            <p className={styles.statLabel}>{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}