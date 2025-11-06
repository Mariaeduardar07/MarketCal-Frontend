// /app/dashboard/components/SocialAccountsCarousel.jsx

import styles from "./SocialAccountsCarousel.module.css";

export default function SocialAccountsCarousel({ accounts }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Suas Redes Sociais</h2>

      <div className={styles.list}>
        {accounts.map((acc) => (
          <div key={acc.id} className={styles.card}>
            <p className={styles.platform}>{acc.platform}</p>
            <h3 className={styles.handle}>{acc.handle}</h3>
            <p className={styles.createdAt}>Criado em: {acc.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
