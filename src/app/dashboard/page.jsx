"use client";

import { useEffect, useState } from "react";
import api from "../service/api.js";
import SocialAccountsCarousel from "@/components/SocialAccountsCarousel/index.jsx";
import UpcomingTasks from "@/components/UpcomingTasks/index.jsx";
import TodayTask from "@/components/TodayTask/index.jsx";
import Header from "@/components/Header/index.jsx";

export default function DashboardPage() {
  const [user, setUser] = useState(() => {
    try {
      if (typeof window === "undefined") return null;
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [accounts, setAccounts] = useState([]);
  const [posts, setPosts] = useState([]);

  // Fetch das contas sociais e posts
  useEffect(() => {
    async function loadData() {
      try {
        const accountsRes = await api.get("/social-accounts");
        const postsRes = await api.get("/posts");

        setAccounts(accountsRes.data || []);
        setPosts(postsRes.data || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err?.message || err);
        // If it's a 404 from the backend, suggest checking NEXT_PUBLIC_API_URL
        if (err?.response?.status === 404) {
          console.error(
            "Received 404 from API. Verify the backend routes and that NEXT_PUBLIC_API_URL is set to the backend (not the Next dev server)."
          );
        }
        setAccounts([]);
        setPosts([]);
      }
    }

    loadData();
  }, []);


  return (
    <div className="flex w-full h-screen bg-[#f6f8fb]">
      <Header />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Olá, {user?.name}</h1>
        <p className="text-gray-500 mb-6">Vamos concluir sua tarefa hoje!</p>

        <SocialAccountsCarousel accounts={accounts} />

        <UpcomingTasks posts={posts} />

        <TodayTask posts={posts} />
      </div>
    </div>
  );
}
