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
        "https://marketcal-back-end.onrender.com/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token, user } = response.data;

      if (!token) {
        throw new Error("Erro: resposta da API incompleta.");
      }

      // Salvar token e usuário no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess("Conta criada com sucesso! Redirecionando...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === "ERR_NETWORK") {
        setError("Erro de conexão. Verifique se o servidor está rodando.");
      } else {
        setError("Erro ao fazer cadastro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containerRegister}>
      {/* ESQUERDA */}
      <div className={styles.right}>
        <Image
          src="/image/logo.png"
          alt="Logo do MarketCal"
          width={250}
          height={250}
          className={styles.logoImg}
          priority
        />
        <form className={styles.form} onSubmit={handleRegister}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              className={styles.input}
              placeholder="Seu nome completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              E-mail
            </label>
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

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={styles.input}
                placeholder="Digite sua senha (mín. 6 caracteres)"
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
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirmar Senha
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={styles.input}
                placeholder="Confirme sua senha"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                disabled={loading}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className={styles.warningMessage}>As senhas não coincidem</p>
            )}
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              <>
                <span className={styles.spinner}></span> Criando conta...
              </>
            ) : (
              "Criar Conta"
            )}
          </button>

          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Já tem conta?{" "}
            <Link href="/login" style={{ color: "#007bff", fontWeight: "bold" }}>
              Faça login
            </Link>
          </p>
        </form>
      </div>

      {/* DIREITA */}
      <div className={styles.left}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Crie sua conta</h1>
          <p className={styles.text}>
            Junte-se ao MarketCal e organize sua estratégia de social media
          </p>
        </div>
      </div>
    </div>
  );
}
