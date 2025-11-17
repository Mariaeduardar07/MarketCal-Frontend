"use client";

import React from 'react';
import styles from './InfluencerDetail.module.css';

const InfluencerDetail = ({ influencer, onClose }) => {
  if (!influencer) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.header}>
          <div className={styles.avatarSection}>
            <img 
              src={influencer.avatar || '/image/logo.png'} 
              alt={influencer.name}
              className={styles.avatar}
            />
            {influencer.verified && (
              <span className={styles.verifiedBadge}>✓ Verificado</span>
            )}
          </div>
          
          <div className={styles.basicInfo}>
            <h1 className={styles.name}>{influencer.name}</h1>
            <p className={styles.category}>{influencer.category}</p>
            
            <div className={styles.platformBadges}>
              {influencer.platforms?.map((platform, index) => (
                <span key={index} className={styles.platformBadge}>
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Seguidores</span>
            <span className={styles.statValue}>{influencer.followers}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Engajamento</span>
            <span className={styles.statValue}>{influencer.engagement}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Alcance Médio</span>
            <span className={styles.statValue}>{influencer.avgViews || '2.5M'}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total de Posts</span>
            <span className={styles.statValue}>{influencer.totalPosts || '1.5K'}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Público Alvo</h2>
          <div className={styles.audienceGrid}>
            <div className={styles.audienceItem}>
              <span className={styles.audienceLabel}>Distribuição por Gênero</span>
              <div className={styles.genderSplit}>
                <div className={styles.genderItem}>
                  <span>Mulheres</span>
                  <span className={styles.percentage}>{influencer.audience?.women || '65'}%</span>
                </div>
                <div className={styles.genderItem}>
                  <span>Homens</span>
                  <span className={styles.percentage}>{influencer.audience?.men || '35'}%</span>
                </div>
              </div>
            </div>
            
            <div className={styles.audienceItem}>
              <span className={styles.audienceLabel}>Distribuição por Idade</span>
              <div className={styles.ageGroupsContainer}>
                {influencer.audience?.ageGroups?.map((group, index) => (
                  <div key={index} className={styles.ageGroup}>
                    <div className={styles.ageGroupHeader}>
                      <span className={styles.ageRange}>{group.range}</span>
                      <span className={styles.agePercentage}>{group.percentage}%</span>
                    </div>
                    <div className={styles.ageGroupBar}>
                      <div 
                        className={styles.ageGroupFill} 
                        style={{width: `${group.percentage}%`}}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.audienceItem}>
              <span className={styles.audienceLabel}>Localização Principal</span>
              <p className={styles.audienceValue}> {influencer.location || 'Brasil'}</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Interesses do Público</h2>
          <div className={styles.tagsContainer}>
            {(influencer.interests || ['Moda', 'Beleza', 'Lifestyle', 'Fitness', 'Viagens']).map((interest, index) => (
              <span key={index} className={styles.tag}>{interest}</span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tipos de Conteúdo</h2>
          <div className={styles.contentTypes}>
            {influencer.contentTypes ? (
              <>
                <div className={styles.contentType}>
                  <div className={styles.contentHeader}>
                    <span>Fotos</span>
                    <span className={styles.contentPercentage}>{influencer.contentTypes.photos}%</span>
                  </div>
                  <div className={styles.contentBar}>
                    <div 
                      className={styles.contentBarFill} 
                      style={{width: `${influencer.contentTypes.photos}%`}}
                    ></div>
                  </div>
                </div>
                <div className={styles.contentType}>
                  <div className={styles.contentHeader}>
                    <span>Vídeos</span>
                    <span className={styles.contentPercentage}>{influencer.contentTypes.videos}%</span>
                  </div>
                  <div className={styles.contentBar}>
                    <div 
                      className={styles.contentBarFill} 
                      style={{width: `${influencer.contentTypes.videos}%`}}
                    ></div>
                  </div>
                </div>
                <div className={styles.contentType}>
                  <div className={styles.contentHeader}>
                    <span>Reels</span>
                    <span className={styles.contentPercentage}>{influencer.contentTypes.reels}%</span>
                  </div>
                  <div className={styles.contentBar}>
                    <div 
                      className={styles.contentBarFill} 
                      style={{width: `${influencer.contentTypes.reels}%`}}
                    ></div>
                  </div>
                </div>
                <div className={styles.contentType}>
                  <div className={styles.contentHeader}>
                    <span>Stories</span>
                    <span className={styles.contentPercentage}>{influencer.contentTypes.stories}%</span>
                  </div>
                  <div className={styles.contentBar}>
                    <div 
                      className={styles.contentBarFill} 
                      style={{width: `${influencer.contentTypes.stories}%`}}
                    ></div>
                  </div>
                </div>
              </>
            ) : (
              <p>Dados de conteúdo não disponíveis</p>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Melhor Horário para Engajamento</h2>
          <div className={styles.timeSlots}>
            <div className={styles.timeSlot}>
              <span className={styles.timeLabel}>Manhã</span>
              <span>8h-12h</span>
              <span className={styles.timeRate}>{influencer.peakTimes?.morning || '25'}%</span>
            </div>
            <div className={styles.timeSlot}>
              <span className={styles.timeLabel}>Tarde</span>
              <span>12h-18h</span>
              <span className={styles.timeRate}>{influencer.peakTimes?.afternoon || '40'}%</span>
            </div>
            <div className={styles.timeSlot}>
              <span className={styles.timeLabel}>Noite</span>
              <span>18h-23h</span>
              <span className={styles.timeRate}>{influencer.peakTimes?.night || '35'}%</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Valores de Investimento</h2>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3>Post Feed</h3>
              <p className={styles.price}>{influencer.pricing?.post || 'R$ 15.000'}</p>
              <span className={styles.priceDetail}>por publicação</span>
            </div>
            <div className={styles.pricingCard}>
              <h3>Stories</h3>
              <p className={styles.price}>{influencer.pricing?.story || 'R$ 8.000'}</p>
              <span className={styles.priceDetail}>pacote 3 stories</span>
            </div>
            <div className={styles.pricingCard}>
              <h3>Vídeo</h3>
              <p className={styles.price}>{influencer.pricing?.video || 'R$ 20.000'}</p>
              <span className={styles.priceDetail}>por vídeo</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Contratos em Andamento</h2>
          <div className={styles.contractsList}>
            {influencer.contracts && influencer.contracts.length > 0 ? (
              influencer.contracts.map((contract, index) => (
                <div key={index} className={styles.contractCard}>
                  <div className={styles.contractHeader}>
                    <div className={styles.contractBrand}>
                      {contract.brandLogo ? (
                        <img src={contract.brandLogo} alt={contract.brand} className={styles.brandLogo} />
                      ) : (
                        <div className={styles.brandIcon}>
                          {contract.brand.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4>{contract.brand}</h4>
                        <span className={styles.contractType}>{contract.type}</span>
                      </div>
                    </div>
                    <span className={styles.contractStatus}>{contract.status}</span>
                  </div>
                  <div className={styles.contractDetails}>
                    {contract.duration && (
                      <div className={styles.contractInfo}>
                        <span className={styles.infoLabel}>Duração</span>
                        <span className={styles.infoValue}>{contract.duration}</span>
                      </div>
                    )}
                    {contract.startDate && (
                      <div className={styles.contractInfo}>
                        <span className={styles.infoLabel}>Início</span>
                        <span className={styles.infoValue}>{contract.startDate}</span>
                      </div>
                    )}
                    {contract.endDate && (
                      <div className={styles.contractInfo}>
                        <span className={styles.infoLabel}>Término</span>
                        <span className={styles.infoValue}>{contract.endDate}</span>
                      </div>
                    )}
                    {contract.deliverables && (
                      <div className={styles.contractInfo}>
                        <span className={styles.infoLabel}>Entregas</span>
                        <span className={styles.infoValue}>{contract.deliverables}</span>
                      </div>
                    )}
                    {contract.deadline && (
                      <div className={styles.contractInfo}>
                        <span className={styles.infoLabel}>Prazo</span>
                        <span className={styles.infoValue}>{contract.deadline}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{textAlign: 'center', color: '#888', padding: '20px'}}>
                Nenhum contrato ativo no momento
              </p>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnClose} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDetail;
