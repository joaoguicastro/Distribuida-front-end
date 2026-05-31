import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

const emptyForm = { nome: "", perfil: "", email: "", senha: "", confirmarSenha: "" };

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email.trim());
}

function validateNome(nome) {
  const trimmed = nome.trim();
  if (!trimmed) return "O nome é obrigatório.";
  if (trimmed.length < 3) return "O nome deve ter no mínimo 3 caracteres.";
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(trimmed)) return "O nome deve conter apenas letras e espaços.";
  return "";
}

function validate(fields) {
  const errs = {};

  const nomeErr = validateNome(fields.nome);
  if (nomeErr) errs.nome = nomeErr;

  if (!fields.perfil) errs.perfil = "Selecione um perfil.";

  if (!fields.email) {
    errs.email = "O e-mail é obrigatório.";
  } else if (!validateEmail(fields.email)) {
    errs.email = "Informe um e-mail válido (ex: usuario@dominio.com).";
  }

  if (!fields.senha) {
    errs.senha = "A senha é obrigatória.";
  } else if (fields.senha.length < 6) {
    errs.senha = "A senha deve ter no mínimo 6 caracteres.";
  } else if (!/[A-Za-z]/.test(fields.senha) || !/[0-9]/.test(fields.senha)) {
    errs.senha = "A senha deve conter letras e números.";
  }

  if (!fields.confirmarSenha) {
    errs.confirmarSenha = "Confirme a senha.";
  } else if (fields.senha !== fields.confirmarSenha) {
    errs.confirmarSenha = "As senhas não coincidem.";
  }

  return errs;
}

export default function RegisterPage() {
  const router = useRouter();
  const { currentUser, loaded, register, getDashboardRoute } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (loaded && currentUser) {
      router.push(getDashboardRoute(currentUser.perfil));
    }
  }, [loaded, currentUser, router]);

  function handleChange(event) {
    const { name, value } = event.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) {
      setErrors(validate(updated));
    }
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(form));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const allTouched = Object.keys(emptyForm).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setErrorMessage("");
    setSuccessMessage("");

    // Remove confirmarSenha before sending
    const { confirmarSenha, ...payload } = form;
    const result = await register(payload);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setSuccessMessage("Cadastro criado com sucesso. Agora voce pode fazer login.");
    setForm(emptyForm);
    setTouched({});
    setErrors({});
  }

  function fieldStyle(name) {
    return errors[name] && touched[name] ? { borderColor: "#c0392b" } : {};
  }

  if (!loaded) return <div className="loading-screen">Carregando...</div>;

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <p className="logo-label">HealthSys</p>
        <h1>Cadastro de usuario</h1>
        <p>
          Informe nome, perfil, email e senha. O perfil define seu acesso na
          plataforma apos o login.
        </p>
      </section>

      <section className="auth-card">
        <h2>Criar conta</h2>

        <form className="form-card auth-form" onSubmit={handleSubmit} noValidate>
          <label>
            Nome completo
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ex: João da Silva"
              style={fieldStyle("nome")}
            />
            {errors.nome && touched.nome && (
              <span className="error-text" style={{ fontSize: "0.82rem" }}>{errors.nome}</span>
            )}
          </label>

          <label>
            Perfil
            <select
              name="perfil"
              value={form.perfil}
              onChange={handleChange}
              onBlur={handleBlur}
              style={fieldStyle("perfil")}
            >
              <option value="">Selecione</option>
              <option value="MEDICO">MEDICO</option>
              <option value="PACIENTE">PACIENTE</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            {errors.perfil && touched.perfil && (
              <span className="error-text" style={{ fontSize: "0.82rem" }}>{errors.perfil}</span>
            )}
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="usuario@dominio.com"
              autoComplete="email"
              style={fieldStyle("email")}
            />
            {errors.email && touched.email && (
              <span className="error-text" style={{ fontSize: "0.82rem" }}>{errors.email}</span>
            )}
          </label>

          <label>
            Senha
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Mínimo 6 caracteres com letras e números"
              autoComplete="new-password"
              style={fieldStyle("senha")}
            />
            {errors.senha && touched.senha && (
              <span className="error-text" style={{ fontSize: "0.82rem" }}>{errors.senha}</span>
            )}
          </label>

          <label>
            Confirmar senha
            <input
              type="password"
              name="confirmarSenha"
              value={form.confirmarSenha}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Repita a senha"
              autoComplete="new-password"
              style={fieldStyle("confirmarSenha")}
            />
            {errors.confirmarSenha && touched.confirmarSenha && (
              <span className="error-text" style={{ fontSize: "0.82rem" }}>{errors.confirmarSenha}</span>
            )}
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
