"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import Header from "@/components/Header";
import SideHeader from "@/components/sideHeader";
import DashboardStats from "@/components/DashboardStats";
import PostsChart from "@/components/PostsChart";
import SocialAccountsOverview from "@/components/SocialAccountsOverview";
import UpcomingPosts from "@/components/UpcomingPosts";
import PostStatusDistribution from "@/components/PostStatusDistribution";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        
        if (response.status === 401) {
          router.push("/Login");
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Falha ao carregar dashboard");
        }

        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Erro:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  return (
    <div className={styles.pageWrapper}>
      <SideHeader />
      
      <div className={styles.mainContent}>
        <Header />
        
        <div className={styles.pageContainer}>
          <div className={styles.contentWrapper}>
            
            {/* Header Section */}
            <section className={styles.headerSection}>
              <div>
                <h1 className={styles.pageTitle}>📊 Dashboard de Postagens</h1>
                <p className={styles.pageSubtitle}>Acompanhe o desempenho das suas contas sociais em tempo real</p>
              </div>
            </section>

            {/* Loading State */}
            {loading && (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Carregando dashboard...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className={styles.errorContainer}>
                <h2>⚠️ Erro ao carregar dashboard</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className={styles.retryButton}>
                  Tentar novamente
                </button>
              </div>
            )}

            {/* Dashboard Content */}
            {!loading && !error && dashboardData && (
              <>
                {/* Stats Grid */}
                <section className={styles.statsSection}>
                  <div className={styles.statsGrid}>
                    <DashboardStats stats={dashboardData?.stats} />
                  </div>
                </section>

                {/* Charts Grid */}
                <section className={styles.chartsSection}>
                  <div className={styles.chartsGrid}>
                    <div className={styles.chartCard}>
                      <PostsChart data={dashboardData?.postsTimeline} />
                    </div>
                    <div className={styles.chartCard}>
                      <PostStatusDistribution data={dashboardData?.statusDistribution} />
                    </div>
                  </div>
                </section>

                {/* Social Accounts */}
                <section className={styles.section}>
                  <SocialAccountsOverview accounts={dashboardData?.accounts} />
                </section>

                {/* Upcoming Posts */}
                <section className={styles.section}>
                  <UpcomingPosts posts={dashboardData?.upcomingPosts} />
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}