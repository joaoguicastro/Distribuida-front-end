import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

const emptyForm = { email: "", senha: "" };

const DEV_PERFIS = ["MEDICO", "RECEPCIONISTA", "PACIENTE", "ADMIN"];

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email.trim());
}

function validateSenha(senha) {
  if (senha.length < 6) return "A senha deve ter no mínimo 6 caracteres.";
  return "";
}

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, loaded, login, loginAsDev, getDashboardRoute } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loaded && currentUser) {
      router.push(getDashboardRoute(currentUser.perfil));
    }
  }, [loaded, currentUser, router]);

  function validate(fields) {
    const errs = {};
    if (!fields.email) {
      errs.email = "O e-mail é obrigatório.";
    } else if (!validateEmail(fields.email)) {
      errs.email = "Informe um e-mail válido (ex: usuario@dominio.com).";
    }
    const senhaErr = validateSenha(fields.senha);
    if (!fields.senha) {
      errs.senha = "A senha é obrigatória.";
    } else if (senhaErr) {
      errs.senha = senhaErr;
    }
    return errs;
  }

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
    setTouched({ email: true, senha: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setErrorMessage("");
    setLoading(true);
    const result = await login(form.email, form.senha);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }
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

        <form className="form-card auth-form" onSubmit={handleSubmit} noValidate>
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
              aria-describedby={errors.email ? "email-error" : undefined}
              style={errors.email && touched.email ? { borderColor: "#c0392b" } : {}}
            />
            {errors.email && touched.email && (
              <span id="email-error" className="error-text" style={{ fontSize: "0.82rem", marginTop: "2px" }}>
                {errors.email}
              </span>
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
              placeholder="Mínimo 6 caracteres"
              autoComplete="current-password"
              aria-describedby={errors.senha ? "senha-error" : undefined}
              style={errors.senha && touched.senha ? { borderColor: "#c0392b" } : {}}
            />
            {errors.senha && touched.senha && (
              <span id="senha-error" className="error-text" style={{ fontSize: "0.82rem", marginTop: "2px" }}>
                {errors.senha}
              </span>
            )}
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
