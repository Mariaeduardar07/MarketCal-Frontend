// /app/dashboard/components/UpcomingTasks.jsx

import styles from "./UpcomingTasks.module.css";

export default function UpcomingTasks({ posts }) {
  const ordered = posts.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Próximas Postagens</h2>

      <div className={styles.grid}>
        {ordered.map((post) => (
          <div key={post.id} className={styles.card}>
            <img src={post.imageUrl} alt="post" className={styles.image} />
            <h3 className={styles.postTitle}>{post.content}</h3>
            <p className={styles.date}>{post.scheduledAt}</p>
            <p className={styles.status}>Status: {post.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
