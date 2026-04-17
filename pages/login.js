import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

const emptyForm = {
  email: "",
  senha: ""
};

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, loaded, login, loginAsDev } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (loaded && currentUser) {
      router.push("/");
    }
  }, [loaded, currentUser, router]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = login(form.email, form.senha);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    router.push("/");
  }

  function handleDevLogin() {
    loginAsDev();
    router.push("/");
  }

  if (!loaded) {
    return <div className="loading-screen">Carregando...</div>;
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <p className="logo-label">HealthSys</p>
        <h1>Login da plataforma</h1>
        <p>
          Esta tela e simples de proposito. A ideia e estudar o fluxo de login
          antes de ligar com o backend.
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

          <button className="primary-button" type="submit">
            Entrar
          </button>
        </form>

        <button className="secondary-button full-button" onClick={handleDevLogin} type="button">
          Entrar com bypass de dev
        </button>

        <div className="dev-box">
          <p className="dev-box-title">Usuario de exemplo</p>
          <p>Email: medico@healthsys.com</p>
          <p>Senha: 123456</p>
        </div>

        <p className="auth-link-text">
          Ainda nao tem conta? <Link href="/register">Criar cadastro</Link>
        </p>
      </section>
    </main>
  );
}
