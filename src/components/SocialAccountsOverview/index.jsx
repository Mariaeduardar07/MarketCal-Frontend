import styles from "./SocialAccountsOverview.module.css";

const platformIcons = {
  instagram: "📸",
  facebook: "👍",
  twitter: "🐦",
  tiktok: "🎵",
  linkedin: "💼",
  youtube: "📺",
};

export default function SocialAccountsOverview({ accounts }) {
  const accountsList = accounts || [
    {
      id: 1,
      platform: "instagram",
      name: "Brand Account",
      handle: "@meuBrand",
      posts: 45,
    },
    {
      id: 2,
      platform: "facebook",
      name: "Facebook Page",
      handle: "MeuBrand",
      posts: 32,
    },
    {
      id: 3,
      platform: "twitter",
      name: "Twitter Account",
      handle: "@meuBrand",
      posts: 28,
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🤝 Contas Sociais Conectadas</h2>
      <div className={styles.accountsGrid}>
        {accountsList.map((account) => (
          <div key={account.id} className={styles.accountCard}>
            <div className={styles.header}>
              <span className={styles.icon}>
                {platformIcons[account.platform.toLowerCase()] || "📱"}
              </span>
              <div className={styles.info}>
                <h3 className={styles.name}>{account.name}</h3>
                <p className={styles.handle}>{account.handle}</p>
              </div>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{account.posts}</span>
                <span className={styles.statLabel}>Postagens</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}