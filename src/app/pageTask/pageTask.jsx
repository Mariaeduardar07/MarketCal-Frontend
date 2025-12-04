'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SideHeader from '../../components/sideHeader';
import ProgressCard from '../../components/ProgressCard';
import { fetchPosts, createPost, deletePost, updatePost } from '../../services/postService';
import { usePostsContext } from '../../context/PostsContext';
import styles from './pageTask.module.css';

const PageTask = () => {
  const [tasks, setTasks] = useState({ instagram: [], twitter: [], linkedin: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const { addPost, updatePosts, removePost, posts: contextPosts } = usePostsContext();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const postsData = await fetchPosts();
        
        // Combinar posts da API com posts do contexto
        const allPosts = [...(contextPosts || []), ...(postsData || [])];
        
        // Se não tiver posts ainda, retorna estrutura vazia
        if (allPosts.length === 0) {
          setTasks({ instagram: [], twitter: [], linkedin: [] });
          return;
        }

        // Agrupar por plataforma
        const tasksData = {
          instagram: [],
          twitter: [], 
          linkedin: []
        };

        allPosts.forEach(post => {
          const platform = (post.platform || 'instagram').toLowerCase();
          const taskItem = {
            id: post.id,
            image: post.imageUrl || `https://picsum.photos/400/300?random=${post.id}`,
            title: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
            category: post.status || 'SCHEDULED',
            progress: (post.status === 'PUBLISHED' || post.status === 'published') ? 100 : 50,
            timeLeft: post.scheduledAt,
            daysLeft: calculateDaysLeft(post.scheduledAt),
            teamMembers: [],
            platform: platform,
            postId: post.id,
            originalPost: post,
            influencer: post.influencer,
            influencerAvatar: post.influencerAvatar
          };

          if (platform === 'instagram') {
            tasksData.instagram.push(taskItem);
          } else if (platform === 'twitter') {
            tasksData.twitter.push(taskItem);
          } else if (platform === 'linkedin') {
            tasksData.linkedin.push(taskItem);
          } else {
            // Plataforma desconhecida vai para instagram por padrão
            tasksData.instagram.push(taskItem);
          }
        });

        setTasks(tasksData);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
        setTasks({ instagram: [], twitter: [], linkedin: [] });
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [contextPosts]); // Recarregar quando contextPosts mudar

  const scrollCards = (direction, section) => {
    const container = document.getElementById(`cards-${section}`);
    if (container) {
      const scrollAmount = 300; // pixels para scroll
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Função auxiliar para calcular dias restantes
  const calculateDaysLeft = (scheduledAt) => {
    if (!scheduledAt) return '0 dias';
    const scheduled = new Date(scheduledAt);
    const today = new Date();
    const diffTime = Math.abs(scheduled - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} dias`;
  };

  const handleCreateNewPost = (platform) => {
    setSelectedPlatform(platform);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlatform('');
  };

  const handleSubmitPost = async (postData) => {
    try {
      setLoading(true);
      // Chamar a API para criar o post
      const newPost = await createPost(postData);
      
      // Adicionar o novo post à lista de tasks
      const newTaskItem = {
        id: newPost.id,
        image: newPost.imageUrl || 'https://picsum.photos/400/300?random=' + newPost.id,
        title: newPost.content.substring(0, 50) + (newPost.content.length > 50 ? '...' : ''),
        category: newPost.status,
        progress: newPost.status === 'PUBLISHED' ? 100 : 0,
        timeLeft: newPost.scheduledAt,
        daysLeft: calculateDaysLeft(newPost.scheduledAt),
        teamMembers: [],
        platform: selectedPlatform,
        postId: newPost.id,
        originalPost: newPost
      };

      // Adicionar ao estado local
      setTasks(prev => ({
        ...prev,
        [selectedPlatform]: [...prev[selectedPlatform], newTaskItem]
      }));

      // 🔥 SINCRONIZAR COM O CONTEXT GLOBAL para atualizar dashboard
      addPost(newPost);
      updatePosts([newPost, ...(getPosts() || [])]);

      alert(`✅ Post criado com sucesso para ${selectedPlatform}!`);
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao criar post:', error);
      alert(`❌ Erro ao criar post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para pegar posts do context (exemplo)
  const getPosts = () => {
    // Aqui você pode adicionar lógica se necessário
    return [];
  };

  // Função para editar post
  const handleEditPost = (postId) => {
    // Encontrar o post em qualquer plataforma
    let post = null;
    for (const platform in tasks) {
      const found = tasks[platform].find(t => t.postId === postId);
      if (found) {
        post = found;
        break;
      }
    }
    
    if (post) {
      setEditingPost(post);
      setShowEditModal(true);
    }
  };

  // Função para salvar edição
  const handleSaveEdit = async (updatedData) => {
    try {
      setLoading(true);
      const result = await updatePost(editingPost.postId, updatedData);
      
      // Atualizar no estado local
      setTasks(prev => {
        const newTasks = { ...prev };
        for (const platform in newTasks) {
          newTasks[platform] = newTasks[platform].map(t => 
            t.postId === editingPost.postId 
              ? {
                  ...t,
                  title: result.content.substring(0, 50) + (result.content.length > 50 ? '...' : ''),
                  category: result.status,
                  progress: result.status === 'PUBLISHED' ? 100 : 0,
                  originalPost: result
                }
              : t
          );
        }
        return newTasks;
      });

      // Atualizar no context
      updatePosts([result, ...getPosts()]);
      
      alert('✅ Post atualizado com sucesso!');
      setShowEditModal(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert(`❌ Erro ao atualizar post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar post
  const handleDeletePost = async (postId) => {
    if (!confirm('Tem certeza que deseja deletar este post?')) return;
    
    try {
      setLoading(true);
      await deletePost(postId);
      
      // Remover do estado local
      setTasks(prev => {
        const newTasks = { ...prev };
        for (const platform in newTasks) {
          newTasks[platform] = newTasks[platform].filter(t => t.postId !== postId);
        }
        return newTasks;
      });

      // Remover do context
      removePost(postId);
      
      alert('✅ Post deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert(`❌ Erro ao deletar post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <SideHeader />
        <div className={styles.container}>
          <div className={styles.loading}>Carregando tarefas...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <SideHeader />
      <div className={styles.container}>
        {/* Seção Instagram */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Instagram</h2>
            <div className={styles.sectionControls}>
              <button 
                className={styles.createButton}
                onClick={() => handleCreateNewPost('instagram')}
              >
                + Novo Post
              </button>
              <div className={styles.sectionNavigation}>
                <button 
                  className={styles.navButton}
                  onClick={() => scrollCards('left', 'instagram')}
                >
                  <span>❮</span>
                </button>
                <button 
                  className={styles.navButton}
                  onClick={() => scrollCards('right', 'instagram')}
                >
                  <span>❯</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className={styles.cardsGrid} id="cards-instagram">
            {tasks.instagram.map((task) => (
              <ProgressCard
                key={task.id}
                image={task.image}
                title={task.title}
                category={task.category}
                progress={task.progress}
                timeLeft={task.timeLeft}
                daysLeft={task.daysLeft}
                teamMembers={task.teamMembers}
                platform="instagram"
                postId={task.postId}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        </section>

        {/* Seção Twitter */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Twitter</h2>
            <div className={styles.sectionControls}>
              <button 
                className={styles.createButton}
                onClick={() => handleCreateNewPost('twitter')}
              >
                + Novo Post
              </button>
              <div className={styles.sectionNavigation}>
                <button 
                  className={styles.navButton}
                  onClick={() => scrollCards('left', 'twitter')}
                >
                  <span>❮</span>
                </button>
                <button 
                  className={styles.navButton}
                  onClick={() => scrollCards('right', 'twitter')}
                >
                  <span>❯</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className={styles.cardsGrid} id="cards-twitter">
            {tasks.twitter.map((task) => (
              <ProgressCard
                key={task.id}
                image={task.image}
                title={task.title}
                category={task.category}
                progress={task.progress}
                timeLeft={task.timeLeft}
                daysLeft={task.daysLeft}
                teamMembers={task.teamMembers}
                platform="twitter"
                postId={task.postId}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        </section>

        {/* Seção LinkedIn */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>LinkedIn</h2>
            <div className={styles.sectionControls}>
              <button 
                className={styles.createButton}
                onClick={() => handleCreateNewPost('linkedin')}
              >
                + Novo Post
              </button>
              <div className={styles.sectionNavigation}>
                <button 
                  className={styles.navButton}
                  onClick={() => scrollCards('left', 'linkedin')}
                >
                  <span>❮</span>
                </button>
                <button 
                  className={styles.navButton}
                  onClick={() => scrollCards('right', 'linkedin')}
                >
                  <span>❯</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className={styles.cardsGrid} id="cards-linkedin">
            {tasks.linkedin.map((task) => (
              <ProgressCard
                key={task.id}
                image={task.image}
                title={task.title}
                category={task.category}
                progress={task.progress}
                timeLeft={task.timeLeft}
                daysLeft={task.daysLeft}
                teamMembers={task.teamMembers}
                platform="linkedin"
                postId={task.postId}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Modal para criar novo post */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Criar Novo Post - {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                ✕
              </button>
            </div>
            <CreatePostForm 
              platform={selectedPlatform} 
              onSubmit={handleSubmitPost}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}

      {/* Modal para editar post */}
      {showEditModal && editingPost && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Editar Post</h2>
              <button className={styles.closeButton} onClick={() => setShowEditModal(false)}>
                ✕
              </button>
            </div>
            <EditPostForm 
              post={editingPost}
              onSubmit={handleSaveEdit}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

// Componente do formulário de edição de post
const EditPostForm = ({ post, onSubmit, onCancel }) => {
  const [postData, setPostData] = useState({
    content: post.originalPost?.content || post.title,
    imageUrl: post.originalPost?.imageUrl || '',
    scheduledAt: post.originalPost?.scheduledAt || '',
    status: post.originalPost?.status || 'SCHEDULED'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postData.content.trim()) {
      alert('Por favor, preencha o conteúdo do post.');
      return;
    }
    
    onSubmit(postData);
  };

  return (
    <form className={styles.postForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="content">Conteúdo do Post*</label>
        <textarea
          id="content"
          name="content"
          value={postData.content}
          onChange={handleInputChange}
          placeholder="Escreva o conteúdo do seu post..."
          rows={5}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="imageUrl">URL da Imagem</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={postData.imageUrl}
          onChange={handleInputChange}
          placeholder="https://exemplo.com/imagem.jpg (opcional)"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="scheduledAt">Data de Agendamento*</label>
        <input
          type="date"
          id="scheduledAt"
          name="scheduledAt"
          value={postData.scheduledAt}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={postData.status}
          onChange={handleInputChange}
        >
          <option value="SCHEDULED">Agendado</option>
          <option value="DRAFT">Rascunho</option>
          <option value="PUBLISHED">Publicado</option>
        </select>
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className={styles.submitButton}>
          Salvar Alterações
        </button>
      </div>
    </form>
  );
};

// Componente do formulário de criação de post
const CreatePostForm = ({ platform, onSubmit, onCancel }) => {
  const [postData, setPostData] = useState({
    content: '',
    imageUrl: '',
    scheduledAt: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postData.content.trim()) {
      alert('Por favor, preencha o conteúdo do post.');
      return;
    }
    
    // Pegar o userId do usuário logado (pode vir do localStorage, context, etc)
    const userId = localStorage.getItem('userId') || 1; // fallback para 1 se não tiver
    
    const postPayload = {
      content: postData.content,
      imageUrl: postData.imageUrl || 'https://picsum.photos/1080/1080',
      scheduledAt: postData.scheduledAt,
      userId: parseInt(userId)
    };
    
    onSubmit(postPayload);
  };

  return (
    <form className={styles.postForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="content">Conteúdo do Post*</label>
        <textarea
          id="content"
          name="content"
          value={postData.content}
          onChange={handleInputChange}
          placeholder="Escreva o conteúdo do seu post... Ex: Novo produto lançado! 🚀"
          rows={5}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="imageUrl">URL da Imagem</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={postData.imageUrl}
          onChange={handleInputChange}
          placeholder="https://exemplo.com/imagem.jpg (opcional)"
        />
        <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          Deixe em branco para usar uma imagem padrão
        </small>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="scheduledAt">Data de Agendamento*</label>
        <input
          type="date"
          id="scheduledAt"
          name="scheduledAt"
          value={postData.scheduledAt}
          onChange={handleInputChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className={styles.submitButton}>
          Criar Post
        </button>
      </div>
    </form>
  );
};

export default PageTask;
