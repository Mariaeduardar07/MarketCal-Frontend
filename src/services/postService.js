import { API_URL, fetchWithAuth } from '../config/api';

/**
 * Buscar todos os posts do usuário
 */
export async function fetchPosts() {
  try {
    const response = await fetchWithAuth('/posts');
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar posts: ${response.status}`);
    }
    
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Erro ao fetch posts:', error);
    return [];
  }
}

/**
 * Criar um novo post
 */
export async function createPost(postData) {
  try {
    const response = await fetchWithAuth('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar post');
    }
    
    const newPost = await response.json();
    return newPost;
  } catch (error) {
    console.error('Erro ao criar post:', error);
    throw error;
  }
}

/**
 * Buscar post por ID
 */
export async function fetchPostById(id) {
  try {
    const response = await fetchWithAuth(`/posts/${id}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar post: ${response.status}`);
    }
    
    const post = await response.json();
    return post;
  } catch (error) {
    console.error('Erro ao fetch post:', error);
    return null;
  }
}

/**
 * Atualizar um post
 */
export async function updatePost(id, updates) {
  try {
    const response = await fetchWithAuth(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar post');
    }
    
    const updatedPost = await response.json();
    return updatedPost;
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    throw error;
  }
}

/**
 * Deletar um post
 */
export async function deletePost(id) {
  try {
    const response = await fetchWithAuth(`/posts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao deletar post');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    throw error;
  }
}

/**
 * Agrupar posts por plataforma (para exibição no componente)
 * Como a API não retorna plataforma diretamente, você pode:
 * 1. Adicionar plataforma ao modelo Post no backend
 * 2. Ou usar contas sociais associadas (socialAccounts)
 */
export function groupPostsByPlatform(posts) {
  const grouped = {
    instagram: [],
    twitter: [],
    linkedin: []
  };

  posts.forEach(post => {
    // Se o post tiver socialAccounts com plataforma:
    if (post.socialAccounts && post.socialAccounts.length > 0) {
      post.socialAccounts.forEach(account => {
        const platform = account.platform.toLowerCase();
        if (grouped[platform]) {
          grouped[platform].push({
            ...post,
            platform: account.platform
          });
        }
      });
    }
  });

  return grouped;
}
