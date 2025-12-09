'use client';

import React, { useState, useEffect } from 'react';
import styles from './pageExplore.module.css';
import CardInflu from '@/components/CardInflu';
import Header from '@/components/Header';
import SideHeader from '@/components/sideHeader';
import InfluencerDetail from '@/components/InfluencerDetail';
import Modal from '@/components/Modal';
import InfluencerForm from '@/components/InfluencerForm';
import ConfirmModal from '@/components/ConfirmModal';
import Toast from '@/components/Toast';
import { 
  getAllSocialAccounts, 
  createSocialAccount, 
  updateSocialAccount, 
  deleteSocialAccount 
} from '@/services/socialAccountService';

export default function PageExplore() {
  const [filter, setFilter] = useState('all');
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para modais e toasts
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: null });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      const data = await getAllSocialAccounts();
      
      console.log('📊 Total de contas recebidas da API:', data?.length || 0);
      console.log('📋 Dados brutos da API:', data);
      
      // Mapear os dados das contas sociais para o formato esperado
      const mappedData = Array.isArray(data) ? data.map(account => ({
        id: account.id || account._id,
        name: account.name || account.username || 'Sem nome',
        avatar: account.avatar || account.imageUrl || account.profileImage || account.image || '/image/logo.png',
        category: account.category || account.niche || 'Influencer',
        followers: account.followers || account.followersCount || '0',
        engagement: account.engagement || account.engagementRate || '0%',
        platform: account.platform || account.mainPlatform || 'Instagram',
        platforms: account.platforms || [account.platform || 'Instagram'],
        verified: account.verified || false,
        location: account.location || 'Brasil',
        handle: account.handle,
        ...account
      })) : [];
      
      console.log('✅ Contas mapeadas:', mappedData.length);
      console.log('📝 Dados mapeados:', mappedData);
      
      setInfluencers(mappedData);
      setError(null);
    } catch (err) {
      console.error('❌ Erro ao carregar contas sociais:', err);
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, []);

  // Handlers para CRUD
  const handleEditInfluencer = (influencer) => {
    setEditingInfluencer(influencer);
    setIsModalOpen(true);
    setSelectedInfluencer(null); // Fechar modal de detalhes se estiver aberto
  };

  const handleDeleteInfluencer = async (influencerId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir conta social?',
      message: 'Esta ação não poderá ser desfeita. Tem certeza que deseja excluir esta conta?',
      type: 'danger',
      confirmText: 'Sim, excluir',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await deleteSocialAccount(influencerId);
          
          // Atualizar lista removendo o influenciador
          setInfluencers(prev => prev.filter(inf => inf.id !== influencerId));
          
          // Fechar modal de detalhes se estiver aberto
          if (selectedInfluencer?.id === influencerId) {
            setSelectedInfluencer(null);
          }
          
          setConfirmModal({ isOpen: false, onConfirm: null });
          showToast('Influenciador excluído com sucesso!', 'success');
        } catch (err) {
          console.error('Erro ao excluir influenciador:', err);
          setConfirmModal({ isOpen: false, onConfirm: null });
          showToast('Erro ao excluir influenciador: ' + err.message, 'error');
        }
      }
    });
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // Obter userId do localStorage
      const userDataString = localStorage.getItem('user');
      const userData = userDataString ? JSON.parse(userDataString) : null;
      const userId = userData?.id;

      if (!userId) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      if (editingInfluencer) {
        // Atualizar influenciador existente
        console.log('📤 Enviando atualização:', formData);
        
        try {
          const updated = await updateSocialAccount(editingInfluencer.id, formData);
          console.log('✅ Resposta do servidor:', updated);
          
          // Atualizar o influenciador no estado
          const mappedInfluencer = {
            id: updated.id || updated._id,
            name: updated.name || updated.username || 'Sem nome',
            avatar: updated.avatar || updated.imageUrl || updated.profileImage || editingInfluencer.avatar,
            category: updated.category || updated.niche || editingInfluencer.category,
            followers: updated.followers || updated.followersCount || editingInfluencer.followers,
            engagement: updated.engagement || updated.engagementRate || editingInfluencer.engagement,
            platform: updated.platform || updated.mainPlatform || editingInfluencer.platform,
            platforms: updated.platforms || [updated.platform || editingInfluencer.platform],
            verified: updated.verified ?? editingInfluencer.verified,
            location: updated.location || editingInfluencer.location,
            handle: updated.handle || editingInfluencer.handle,
            ...updated
          };
          
          setInfluencers(prev => prev.map(inf => 
            inf.id === editingInfluencer.id ? mappedInfluencer : inf
          ));
          
          showToast('Influenciador atualizado com sucesso!', 'success');
        } catch (updateError) {
          // Se erro 500 e tem avatar, tentar sem avatar
          if (updateError.message.includes('500') && formData.avatar) {
            console.warn('⚠️ Erro ao atualizar com avatar, tentando sem avatar...');
            const { avatar, ...dataWithoutAvatar } = formData;
            
            const updated = await updateSocialAccount(editingInfluencer.id, dataWithoutAvatar);
            console.log('✅ Atualizado sem avatar:', updated);
            
            // Atualizar o influenciador no estado
            const mappedInfluencer = {
              id: updated.id || updated._id,
              name: updated.name || updated.username || 'Sem nome',
              avatar: editingInfluencer.avatar, // Manter avatar antigo
              category: updated.category || updated.niche || editingInfluencer.category,
              followers: updated.followers || updated.followersCount || editingInfluencer.followers,
              engagement: updated.engagement || updated.engagementRate || editingInfluencer.engagement,
              platform: updated.platform || updated.mainPlatform || editingInfluencer.platform,
              platforms: updated.platforms || [updated.platform || editingInfluencer.platform],
              verified: updated.verified ?? editingInfluencer.verified,
              location: updated.location || editingInfluencer.location,
              handle: updated.handle || editingInfluencer.handle,
              ...updated
            };
            
            setInfluencers(prev => prev.map(inf => 
              inf.id === editingInfluencer.id ? mappedInfluencer : inf
            ));
            
            showToast('Influenciador atualizado com sucesso!\n(Nota: O backend não permite atualizar avatar no momento)', 'success');
          } else {
            throw updateError;
          }
        }
      } else {
        // Criar novo influenciador
        console.log('📤 Criando novo influenciador:', formData);
        
        try {
          const newInfluencer = await createSocialAccount({
            ...formData,
            userId
          });
          console.log('✅ Influenciador criado:', newInfluencer);
          
          // Adicionar o novo influenciador imediatamente ao estado
          const mappedInfluencer = {
            id: newInfluencer.id || newInfluencer._id,
            name: newInfluencer.name || newInfluencer.username || 'Sem nome',
            avatar: newInfluencer.avatar || newInfluencer.imageUrl || newInfluencer.profileImage || '/image/logo.png',
            category: newInfluencer.category || newInfluencer.niche || 'Influencer',
            followers: newInfluencer.followers || newInfluencer.followersCount || '0',
            engagement: newInfluencer.engagement || newInfluencer.engagementRate || '0%',
            platform: newInfluencer.platform || newInfluencer.mainPlatform || 'Instagram',
            platforms: newInfluencer.platforms || [newInfluencer.platform || 'Instagram'],
            verified: newInfluencer.verified || false,
            location: newInfluencer.location || 'Brasil',
            handle: newInfluencer.handle,
            ...newInfluencer
          };
          
          // Adicionar ao início da lista para aparecer como "recente"
          setInfluencers(prev => [mappedInfluencer, ...prev]);
          
          showToast('Influenciador cadastrado com sucesso!', 'success');
        } catch (createError) {
          // Se o erro for relacionado ao avatar, tentar sem avatar
          if (formData.avatar && createError.message.includes('400')) {
            console.warn('⚠️ Tentando criar sem avatar...');
            const { avatar, ...dataWithoutAvatar } = formData;
            
            const newInfluencer = await createSocialAccount({
              ...dataWithoutAvatar,
              userId
            });
            console.log('✅ Influenciador criado sem avatar:', newInfluencer);
            
            // Adicionar o novo influenciador ao estado
            const mappedInfluencer = {
              id: newInfluencer.id || newInfluencer._id,
              name: newInfluencer.name || newInfluencer.username || 'Sem nome',
              avatar: newInfluencer.avatar || newInfluencer.imageUrl || newInfluencer.profileImage || '/image/logo.png',
              category: newInfluencer.category || newInfluencer.niche || 'Influencer',
              followers: newInfluencer.followers || newInfluencer.followersCount || '0',
              engagement: newInfluencer.engagement || newInfluencer.engagementRate || '0%',
              platform: newInfluencer.platform || newInfluencer.mainPlatform || 'Instagram',
              platforms: newInfluencer.platforms || [newInfluencer.platform || 'Instagram'],
              verified: newInfluencer.verified || false,
              location: newInfluencer.location || 'Brasil',
              handle: newInfluencer.handle,
              ...newInfluencer
            };
            
            setInfluencers(prev => [mappedInfluencer, ...prev]);
            
            showToast('Influenciador cadastrado com sucesso!\n(Nota: O backend não aceita avatar no momento)', 'success');
          } else {
            throw createError;
          }
        }
      }
      
      setIsModalOpen(false);
      setEditingInfluencer(null);
    } catch (err) {
      console.error('❌ Erro ao salvar influenciador:', err);
      showToast('Erro ao salvar influenciador: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingInfluencer(null);
  };

  const handleCloseDetailModal = () => {
    setSelectedInfluencer(null);
  };

  // Separar influencers recentes (últimos 5) e todos os outros
  const recentInfluencers = influencers.slice(0, 5);
  const allInfluencers = influencers.slice(5);

  const handleCardClick = (influencer) => {
    setSelectedInfluencer(influencer);
  };

  return (
    <div className={styles.pageWrapper}>
      <SideHeader />
      
      <div className={styles.mainContent}>
        <Header />
        
        <div className={styles.pageContainer}>
          <div className={styles.contentWrapper}>
            
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Carregando influenciadores...</p>
              </div>
            ) : error ? (
              <div className={styles.errorContainer}>
                <p>❌ Erro: {error}</p>
                <button onClick={fetchInfluencers} className={styles.retryButton}>
                  Tentar novamente
                </button>
              </div>
            ) : (
              <>
                {/* Seção de Influenciadores Recentes */}
                {recentInfluencers.length > 0 && (
                  <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Contas Recentes</h2>
                      <span className={styles.badge}>{recentInfluencers.length}</span>
                    </div>
                    
                    <div className={styles.cardsGrid}>
                      {recentInfluencers.map((influencer) => (
                        <CardInflu
                          key={influencer.id}
                          influencer={influencer}
                          name={influencer.name}
                          avatar={influencer.avatar}
                          category={influencer.category}
                          followers={influencer.followers}
                          engagement={influencer.engagement}
                          platform={influencer.platform}
                          platforms={influencer.platforms}
                          verified={influencer.verified}
                          onClick={() => handleCardClick(influencer)}
                          onEdit={() => handleEditInfluencer(influencer)}
                          onDelete={() => handleDeleteInfluencer(influencer.id)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Seção de Todos os Influenciadores */}
                {allInfluencers.length > 0 && (
                  <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Todas as Contas</h2>
                      <span className={styles.badge}>{allInfluencers.length}</span>
                    </div>
                    
                    <div className={styles.cardsGrid}>
                      {allInfluencers.map((influencer) => (
                        <CardInflu
                          key={influencer.id}
                          influencer={influencer}
                          name={influencer.name}
                          avatar={influencer.avatar}
                          category={influencer.category}
                          followers={influencer.followers}
                          engagement={influencer.engagement}
                          platform={influencer.platform}
                          platforms={influencer.platforms}
                          verified={influencer.verified}
                          onClick={() => handleCardClick(influencer)}
                          onEdit={() => handleEditInfluencer(influencer)}
                          onDelete={() => handleDeleteInfluencer(influencer.id)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {influencers.length === 0 && (
                  <div className={styles.emptyContainer}>
                    <div className={styles.emptyIcon}>📋</div>
                    <p className={styles.emptyText}>Nenhuma conta social cadastrada</p>
                    <p className={styles.emptySubtext}>As contas sociais cadastradas aparecerão aqui</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Formulário */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingInfluencer ? 'Editar Conta Social' : 'Nova Conta Social'}
      >
        <InfluencerForm
          initialData={editingInfluencer}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal de Detalhes */}
      {selectedInfluencer && (
        <InfluencerDetail 
          influencer={selectedInfluencer} 
          onClose={handleCloseDetailModal}
          onEdit={() => handleEditInfluencer(selectedInfluencer)}
          onDelete={() => handleDeleteInfluencer(selectedInfluencer.id)}
        />
      )}

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, onConfirm: null })}
      />

      {/* Toast de Notificação */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
}
