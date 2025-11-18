'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SideHeader from '../../components/sideHeader';
import ProgressCard from '../../components/ProgressCard';
import { fetchInfluencerTasks } from '../../data/mockData';
import styles from './pageTask.module.css';

const PageTask = () => {
  const [tasks, setTasks] = useState({ instagram: [], twitter: [], linkedin: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await fetchInfluencerTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('Erro ao carregar tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

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
              />
            ))}
          </div>
        </section>

        {/* Seção Twitter */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Twitter</h2>
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
              />
            ))}
          </div>
        </section>

        {/* Seção LinkedIn */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>LinkedIn</h2>
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
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default PageTask;
