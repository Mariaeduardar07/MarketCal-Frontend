'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Adicionar novo post à lista (no TOPO)
  const addPost = useCallback((newPost) => {
    setPosts(prev => [newPost, ...prev]);
    // Trigger para atualizar componentes que dependem de refresh
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Atualizar toda a lista de posts
  const updatePosts = useCallback((newPosts) => {
    setPosts(newPosts);
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Remover post
  const removePost = useCallback((postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);

  // Limpar posts
  const clearPosts = useCallback(() => {
    setPosts([]);
  }, []);

  return (
    <PostsContext.Provider 
      value={{ 
        posts, 
        addPost, 
        updatePosts, 
        removePost, 
        clearPosts,
        refreshTrigger 
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePostsContext() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePostsContext deve ser usado dentro de PostsProvider');
  }
  return context;
}
