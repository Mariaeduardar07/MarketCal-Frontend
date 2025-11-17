'use client';

import React, { useState } from 'react';
import styles from './pageExplore.module.css';
import CardInflu from '@/components/CardInflu';
import Header from '@/components/Header';
import SideHeader from '@/components/sideHeader';
import InfluencerDetail from '@/components/InfluencerDetail';
import { mockInfluencers } from '@/data/mockData';

export default function PageExplore() {
  const [filter, setFilter] = useState('all');
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  const allInfluencers = [...mockInfluencers.recent, ...mockInfluencers.all];

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
            
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Influencers</h2>
                <span className={styles.badge}>{mockInfluencers.recent.length}</span>
              </div>
              
              <div className={styles.cardsGrid}>
                {mockInfluencers.recent.map((influencer) => (
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

            {/* Seção de Todos os Influenciadores */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Influencers</h2>
                <span className={styles.badge}>{mockInfluencers.all.length}</span>
              </div>
              
              <div className={styles.cardsGrid}>
                {mockInfluencers.all.map((influencer) => (
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
