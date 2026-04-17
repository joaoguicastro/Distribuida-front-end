import { useEffect, useState } from "react";

const USERS_KEY = "healthsys-users";
const SESSION_KEY = "healthsys-session";

const initialUsers = [
  {
    id: 1,
    nome: "Medico Demo",
    perfil: "MEDICO",
    email: "medico@healthsys.com",
    senha: "123456"
  },
  {
    id: 2,
    nome: "Paciente Demo",
    perfil: "PACIENTE",
    email: "paciente@healthsys.com",
    senha: "123456"
  }
];

export default function useAuth() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedUsers = window.localStorage.getItem(USERS_KEY);
    const savedSession = window.localStorage.getItem(SESSION_KEY);

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
      setUsers(initialUsers);
    }

    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
    }

    setLoaded(true);
  }, []);

  function saveUsers(nextUsers) {
    setUsers(nextUsers);
    window.localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
  }

  function saveSession(user) {
    setCurrentUser(user);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  function login(email, senha) {
    const foundUser = users.find(
      (user) => user.email === email && user.senha === senha
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Email ou senha invalidos."
      };
    }

    saveSession(foundUser);

    return {
      success: true
    };
  }

  function loginAsDev() {
    const devUser = {
      id: 999,
      nome: "Dev Local",
      perfil: "MEDICO",
      email: "dev@local",
      senha: "",
      devBypass: true
    };

    saveSession(devUser);
  }

  function register(userData) {
    const emailAlreadyExists = users.some((user) => user.email === userData.email);

    if (emailAlreadyExists) {
      return {
        success: false,
        message: "Ja existe um usuario com esse email."
      };
    }

    if (userData.perfil !== "MEDICO" && userData.perfil !== "PACIENTE") {
      return {
        success: false,
        message: "Perfil invalido. Use MEDICO ou PACIENTE."
      };
    }

    const newUser = {
      id: Date.now(),
      nome: userData.nome,
      perfil: userData.perfil,
      email: userData.email,
      senha: userData.senha
    };

    const nextUsers = [...users, newUser];
    saveUsers(nextUsers);

    return {
      success: true
    };
  }

  function logout() {
    setCurrentUser(null);
    window.localStorage.removeItem(SESSION_KEY);
  }

  return {
    users,
    currentUser,
    loaded,
    login,
    loginAsDev,
    register,
    logout
  };
}
