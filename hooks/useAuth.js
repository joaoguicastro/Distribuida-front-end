import { useEffect, useState } from "react";
import { loginUser, registerUser } from "../lib/api";

const SESSION_KEY = "healthsys-session";

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

  async function login(email, senha) {
    try {
      const loginResponse = await loginUser({ email, senha });
      const token = loginResponse.token_acesso;
      const tokenData = parseJwt(token);

      const userSession = {
        id: tokenData.id || null,
        nome: tokenData.name || tokenData.nome || email,
        perfil: tokenData.role || "USUARIO",
        email: tokenData.sub || email,
        token,
        expiraEm: loginResponse.expiraEm
      };

      saveSession(userSession);

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  function loginAsDev() {
    const devUser = {
      id: 999,
      nome: "Dev Local",
      perfil: "MEDICO",
      email: "dev@local",
      token: "dev-bypass-token",
      devBypass: true
    };

    saveSession(devUser);
  }

  async function register(userData) {
    if (userData.perfil !== "MEDICO" && userData.perfil !== "PACIENTE") {
      return {
        success: false,
        message: "Perfil invalido. Use MEDICO ou PACIENTE."
      };
    }

    try {
      const savedUser = await registerUser(userData);

      return {
        success: true,
        user: savedUser
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
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
    logout
  };
}
