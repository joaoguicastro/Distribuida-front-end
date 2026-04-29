import { useEffect, useState } from "react";
import { loginUser, registerUser } from "../lib/api";

const SESSION_KEY = "healthsys-session";

// Mapa de perfil → rota Next.js (alinhado com redirectUrl do backend)
const ROLE_ROUTES = {
  ADMIN: "/admin/dashboard",
  MEDICO: "/medico/dashboard",
  PACIENTE: "/paciente/dashboard",
  RECEPCIONISTA: "/recepcionista/dashboard"
};

function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decodedPayload = window.atob(normalizedPayload);
    return JSON.parse(decodedPayload);
  } catch {
    return {};
  }
}

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedSession = window.localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
    }
    setLoaded(true);
  }, []);

  function saveSession(user) {
    setCurrentUser(user);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  // Retorna a rota do dashboard baseado no perfil
  function getDashboardRoute(perfil) {
    return ROLE_ROUTES[perfil] || "/";
  }

  async function login(email, senha) {
    try {
      // Backend aceita "senha" via @JsonAlias na LoginDTO
      const loginResponse = await loginUser({ email, senha });

      const token = loginResponse.token_acesso;
      // BUG CORRIGIDO: JWT usa claim "name", não "nome"
      const tokenData = parseJwt(token);

      // Perfil vem tanto do JWT quanto direto na resposta (ResponseLoginDTO)
      const perfil = loginResponse.perfil || tokenData.role || "USUARIO";

      const userSession = {
        id: tokenData.id || Date.now(),
        nome: tokenData.name || email,   // BUG CORRIGIDO: era tokenData.nome
        perfil,
        email: tokenData.sub || email,
        token,
        redirectUrl: loginResponse.redirectUrl || getDashboardRoute(perfil)
      };

      saveSession(userSession);

      return {
        success: true,
        redirectUrl: userSession.redirectUrl
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  function loginAsDev(perfil = "MEDICO") {
    const devUser = {
      id: 999,
      nome: `Dev ${perfil}`,
      perfil,
      email: "dev@local",
      token: "dev-bypass-token",
      devBypass: true,
      redirectUrl: getDashboardRoute(perfil)
    };
    saveSession(devUser);
    return getDashboardRoute(perfil);
  }

  async function register(userData) {
    const perfisValidos = ["MEDICO", "PACIENTE", "RECEPCIONISTA", "ADMIN"];
    if (!perfisValidos.includes(userData.perfil)) {
      return {
        success: false,
        message: "Perfil invalido. Use MEDICO, PACIENTE ou RECEPCIONISTA."
      };
    }

    try {
      const savedUser = await registerUser(userData);
      return { success: true, user: savedUser };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  function logout() {
    setCurrentUser(null);
    window.localStorage.removeItem(SESSION_KEY);
  }

  return {
    currentUser,
    loaded,
    login,
    loginAsDev,
    register,
    logout,
    getDashboardRoute
  };
}
