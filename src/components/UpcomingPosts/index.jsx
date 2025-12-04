import styles from "./UpcomingPosts.module.css";
import { usePostsContext } from "@/context/PostsContext";
import { useEffect, useState } from "react";
import { deletePost, updatePost } from "@/services/postService";
import { Edit2, Trash2 } from "lucide-react";

export default function UpcomingPosts({ posts: initialPosts }) {
  const { posts: contextPosts, refreshTrigger, removePost, updatePosts } = usePostsContext();
  const [displayPosts, setDisplayPosts] = useState(initialPosts || []);
  const [editingPost, setEditingPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [loadingPostId, setLoadingPostId] = useState(null);

  // Sincronizar com posts do context sempre que mudar
  useEffect(() => {
    if (contextPosts && contextPosts.length > 0) {
      // Ordena com posts mais recentes no topo
      const sorted = [...contextPosts].sort((a, b) => b.id - a.id);
      setDisplayPosts(sorted);
    } else if (initialPosts && initialPosts.length > 0) {
      // Se não tiver context posts, usa os iniciais ordenados
      const sorted = [...initialPosts].sort((a, b) => b.id - a.id);
      setDisplayPosts(sorted);
    }
  }, [contextPosts, refreshTrigger, initialPosts]);

  const getStatusBadgeColor = (status) => {
    const colors = {
      SCHEDULED: "#f093fb",
      PUBLISHED: "#4facfe",
      DRAFT: "#fdbb2d",
    };
    return colors[status] || "#718096";
  };

  const getStatusBadgeBg = (status) => {
    const colors = {
      SCHEDULED: "rgba(240, 147, 251, 0.1)",
      PUBLISHED: "rgba(79, 172, 254, 0.1)",
      DRAFT: "rgba(253, 187, 45, 0.1)",
    };
    return colors[status] || "rgba(113, 128, 150, 0.1)";
  };

  // Função para deletar post
  const handleDeletePost = async (postId) => {
    if (!confirm("Tem certeza que deseja deletar este post?")) return;
    
    try {
      setLoadingPostId(postId);
      await deletePost(postId);
      
      // Remover do context
      removePost(postId);
      
      // Atualizar display
      setDisplayPosts(prev => prev.filter(p => p.id !== postId));
      
      alert("✅ Post deletado com sucesso!");
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert(`❌ Erro ao deletar post: ${error.message}`);
    } finally {
      setLoadingPostId(null);
    }
  };

  // Função para abrir modal de edição
  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditFormData({
      content: post.content,
      imageUrl: post.imageUrl || '',
      scheduledAt: post.scheduledAt,
      status: post.status
    });
    setShowEditModal(true);
  };

  // Função para salvar edição
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    if (!editFormData.content.trim()) {
      alert('Por favor, preencha o conteúdo do post.');
      return;
    }

    try {
      setLoadingPostId(editingPost.id);
      const updatedPost = await updatePost(editingPost.id, editFormData);
      
      // Atualizar no display
      setDisplayPosts(prev => 
        prev.map(p => p.id === editingPost.id ? updatedPost : p)
      );

      // Atualizar no context
      const newPosts = displayPosts.map(p => 
        p.id === editingPost.id ? updatedPost : p
      );
      updatePosts(newPosts);
      
      alert("✅ Post atualizado com sucesso!");
      setShowEditModal(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert(`❌ Erro ao atualizar post: ${error.message}`);
    } finally {
      setLoadingPostId(null);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>⏱️ Próximas Postagens</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Conteúdo</th>
              <th>Plataforma</th>
              <th>Data Agendada</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {displayPosts.length > 0 ? (
              displayPosts.map((post) => (
                <tr key={post.id} className={styles.tableRow}>
                  <td className={styles.content}>{post.content}</td>
                  <td>{post.platform || 'Não especificado'}</td>
                  <td>{new Date(post.scheduledAt).toLocaleString("pt-BR")}</td>
                  <td>
                    <span
                      className={styles.badge}
                      style={{
                        backgroundColor: getStatusBadgeBg(post.status),
                        color: getStatusBadgeColor(post.status),
                      }}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEditPost(post)}
                        disabled={loadingPostId === post.id}
                        title="Editar post"
                      >
                        <Edit2 size={16} strokeWidth={2} />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeletePost(post.id)}
                        disabled={loadingPostId === post.id}
                        title="Deletar post"
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.emptyMessage}>
                  Nenhuma postagem agendada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Edição */}
      {showEditModal && editingPost && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Editar Post</h2>
              <button 
                className={styles.closeBtn} 
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className={styles.editForm}>
              <div className={styles.formGroup}>
                <label>Conteúdo*</label>
                <textarea
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>URL da Imagem</label>
                <input
                  type="url"
                  value={editFormData.imageUrl}
                  onChange={(e) => setEditFormData({...editFormData, imageUrl: e.target.value})}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Data Agendada*</label>
                <input
                  type="date"
                  value={editFormData.scheduledAt}
                  onChange={(e) => setEditFormData({...editFormData, scheduledAt: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                >
                  <option value="SCHEDULED">Agendado</option>
                  <option value="DRAFT">Rascunho</option>
                  <option value="PUBLISHED">Publicado</option>
                </select>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loadingPostId === editingPost.id}
                >
                  {loadingPostId === editingPost.id ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}