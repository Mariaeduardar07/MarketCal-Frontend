"use client";
import { useState } from "react";
import styles from "./SocialAccountsOverview.module.css";

// Ícones das plataformas
const platformIcons = {
  INSTAGRAM: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.platformIcon}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  TIKTOK: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.platformIcon}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
  ),
  TWITTER: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.platformIcon}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  LINKEDIN: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.platformIcon}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  FACEBOOK: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.platformIcon}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  YOUTUBE: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.platformIcon}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
};

// Cores de fundo para avatares
const platformColors = {
  INSTAGRAM: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
  TIKTOK: "#000000",
  TWITTER: "#000000",
  LINKEDIN: "#0077b5",
  FACEBOOK: "#1877f2",
  YOUTUBE: "#ff0000",
};

export default function SocialAccountsOverview({ accounts = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3;
  
  const totalPages = Math.ceil(accounts.length / cardsPerView);
  const canGoNext = currentIndex < totalPages - 1;
  const canGoPrev = currentIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const visibleAccounts = accounts.slice(
    currentIndex * cardsPerView,
    (currentIndex + 1) * cardsPerView
  );

  if (!accounts || accounts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Contas Conectadas</h3>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔗</div>
          <p className={styles.emptyText}>Nenhuma conta conectada</p>
          <button className={styles.connectBtn}>Conectar Conta</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Contas Conectadas</h3>
          <p className={styles.subtitle}>{accounts.length} perfis vinculados</p>
        </div>
        
        {/* Navegação do Carrossel */}
        {totalPages > 1 && (
          <div className={styles.navigation}>
            <button 
              className={`${styles.navBtn} ${!canGoPrev ? styles.navBtnDisabled : ''}`}
              onClick={handlePrev}
              disabled={!canGoPrev}
              aria-label="Anterior"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <span className={styles.pageIndicator}>
              {currentIndex + 1} / {totalPages}
            </span>
            <button 
              className={`${styles.navBtn} ${!canGoNext ? styles.navBtnDisabled : ''}`}
              onClick={handleNext}
              disabled={!canGoNext}
              aria-label="Próximo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Carrossel de Perfis */}
      <div className={styles.carousel}>
        <div className={styles.carouselTrack}>
          {visibleAccounts.map((account, index) => (
            <div 
              key={account.id || index} 
              className={styles.profileCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Avatar com Badge da Plataforma */}
              <div className={styles.avatarWrapper}>
                <div 
                  className={styles.avatar}
                  style={{ 
                    background: account.imageUrl 
                      ? `url(${account.imageUrl}) center/cover` 
                      : platformColors[account.platform] || '#5dd4c0'
                  }}
                >
                  {!account.imageUrl && (
                    <span className={styles.avatarInitial}>
                      {account.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  )}
                </div>
                <div className={styles.platformBadge}>
                  {platformIcons[account.platform] || platformIcons.INSTAGRAM}
                </div>
              </div>

              {/* Info do Perfil */}
              <div className={styles.profileInfo}>
                <h4 className={styles.profileName}>{account.name || "Conta"}</h4>
                <p className={styles.profileHandle}>
                  {account.handle || account.name?.toLowerCase().replace(/\s/g, '') || "usuario"}
                </p>
              </div>

              {/* Ação */}
              <button className={styles.viewBtn}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.viewIcon}>
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Ver Perfil
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores de Página (Dots) */}
      {totalPages > 1 && (
        <div className={styles.dots}>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Página ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}