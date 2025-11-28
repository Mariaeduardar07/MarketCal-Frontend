import styles from "./DashboardStats.module.css";

export default function DashboardStats({ stats }) {
  const statCards = [
    {
      label: "Total de Postagens",
      value: stats?.totalPosts || 0,
      icon: "📝",
      color: "#667eea",
      bgColor: "rgba(102, 126, 234, 0.1)",
    },
    {
      label: "Contas Conectadas",
      value: stats?.totalAccounts || 0,
      icon: "📱",
      color: "#764ba2",
      bgColor: "rgba(118, 75, 162, 0.1)",
    },
    {
      label: "Agendadas",
      value: stats?.scheduledPosts || 0,
      icon: "⏰",
      color: "#f093fb",
      bgColor: "rgba(240, 147, 251, 0.1)",
    },
    {
      label: "Publicadas",
      value: stats?.publishedPosts || 0,
      icon: "✅",
      color: "#4facfe",
      bgColor: "rgba(79, 172, 254, 0.1)",
    },
  ];

  return (
    <>
      {statCards.map((card, idx) => (
        <div
          key={idx}
          className={styles.statCard}
          style={{
            background: card.bgColor,
            borderLeft: `4px solid ${card.color}`,
          }}
        >
          <div className={styles.icon}>{card.icon}</div>
          <div className={styles.content}>
            <p className={styles.label}>{card.label}</p>
            <h3 className={styles.value} style={{ color: card.color }}>
              {card.value}
            </h3>
          </div>
        </div>
      ))}
    </>
  );
}