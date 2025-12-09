"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Plus, Link2, TrendingUp } from "lucide-react";
import styles from "./dashboard.module.css";
import Header from "@/components/Header";
import SideHeader from "@/components/sideHeader";
import DashboardStats from "@/components/DashboardStats";
import PostsChart from "@/components/PostsChart";
import SocialAccountsOverview from "@/components/SocialAccountsOverview";
import UpcomingPosts from "@/components/UpcomingPosts";
import PostStatusDistribution from "@/components/PostStatusDistribution";
import MiniCalendar from "@/components/MiniCalendar";
import { usePostsContext } from "@/context/PostsContext";
import { fetchPosts } from "@/services/postService";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { posts: contextPosts, updatePosts } = usePostsContext();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token) {
          router.push("/Login");
          return;
        }

        // Buscar posts da API e adicionar ao contexto
        const postsData = await fetchPosts();
        console.log('📊 Posts carregados do backend:', postsData);
        if (postsData && postsData.length > 0) {
          updatePosts(postsData);
        }

        const response = await fetch("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
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
  }, [router, updatePosts]);

  return (
    <div className={styles.pageWrapper}>
      <SideHeader />
      
      <div className={styles.mainContent}>
        <Header />
        
        <div className={styles.pageContainer}>
          <div className={styles.contentWrapper}>

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
                <h2>Erro ao carregar dashboard</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className={styles.retryButton}>
                  Tentar novamente
                </button>
              </div>
            )}

            {/* Dashboard Content */}
            {!loading && !error && dashboardData && (
              <>
                {/* Overview Section - Layout Principal */}
                <section className={styles.overviewSection}>
                  {/* Card Grande de Overview (70%) */}
                  <div className={styles.overviewCard}>
                    <div className={styles.overviewHeader}>
                      <div>
                        <h1 className={styles.overviewTitle}>Visão Geral</h1>
                        <p className={styles.overviewSubtitle}>Acompanhe suas postagens em tempo real</p>
                      </div>
                      <div className={styles.overviewIconBadge}>
                        <TrendingUp size={24} strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    {/* Gráfico de Linha dentro do Overview */}
                    <div className={styles.overviewChart}>
                      <PostsChart data={dashboardData?.postsTimeline} isOverview={true} />
                    </div>
                    
                    {/* Métricas na parte inferior */}
                    <div className={styles.overviewMetrics}>
                      <DashboardStats stats={dashboardData?.stats} variant="overview" />
                    </div>
                  </div>

                  {/* Cards de Ação Rápida (30%) */}
                  <div className={styles.quickActions}>
                    {/* Calendário */}
                    <div className={styles.calendarCard}>
                      <MiniCalendar upcomingPosts={dashboardData?.upcomingPosts || []} />
                    </div>

                    {/* Ações */}
                    <div className={styles.actionCardAlt}>
                      <div className={styles.actionIconWrapper}>
                        <Link2 size={28} strokeWidth={2} />
                      </div>
                      <h3 className={styles.actionTitle}>Conectar</h3>
                      <p className={styles.actionDesc}>Nova rede social</p>
                      <button className={styles.actionBtnAlt}>
                        <Plus size={18} strokeWidth={2.5} />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                </section>

                {/* Seção Secundária */}
                <section className={styles.secondarySection}>
                  {/* Distribuição de Status - Card Menor */}
                  <div className={styles.chartCardSmall}>
                    <PostStatusDistribution data={dashboardData?.statusDistribution} />
                  </div>

                  {/* Contas Sociais - Card Maior */}
                  <div className={styles.chartCard}>
                    <SocialAccountsOverview accounts={dashboardData?.accounts} />
                  </div>
                </section>

                {/* Próximas Postagens */}
                <section className={styles.section}>
                  <UpcomingPosts posts={contextPosts.length > 0 ? contextPosts : dashboardData?.upcomingPosts} />
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}