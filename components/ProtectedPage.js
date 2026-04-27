import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "./Layout";
import useAuth from "../hooks/useAuth";

export default function ProtectedPage({ title, children }) {
  const router = useRouter();
  const { currentUser, loaded, logout } = useAuth();

  useEffect(() => {
    if (loaded && !currentUser) {
      router.push("/login");
    }
  }, [loaded, currentUser, router]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!loaded || !currentUser) {
    return <div className="loading-screen">Carregando...</div>;
  }

  return (
    <Layout title={title} currentUser={currentUser} onLogout={handleLogout}>
      {children}
    </Layout>
  );
}
