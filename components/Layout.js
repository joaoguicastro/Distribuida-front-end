import Link from "next/link";
import { useRouter } from "next/router";

const menuItems = [
  { href: "/", label: "Dashboard" },
  { href: "/patients", label: "Pacientes" },
  { href: "/records", label: "Prontuarios" },
  { href: "/triage", label: "Triagem" }
];

export default function Layout({ title, children, currentUser, onLogout }) {
  const router = useRouter();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="logo-label">HealthSys</p>
          <h1 className="logo-title">Gestao Hospitalar</h1>
          <p className="logo-text">
            Exemplo simples em Next.js para estudar frontend.
          </p>
        </div>

        {currentUser && (
          <div className="user-box">
            <p className="user-box-label">Usuario logado</p>
            <strong>{currentUser.nome}</strong>
            <p>{currentUser.perfil}</p>
            <p>{currentUser.email}</p>
            <button className="logout-button" onClick={onLogout} type="button">
              Sair
            </button>
          </div>
        )}

        <nav className="menu">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={router.pathname === item.href ? "menu-link active" : "menu-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="page-header">
          <div>
            <p className="page-label">Projeto final</p>
            <h2>{title}</h2>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
