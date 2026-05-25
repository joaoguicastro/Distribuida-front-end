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