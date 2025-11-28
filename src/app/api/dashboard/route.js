export async function GET(request) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
    
    // Pegar token do header Authorization
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return Response.json(
        { error: "Token não encontrado. Faça login primeiro." },
        { status: 401 }
      );
    }

    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Buscar posts
    const postsResponse = await fetch(`${API_URL}/posts`, {
      method: "GET",
      headers,
    });

    if (postsResponse.status === 401) {
      return Response.json(
        { error: "Token inválido ou expirado" },
        { status: 401 }
      );
    }

    if (!postsResponse.ok) {
      throw new Error(`Erro ao buscar posts: ${postsResponse.status}`);
    }

    const posts = await postsResponse.json();

    // Buscar contas sociais
    const accountsResponse = await fetch(`${API_URL}/social-accounts`, {
      method: "GET",
      headers,
    });

    if (!accountsResponse.ok) {
      throw new Error(
        `Erro ao buscar contas sociais: ${accountsResponse.status}`
      );
    }

    const accounts = await accountsResponse.json();

    // Processar estatísticas
    const stats = {
      totalPosts: posts.length,
      totalAccounts: accounts.length,
      scheduledPosts: posts.filter((p) => p.status === "SCHEDULED").length,
      publishedPosts: posts.filter((p) => p.status === "PUBLISHED").length,
      draftPosts: posts.filter((p) => p.status === "DRAFT").length,
    };

    // Agrupar postagens por dia da semana
    const postsTimeline = groupPostsByDay(posts);

    // Distribuição de status
    const statusDistribution = [
      {
        name: "Agendadas",
        value: stats.scheduledPosts,
        color: "#f093fb",
      },
      {
        name: "Publicadas",
        value: stats.publishedPosts,
        color: "#4facfe",
      },
      {
        name: "Rascunhos",
        value: stats.draftPosts,
        color: "#fdbb2d",
      },
    ].filter((item) => item.value > 0);

    // Próximas postagens agendadas
    const upcomingPosts = posts
      .filter((p) => p.status === "SCHEDULED")
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      )
      .slice(0, 10)
      .map((post) => ({
        id: post.id,
        content: post.content.substring(0, 50) + "...",
        platform: post.socialAccounts?.[0]?.platform || "Social Media",
        scheduledAt: post.scheduledAt,
        status: post.status,
      }));

    // Formatar contas sociais
    const formattedAccounts = accounts.map((acc) => {
      const accountPosts = posts.filter((p) =>
        p.socialAccounts?.some((sa) => sa.id === acc.id)
      );

      return {
        id: acc.id,
        name: acc.name,
        handle: acc.handle,
        platform: acc.platform,
        imageUrl: acc.imageUrl,
        posts: accountPosts.length,
      };
    });

    return Response.json({
      stats,
      postsTimeline,
      statusDistribution,
      accounts: formattedAccounts,
      upcomingPosts,
    });
  } catch (error) {
    console.error("Erro no dashboard:", error);
    return Response.json(
      { error: error.message || "Falha ao buscar dados do dashboard" },
      { status: 500 }
    );
  }
}

function groupPostsByDay(posts) {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const grouped = {};

  days.forEach((day, idx) => {
    grouped[idx] = 0;
  });

  posts.forEach((post) => {
    try {
      const date = new Date(post.scheduledAt);
      const dayOfWeek = date.getDay();
      grouped[dayOfWeek] = (grouped[dayOfWeek] || 0) + 1;
    } catch (e) {
      console.warn("Data inválida:", post.scheduledAt);
    }
  });

  return days.map((day, idx) => ({
    date: day,
    posts: grouped[idx],
  }));
}