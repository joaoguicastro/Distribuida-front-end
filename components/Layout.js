import Link from "next/link";
import { useRouter } from "next/router";

// Menu filtrado por perfil
const MENU_BY_ROLE = {
  ADMIN: [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/patients", label: "Pacientes" },
    { href: "/records", label: "Prontuarios" },
    { href: "/triage", label: "Triagem" }
  ],
  MEDICO: [
    { href: "/medico/dashboard", label: "Dashboard" },
    { href: "/patients", label: "Pacientes" },
    { href: "/records", label: "Prontuarios" },
    { href: "/triage", label: "Triagem" }
  ],
  RECEPCIONISTA: [
    { href: "/recepcionista/dashboard", label: "Dashboard" },
    { href: "/patients", label: "Pacientes" },
    { href: "/triage", label: "Triagem" }
  ],
  PACIENTE: [
    { href: "/paciente/dashboard", label: "Dashboard" }
  ]
};

const DEFAULT_MENU = [
  { href: "/", label: "Dashboard" },
  { href: "/patients", label: "Pacientes" },
  { href: "/records", label: "Prontuarios" },
  { href: "/triage", label: "Triagem" }
];

const ROLE_LABELS = {
  ADMIN: "Administrador",
  MEDICO: "Medico",
  RECEPCIONISTA: "Recepcionista",
  PACIENTE: "Paciente"
};

export default function Layout({ title, children, currentUser, onLogout }) {
  const router = useRouter();
  const menuItems = MENU_BY_ROLE[currentUser?.perfil] || DEFAULT_MENU;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="logo-label">HealthSys</p>
          <h1 className="logo-title">Gestao Hospitalar</h1>
        </div>

        {currentUser && (
          <div className="user-box">
            <p className="user-box-label">Usuario logado</p>
            <strong>{currentUser.nome}</strong>
            <p>{ROLE_LABELS[currentUser.perfil] || currentUser.perfil}</p>
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
            <p className="page-label">
              {ROLE_LABELS[currentUser?.perfil] || "Sistema"}
            </p>
            <h2>{title}</h2>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
