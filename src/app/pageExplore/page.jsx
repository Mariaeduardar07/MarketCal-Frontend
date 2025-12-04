'use client';

import React, { useState, useEffect } from 'react';
import styles from './pageExplore.module.css';
import CardInflu from '@/components/CardInflu';
import Header from '@/components/Header';
import SideHeader from '@/components/sideHeader';
import InfluencerDetail from '@/components/InfluencerDetail';
import { fetchWithAuth } from '@/config/api';

export default function PageExplore() {
  const [filter, setFilter] = useState('all');
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setLoading(true);
        const response = await fetchWithAuth('/social-accounts');
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('🔍 Dados recebidos da API /social-accounts:', data);
        
        // Mapear os dados das contas sociais para o formato esperado
        const mappedData = Array.isArray(data) ? data.map(account => ({
          id: account.id || account._id,
          name: account.name || account.username || 'Sem nome',
          avatar: account.imageUrl || account.avatar || account.profileImage || account.image || '/image/logo.png',
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
        
        console.log('✅ Dados mapeados com avatares:', mappedData.map(u => ({ name: u.name, avatar: u.avatar })));
        setInfluencers(mappedData);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar contas sociais:', err);
        setError(err.message || 'Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  // Separar influencers recentes (últimos 5) e todos os outros
  const recentInfluencers = influencers.slice(0, 5);
  const allInfluencers = influencers.slice(5);

  const handleCardClick = (influencer) => {
    setSelectedInfluencer(influencer);
  };

  const handleCloseModal = () => {
    setSelectedInfluencer(null);
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
                <p>Carregando influenciadores...</p>
              </div>
            ) : error ? (
              <div className={styles.errorContainer}>
                <p>Erro: {error}</p>
              </div>
            ) : (
              <>
                {/* Seção de Influenciadores Recentes */}
                {recentInfluencers.length > 0 && (
                  <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Recent Influencers</h2>
                      <span className={styles.badge}>{recentInfluencers.length}</span>
                    </div>
                    
                    <div className={styles.cardsGrid}>
                      {recentInfluencers.map((influencer) => (
                        <CardInflu
                          key={influencer.id}
                          name={influencer.name}
                          avatar={influencer.avatar}
                          category={influencer.category}
                          followers={influencer.followers}
                          engagement={influencer.engagement}
                          platform={influencer.platform}
                          platforms={influencer.platforms}
                          verified={influencer.verified}
                          onClick={() => handleCardClick(influencer)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Seção de Todos os Influenciadores */}
                {allInfluencers.length > 0 && (
                  <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Influencers</h2>
                      <span className={styles.badge}>{allInfluencers.length}</span>
                    </div>
                    
                    <div className={styles.cardsGrid}>
                      {allInfluencers.map((influencer) => (
                        <CardInflu
                          key={influencer.id}
                          name={influencer.name}
                          avatar={influencer.avatar}
                          category={influencer.category}
                          followers={influencer.followers}
                          engagement={influencer.engagement}
                          platform={influencer.platform}
                          platforms={influencer.platforms}
                          verified={influencer.verified}
                          onClick={() => handleCardClick(influencer)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {influencers.length === 0 && (
                  <div className={styles.emptyContainer}>
                    <p>Nenhum influenciador encontrado</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedInfluencer && (
        <InfluencerDetail 
          influencer={selectedInfluencer} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
