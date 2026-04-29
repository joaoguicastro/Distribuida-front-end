import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

export default function IndexPage() {
  const router = useRouter();
  const { currentUser, loaded, getDashboardRoute } = useAuth();

  useEffect(() => {
    if (!loaded) return;
    if (!currentUser) {
      router.push("/login");
    } else {
      router.push(getDashboardRoute(currentUser.perfil));
    }
  }, [loaded, currentUser, router]);

  return <div className="loading-screen">Redirecionando...</div>;
}
