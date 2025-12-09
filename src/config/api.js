import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Criar instância do axios com configuração padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('🌐 Requisição para API:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      hasToken: !!token,
      data: config.data || null
    });

    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    console.log('📨 Resposta da API:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      ok: response.status >= 200 && response.status < 300
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ Erro na resposta:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response.status,
        statusText: error.response.statusText,
        errorData: error.response.data,
        sentData: error.config?.data ? JSON.parse(error.config.data) : null
      });

      // Se o token expirou (401), redirecionar para login
      if (error.response.status === 401) {
        console.warn('⚠️ Token expirado ou inválido - redirecionando para login');
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/Login";
        }
      }
    } else {
      console.error('❌ Erro de rede:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Função compatível com o código antigo (para não quebrar)
export async function fetchWithAuth(endpoint, options = {}) {
  try {
    const method = options.method || 'GET';
    const config = {
      method,
      url: endpoint,
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: options.headers || {},
    };

    const response = await api(config);
    
    // Retornar objeto compatível com fetch
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText,
      json: async () => response.data,
    };
  } catch (error) {
    // Retornar erro compatível com fetch
    if (error.response) {
      return {
        ok: false,
        status: error.response.status,
        statusText: error.response.statusText,
        json: async () => error.response.data,
      };
    }
    throw error;
  }
}

export default api;
