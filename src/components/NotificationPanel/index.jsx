"use client";

import { useMemo, useState } from "react";
import styles from "./NotificationPanel.module.css";

export default function NotificationPanel({ posts, onClose, viewedNotifications, setViewedNotifications }) {
  const upcomingPosts = useMemo(() => {
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    console.log('🔔 Verificando notificações:', {
      totalPosts: posts.length,
      now: now.toISOString(),
      threeDaysFromNow: threeDaysFromNow.toISOString(),
      posts: posts.map(p => ({
        id: p.id,
        scheduledAt: p.scheduledAt,
        scheduledDate: p.scheduledDate
      }))
    });

    const upcoming = posts.filter(post => {
      // Filtrar posts já visualizados
      if (viewedNotifications.has(post.id)) return false;
      
      const dateToCheck = post.scheduledAt || post.scheduledDate;
      if (!dateToCheck) return false;
      
      const postDate = new Date(dateToCheck);
      const isUpcoming = postDate >= now && postDate <= threeDaysFromNow;
      
      console.log('📅 Verificando post:', {
        id: post.id,
        dateToCheck,
        postDate: postDate.toISOString(),
        isUpcoming
      });
      
      return isUpcoming;
    }).sort((a, b) => {
      const dateA = new Date(a.scheduledAt || a.scheduledDate);
      const dateB = new Date(b.scheduledAt || b.scheduledDate);
      return dateA - dateB;
    });

    console.log('✅ Posts próximos encontrados:', upcoming.length);

    return upcoming;
  }, [posts, viewedNotifications]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Amanhã";
    if (diffDays === 2) return "Em 2 dias";
    if (diffDays === 3) return "Em 3 dias";

    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getPlatformIcon = (platform) => {
    switch(platform?.toLowerCase()) {
      case 'instagram':
        return '📷';
      case 'tiktok':
        return '🎵';
      case 'youtube':
        return '▶️';
      case 'facebook':
        return '👥';
      default:
        return '📱';
    }
  };

  const handleToggleViewed = (postId, event) => {
    event.stopPropagation();
    setViewedNotifications(prev => {
      const newSet = new Set(prev);
      newSet.add(postId);
      return newSet;
    });
  };

  const isViewed = (postId) => viewedNotifications.has(postId);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Notificações</h3>
        <button className={styles.closeButton} onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className={styles.content}>
        {upcomingPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p className={styles.emptyText}>Nenhum post próximo</p>
            <p className={styles.emptySubtext}>Você não tem posts agendados para os próximos 3 dias</p>
          </div>
        ) : (
          <div className={styles.notifications}>
            <p className={styles.subtitle}>
              {upcomingPosts.length} {upcomingPosts.length === 1 ? 'post agendado' : 'posts agendados'} nos próximos 3 dias
            </p>
            {upcomingPosts.map((post, index) => (
              <div 
                key={post.id || index} 
                className={styles.notificationItem}
              >
                <div className={styles.itemIcon}>
                  <span className={styles.platformIcon}>
                    {getPlatformIcon(post.platform)}
                  </span>
                </div>
                <div className={styles.itemContent}>
                  <h4 className={styles.itemTitle}>{post.title || 'Post sem título'}</h4>
                  <p className={styles.itemDescription}>
                    {post.description || post.content || 'Sem descrição'}
                  </p>
                  <div className={styles.itemMeta}>
                    <span className={styles.metaItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {formatDate(post.scheduledAt || post.scheduledDate)} às {formatTime(post.scheduledAt || post.scheduledDate)}
                    </span>
                    {post.platform && (
                      <span className={styles.metaItem}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {post.platform}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <button 
                    className={styles.checkButton}
                    onClick={(e) => handleToggleViewed(post.id, e)}
                    title="Marcar como visualizada"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
