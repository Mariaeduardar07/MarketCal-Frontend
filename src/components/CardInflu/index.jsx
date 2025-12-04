import React from 'react';
import { usePostsContext } from '../../context/PostsContext';
import styles from './CardInflu.module.css';

const CardInflu = ({ 
  name, 
  avatar, 
  category, 
  followers, 
  engagement, 
  platform, 
  verified,
  platforms,
  onClick 
}) => {
  const [imgError, setImgError] = React.useState(false);
  const [showCreatePost, setShowCreatePost] = React.useState(false);
  const [postData, setPostData] = React.useState({
    content: '',
    postType: 'feed',
    scheduledDate: '',
    scheduledTime: ''
  });
  
  const { addPost } = usePostsContext();
  const getPlatformIcon = (platformName) => {
    if (!platformName) return null;
    
    switch(platformName.toLowerCase()) {
      case 'instagram':
        return (
          <svg key={platformName} className={styles.platformIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg key={platformName} className={styles.platformIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg key={platformName} className={styles.platformIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg key={platformName} className={styles.platformIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const platformList = platforms || [platform];
  const handleCreatePost = (e) => {
    e.stopPropagation(); 
    setShowCreatePost(true);
  };

  const handleCloseModal = (e) => {
    if (e) e.stopPropagation();
    setShowCreatePost(false);
    setPostData({
      content: '',
      postType: 'feed',
      scheduledDate: '',
      scheduledTime: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newPost = {
      id: Date.now(), 
      content: postData.content,
      platform: platform.toLowerCase(),
      postType: postData.postType,
      scheduledAt: `${postData.scheduledDate}T${postData.scheduledTime}:00Z`,
      status: 'SCHEDULED',
      influencer: name,
      influencerAvatar: avatar,
      createdAt: new Date().toISOString(),
      imageUrl: `https://picsum.photos/400/300?random=${Date.now()}`
    };
    
    // Adicionar ao contexto (aparecerá na página de tasks)
    addPost(newPost);
    
    console.log('Nova postagem criada:', newPost);
    
    // Fechar modal após criar
    handleCloseModal();
    
    // Exibir mensagem de sucesso (opcional)
    alert('Postagem criada com sucesso! Verifique a página de Tasks.');
  };

  return (
    <>
      <div className={styles.card} onClick={onClick}>
        <div className={styles.cardHeader}>
          <div className={styles.avatarContainer}>
            <img 
              src={!imgError && avatar ? avatar : '/image/logo.png'} 
              alt={name} 
              className={styles.avatar}
              onError={() => setImgError(true)}
            />
            {verified && (
              <span className={styles.verifiedBadge}>✓</span>
            )}
          </div>
          <div>
            <h3 className={styles.influencerName}>{name}</h3>
            <p className={styles.category}>{category}</p>
          </div>
        </div>
        
        <div className={styles.cardBody}>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Seguidores</span>
              <span className={styles.statValue}>{followers}</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Engajamento</span>
              <span className={styles.statValue}>{engagement}</span>
            </div>
          </div>
          
          <div className={styles.platformBadge}>
            <span className={styles.platformText}>{platform}</span>
          </div>
          
          <button 
            className={styles.createPostBtn}
            onClick={handleCreatePost}
            title="Criar postagem"
          >
            <svg className={styles.createIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4V6H16C17.1 6 18 6.9 18 8V14L20 16V10C20 8.9 19.1 8 18 8H16V4C16 1.8 14.2 0 12 0S8 1.8 8 4V8H6C4.9 8 4 8.9 4 10V16L6 14V8H8V4C8 2.9 8.9 2 10 2H12ZM12 11C12.6 11 13 11.4 13 12S12.6 13 12 13 11 12.6 11 12 11.4 11 12 11ZM12 15C12.6 15 13 15.4 13 16S12.6 17 12 17 11 16.6 11 16 11.4 15 12 15Z"/>
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
              <path d="M12 7V11H16L12 15L8 11H12V7Z"/>
            </svg>
            Criar Post
          </button>
        </div>
      </div>
      
      {showCreatePost && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Criar Postagem - {name}</h3>
              <button className={styles.closeBtn} onClick={handleCloseModal}>×</button>
            </div>
            
            <form className={styles.modalForm} onSubmit={handleSubmitPost}>
              <div className={styles.formGroup}>
                <label htmlFor="postType">Tipo de Postagem:</label>
                <select
                  id="postType"
                  name="postType"
                  value={postData.postType}
                  onChange={handleInputChange}
                  className={styles.formSelect}
                >
                  <option value="feed">Post no Feed</option>
                  <option value="story">Story</option>
                  <option value="reel">Reel</option>
                  <option value="video">Vídeo</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="content">Conteúdo:</label>
                <textarea
                  id="content"
                  name="content"
                  value={postData.content}
                  onChange={handleInputChange}
                  placeholder="Descreva o conteúdo da postagem..."
                  className={styles.formTextarea}
                  rows={4}
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="scheduledDate">Data:</label>
                  <input
                    type="date"
                    id="scheduledDate"
                    name="scheduledDate"
                    value={postData.scheduledDate}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="scheduledTime">Horário:</label>
                  <input
                    type="time"
                    id="scheduledTime"
                    name="scheduledTime"
                    value={postData.scheduledTime}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Criar Postagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CardInflu;
