import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

const emptyForm = { email: "", senha: "" };

// Perfis disponíveis para bypass de dev
const DEV_PERFIS = ["MEDICO", "RECEPCIONISTA", "PACIENTE", "ADMIN"];

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, loaded, login, loginAsDev, getDashboardRoute } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loaded && currentUser) {
      router.push(getDashboardRoute(currentUser.perfil));
    }
  }, [loaded, currentUser, router]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const result = await login(form.email, form.senha);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    // BUG CORRIGIDO: redireciona para o dashboard do perfil, não sempre "/"
    router.push(result.redirectUrl);
  }

  function handleDevLogin(perfil) {
    const redirectUrl = loginAsDev(perfil);
    router.push(redirectUrl);
  }

  if (!loaded) return <div className="loading-screen">Carregando...</div>;

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <p className="logo-label">HealthSys</p>
        <h1>Login da plataforma</h1>
        <p>
          Acesse com suas credenciais. Voce sera redirecionado automaticamente
          para o painel do seu perfil.
        </p>
      </section>

      <section className="auth-card">
        <h2>Entrar</h2>

        <form className="form-card auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              required
            />
          </label>

          {errorMessage && <p className="error-text">{errorMessage}</p>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="dev-box">
          <p className="dev-box-title">Bypass de desenvolvimento</p>
          <p>Simule um perfil sem precisar do backend:</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
            {DEV_PERFIS.map((perfil) => (
              <button
                key={perfil}
                className="secondary-button"
                onClick={() => handleDevLogin(perfil)}
                type="button"
              >
                {perfil}
              </button>
            ))}
          </div>
        </div>

        <p className="auth-link-text">
          Ainda nao tem conta? <Link href="/register">Criar cadastro</Link>
        </p>
      </section>
    </main>
  );
}
