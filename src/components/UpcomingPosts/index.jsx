import styles from "./UpcomingPosts.module.css";

export default function UpcomingPosts({ posts }) {
  const upcomingPosts = posts || [
    {
      id: 1,
      content: "Novo produto lançado!",
      platform: "Instagram",
      scheduledAt: "2025-12-01 10:00",
      status: "SCHEDULED",
    },
    {
      id: 2,
      content: "Dica de produtividade",
      platform: "LinkedIn",
      scheduledAt: "2025-12-01 14:30",
      status: "SCHEDULED",
    },
    {
      id: 3,
      content: "Promoção exclusiva",
      platform: "Facebook",
      scheduledAt: "2025-12-02 09:00",
      status: "SCHEDULED",
    },
  ];

  const getStatusBadgeColor = (status) => {
    const colors = {
      SCHEDULED: "#f093fb",
      PUBLISHED: "#4facfe",
      DRAFT: "#fdbb2d",
    };
    return colors[status] || "#718096";
  };

  const getStatusBadgeBg = (status) => {
    const colors = {
      SCHEDULED: "rgba(240, 147, 251, 0.1)",
      PUBLISHED: "rgba(79, 172, 254, 0.1)",
      DRAFT: "rgba(253, 187, 45, 0.1)",
    };
    return colors[status] || "rgba(113, 128, 150, 0.1)";
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>⏱️ Próximas Postagens</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Conteúdo</th>
              <th>Plataforma</th>
              <th>Data Agendada</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {upcomingPosts.length > 0 ? (
              upcomingPosts.map((post) => (
                <tr key={post.id} className={styles.tableRow}>
                  <td className={styles.content}>{post.content}</td>
                  <td>{post.platform}</td>
                  <td>{new Date(post.scheduledAt).toLocaleString("pt-BR")}</td>
                  <td>
                    <span
                      className={styles.badge}
                      style={{
                        backgroundColor: getStatusBadgeBg(post.status),
                        color: getStatusBadgeColor(post.status),
                      }}
                    >
                      {post.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.emptyMessage}>
                  Nenhuma postagem agendada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}