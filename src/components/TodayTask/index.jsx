// /app/dashboard/components/TodayTask.jsx

import styles from "./TodayTask.module.css";

export default function TodayTask({ posts }) {
  const today = new Date().toISOString().split("T")[0];

  const todayPosts = posts.filter((p) => p.scheduledAt === today);

  if (todayPosts.length === 0)
    return <p className={styles.empty}>Nenhum post para hoje.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tarefas de Hoje</h2>

      {todayPosts.map((post) => (
        <div key={post.id} className={styles.post}>
          <img src={post.imageUrl} alt="post" className={styles.image} />
          <h3 className={styles.content}>{post.content}</h3>
          <p className={styles.status}>Status: {post.status}</p>
        </div>
      ))}
    </div>
  );
}
