import Link from "next/link";
import { useRouter } from "next/router";

const MENU_BY_ROLE = {
  ADMIN: [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/patients", label: "Pacientes" },
    { href: "/records", label: "Prontuarios" },
    { href: "/triage", label: "Triagem" },
    { href: "/notificacoes", label: "Notificacoes" }
  ],
  MEDICO: [
    { href: "/medico/dashboard", label: "Dashboard" },
    { href: "/patients", label: "Pacientes" },
    { href: "/records", label: "Prontuarios" },
    { href: "/triage", label: "Triagem" },
    { href: "/notificacoes", label: "Notificacoes" }
  ],
  RECEPCIONISTA: [
    { href: "/recepcionista/dashboard", label: "Dashboard" },
    { href: "/patients", label: "Pacientes" },
    { href: "/triage", label: "Triagem" },
    { href: "/notificacoes", label: "Notificacoes" }
  ],
  PACIENTE: [
    { href: "/paciente/dashboard", label: "Dashboard" }
  ]
};

export default function Layout({ title, currentUser, onLogout, children }) {
  const router = useRouter();
  const menuItems = MENU_BY_ROLE[currentUser?.perfil] || [];

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <p className="logo-label">HealthSys</p>
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={router.pathname === item.href ? "nav-link active" : "nav-link"}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <span className="nav-user">{currentUser?.nome || currentUser?.email}</span>
          <button className="secondary-button" onClick={onLogout}>
            Sair
          </button>
        </div>
      </nav>

      <main className="main-content">
        {title && <h2 className="page-title">{title}</h2>}
        {children}
      </main>
    </div>
  );
}
