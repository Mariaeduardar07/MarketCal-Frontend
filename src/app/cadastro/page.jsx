"use client";
import React from "react";
import styles from "./register.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Validar email
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    if (!validateEmail(form.email)) {
      setError("E-mail inválido. Por favor, verifique.");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Resposta completa:", response);
      console.log("Dados da resposta:", response.data);

      const { token, user } = response.data;

      // Se houver token e user, salva no localStorage
      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Criar conta social/influenciador automaticamente
        try {
          console.log("🎯 Criando conta social para o usuário:", user.name);
          
          const socialAccountResponse = await axios.post(
            "http://localhost:4000/social-accounts",
            {
              name: user.name,
              platform: "Instagram",
              handle: "@" + user.name.toLowerCase().replace(/\s+/g, ""),
              followers: "0",
              engagement: "0%",
              category: "Criador de Conteúdo",
              location: "Brasil",
              userId: user.id
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("✅ Conta social criada com sucesso:", socialAccountResponse.data);
        } catch (socialErr) {
          console.error("⚠️ Erro ao criar conta social (não crítico):", socialErr);
          // Não bloqueia o cadastro se falhar
        }
      }

      setSuccess("Conta criada com sucesso! Redirecionando...");
      setTimeout(() => router.push("/Login"), 1500);
    } catch (err) {
      console.error("Erro completo:", err);
      console.error("Response data:", err.response?.data);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === "ERR_NETWORK") {
        setError("Erro de conexão. Verifique se o servidor está rodando.");
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Erro ao fazer cadastro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* LADO ESQUERDO - BRANDING */}
      <div className={styles.left}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Junte-se ao MarketCal</h1>
          <p className={styles.text}>
            Crie sua conta e comece a organizar suas estratégias de social media hoje mesmo.
          </p>
        </div>
      </div>

      {/* LADO DIREITO - FORMULÁRIO */}
      <div className={styles.right}>
        <div className={styles.formCard}>
          <Image
            src="/image/logo.png"
            alt="Logo do MarketCal"
            width={245}
            height={245}
            className={styles.logo}
            priority
          />
          
          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Nome completo</label>
              <input
                type="text"
                id="name"
                className={styles.input}
                placeholder="Seu nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>E-mail</label>
              <input
                type="email"
                id="email"
                className={styles.input}
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>Senha</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={styles.input}
                    placeholder="Mín. 6 caracteres"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <span>{showPassword ? "Ocultar" : "Ver"}</span>
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirmar</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className={styles.input}
                    placeholder="Repita a senha"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    <span>{showConfirmPassword ? "Ocultar" : "Ver"}</span>
                  </button>
                </div>
              </div>
            </div>

            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className={styles.warning}>As senhas não coincidem</p>
            )}

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Criando...
                </>
              ) : (
                "Criar conta"
              )}
            </button>

            <p className={styles.link}>
              Já tem uma conta? <Link href="/Login">Entrar</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
