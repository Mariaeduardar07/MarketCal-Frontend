import styles from './ProgressCard.module.css';
import { Edit2, Trash2 } from 'lucide-react';

const ProgressCard = ({ 
  image, 
  title, 
  category, 
  progress, 
  timeLeft, 
  daysLeft, 
  teamMembers,
  platform = 'instagram',
  postId,
  onEdit,
  onDelete
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={image} 
          alt={title} 
          className={styles.cardImage}
        />
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.category}>{category}</p>
        
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Progress</span>
            <span className={styles.progressPercent}>{progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={`${styles.progressFill} ${styles[platform]}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className={styles.cardFooter}>
          <div className={styles.timeInfo}>
            <span className={styles.timeIcon}>⏰</span>
            <span className={styles.timeText}>
              {daysLeft ? `${daysLeft} Days Left` : timeLeft}
            </span>
          </div>
          
          <div className={styles.teamMembers}>
            {teamMembers.map((member, index) => (
              <img 
                key={index}
                src={member} 
                alt={`Team member ${index + 1}`}
                className={styles.memberAvatar}
              />
            ))}
          </div>
        </div>

        <div className={styles.cardActions}>
          {onEdit && (
            <button 
              className={styles.actionBtn}
              onClick={() => onEdit(postId)}
              title="Editar post"
            >
              <Edit2 size={18} strokeWidth={2} />
            </button>
          )}
          {onDelete && (
            <button 
              className={styles.actionBtn}
              onClick={() => onDelete(postId)}
              title="Deletar post"
            >
              <Trash2 size={18} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;