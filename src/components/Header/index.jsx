"use client";

import { useState, useEffect } from "react";
import styles from "./header.module.css";
import { fetchWithAuth } from "@/config/api";
import NotificationPanel from "../NotificationPanel";
import { usePostsContext } from "@/context/PostsContext";

export default function Header() {
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [viewedNotifications, setViewedNotifications] = useState(new Set());
  const { posts } = usePostsContext();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadUserData = async () => {
      try {
        // Pegar nome do usuário do localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          const name = user.name || user.username;
          if (name) {
            setUserName(name);
          }
        }

        // Buscar a imagem do influencer/conta social
        const response = await fetchWithAuth('/social-accounts');
        if (response.ok) {
          const accounts = await response.json();
          console.log('Contas sociais recebidas:', accounts);
          
          if (Array.isArray(accounts) && accounts.length > 0) {
            // Usar a primeira conta ou buscar pelo nome do usuário
            const userStr2 = localStorage.getItem("user");
            const userName = userStr2 ? JSON.parse(userStr2).name : null;
            
            const account = userName 
              ? accounts.find(acc => acc.name?.toLowerCase().includes(userName.toLowerCase()))
              : accounts[0];
            
            console.log('Conta selecionada:', account);
            
            if (account && account.imageUrl) {
              console.log('✅ Imagem encontrada:', account.imageUrl);
              setUserAvatar(account.imageUrl);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadUserData();
  }, []);

  // Calcular notificações de posts próximos (3 dias)
  useEffect(() => {
    const calculateNotifications = () => {
      const now = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(now.getDate() + 3);

      console.log('🔔 Header - Calculando notificações:', {
        totalPosts: posts.length,
        posts: posts,
        now: now.toISOString(),
        threeDaysFromNow: threeDaysFromNow.toISOString()
      });

      const upcomingPosts = posts.filter(post => {
        // Filtrar posts visualizados
        if (viewedNotifications.has(post.id)) return false;
        
        const dateToCheck = post.scheduledAt || post.scheduledDate;
        if (!dateToCheck) {
          console.log('❌ Post sem data:', post);
          return false;
        }
        
        const postDate = new Date(dateToCheck);
        const isUpcoming = postDate >= now && postDate <= threeDaysFromNow;
        
        console.log('📅 Header - Verificando post:', {
          id: post.id,
          dateToCheck,
          postDate: postDate.toISOString(),
          now: now.toISOString(),
          threeDaysFromNow: threeDaysFromNow.toISOString(),
          isUpcoming
        });
        
        return isUpcoming;
      });

      console.log('✅ Header - Posts próximos:', upcomingPosts.length, upcomingPosts);

      setNotificationCount(upcomingPosts.length);
    };

    calculateNotifications();
  }, [posts, viewedNotifications]);

  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        {userAvatar && (
          <img 
            src={userAvatar} 
            alt={userName || 'User'} 
            className={styles.userAvatar}
          />
        )}
        <h2 className={styles.title}>{userName ? `Olá, ${userName}` : "Olá"}</h2>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.notificationWrapper}>
          <button 
            className={styles.iconButton}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notificationCount > 0 && (
              <span className={styles.notificationBadge}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <>
              <div 
                className={styles.overlay} 
                onClick={() => setShowNotifications(false)}
              />
              <NotificationPanel 
                posts={posts}
                onClose={() => setShowNotifications(false)}
                viewedNotifications={viewedNotifications}
                setViewedNotifications={setViewedNotifications}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
