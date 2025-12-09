"use client";

import React from 'react';
import styles from './InfluencerDetail.module.css';

const InfluencerDetail = ({ influencer, onClose, onEdit, onDelete }) => {
  if (!influencer) return null;

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
      onClose(); // Fechar modal de detalhes
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
      onClose(); // Fechar modal de detalhes
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.header}>
          <div className={styles.avatarSection}>
            <img 
              src={influencer.avatar || '/image/logo.png'} 
              alt={influencer.name}
              className={styles.avatar}
            />
            {influencer.verified && (
              <span className={styles.verifiedBadge}>✓ Verificado</span>
            )}
          </div>
          
          <div className={styles.basicInfo}>
            <h1 className={styles.name}>{influencer.name}</h1>
            <p className={styles.category}>{influencer.category}</p>
            
            <div className={styles.platformBadges}>
              {influencer.platforms?.map((platform, index) => (
                <span key={index} className={styles.platformBadge}>
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Seguidores</span>
            <span className={styles.statValue}>{influencer.followers}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Engajamento</span>
            <span className={styles.statValue}>{influencer.engagement}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Alcance Médio</span>
            <span className={styles.statValue}>{influencer.avgViews || '2.5M'}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total de Posts</span>
            <span className={styles.statValue}>{influencer.totalPosts || '1.5K'}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Público Alvo</h2>
          <div className={styles.audienceGrid}>
            <div className={styles.audienceItem}>
              <span className={styles.audienceLabel}>Distribuição por Gênero</span>
              <div className={styles.genderSplit}>
                <div className={styles.genderItem}>
                  <span>Mulheres</span>
                  <span className={styles.percentage}>{influencer.audience?.women || '65'}%</span>
                </div>
                <div className={styles.genderItem}>
                  <span>Homens</span>
                  <span className={styles.percentage}>{influencer.audience?.men || '35'}%</span>
                </div>
              </div>
            </div>
            
            <div className={styles.audienceItem}>
              <span className={styles.audienceLabel}>Localização Principal</span>
              <p className={styles.audienceValue}> {influencer.location || 'Brasil'}</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Interesses do Público</h2>
          <div className={styles.tagsContainer}>
            {(influencer.interests || ['Moda', 'Beleza', 'Lifestyle', 'Fitness', 'Viagens']).map((interest, index) => (
              <span key={index} className={styles.tag}>{interest}</span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Melhor Horário para Engajamento</h2>
          <div className={styles.timeSlots}>
            <div className={styles.timeSlot}>
              <span className={styles.timeLabel}>Manhã</span>
              <span>8h-12h</span>
              <span className={styles.timeRate}>{influencer.peakTimes?.morning || '25'}%</span>
            </div>
            <div className={styles.timeSlot}>
              <span className={styles.timeLabel}>Tarde</span>
              <span>12h-18h</span>
              <span className={styles.timeRate}>{influencer.peakTimes?.afternoon || '40'}%</span>
            </div>
            <div className={styles.timeSlot}>
              <span className={styles.timeLabel}>Noite</span>
              <span>18h-23h</span>
              <span className={styles.timeRate}>{influencer.peakTimes?.night || '35'}%</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.actionsContainer}>
            {onEdit && (
              <button className={styles.btnEdit} onClick={handleEdit}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Editar Conta
              </button>
            )}
            
            {onDelete && (
              <button className={styles.btnDelete} onClick={handleDelete}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Excluir Conta
              </button>
            )}
            
            <button className={styles.btnClose} onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDetail;
