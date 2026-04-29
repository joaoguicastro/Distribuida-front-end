import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "./Layout";
import useAuth from "../hooks/useAuth";

/**
 * ProtectedPage — envolve páginas que exigem autenticação.
 * @param {string[]} allowedRoles — se informado, só permite os perfis listados.
 *   Ex: allowedRoles={["MEDICO", "ADMIN"]}
 */
export default function ProtectedPage({ title, children, allowedRoles }) {
  const router = useRouter();
  const { currentUser, loaded, logout, getDashboardRoute } = useAuth();

  useEffect(() => {
    if (!loaded) return;

    // Sem sessão → vai pro login
    if (!currentUser) {
      router.push("/login");
      return;
    }

    // Perfil sem permissão → redireciona pro dashboard correto
    if (allowedRoles && !allowedRoles.includes(currentUser.perfil)) {
      router.push(getDashboardRoute(currentUser.perfil));
    }
  }, [loaded, currentUser, router, allowedRoles]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!loaded || !currentUser) {
    return <div className="loading-screen">Carregando...</div>;
  }

  // Aguarda redirect se perfil não tem acesso
  if (allowedRoles && !allowedRoles.includes(currentUser.perfil)) {
    return <div className="loading-screen">Redirecionando...</div>;
  }

  return (
    <Layout title={title} currentUser={currentUser} onLogout={handleLogout}>
      {children}
    </Layout>
  );
}
