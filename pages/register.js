import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

const emptyForm = {
  nome: "",
  perfil: "",
  email: "",
  senha: ""
};

export default function RegisterPage() {
  const router = useRouter();
  const { currentUser, loaded, register } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    setErrorMessage("");
    setSuccessMessage("");

    const result = register(form);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setSuccessMessage("Cadastro criado com sucesso. Agora voce pode fazer login.");
    setForm(emptyForm);
  }

  if (!loaded) {
    return <div className="loading-screen">Carregando...</div>;
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <p className="logo-label">HealthSys</p>
        <h1>Cadastro de usuario</h1>
        <p>
          O modelo segue sua entidade do backend: nome, perfil, email e senha.
          O perfil so aceita MEDICO ou PACIENTE.
        </p>
      </section>

      <section className="auth-card">
        <h2>Criar conta</h2>

        <form className="form-card auth-form" onSubmit={handleSubmit}>
          <label>
            Nome
            <input name="nome" value={form.nome} onChange={handleChange} required />
          </label>

          <label>
            Perfil
            <select name="perfil" value={form.perfil} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="MEDICO">MEDICO</option>
              <option value="PACIENTE">PACIENTE</option>
            </select>
          </label>

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
          {successMessage && <p className="success-text">{successMessage}</p>}

          <button className="primary-button" type="submit">
            Salvar cadastro
          </button>
        </form>

        <p className="auth-link-text">
          Ja tem conta? <Link href="/login">Voltar para login</Link>
        </p>
      </section>
    </main>
  );
}
