export const API_BASE_URL = 'http://localhost:8080';
export const WS_URL = 'ws://localhost:8080/ws/notifications';
export const DEV_AUTH_BYPASS = true;

export const RISK_LEVELS = {
  CRITICAL: { label: 'Crítico', order: 0 },
  HIGH: { label: 'Alto', order: 1 },
  MEDIUM: { label: 'Médio', order: 2 },
  LOW: { label: 'Baixo', order: 3 },
} as const;

export const ROLES = {
  ADMIN: 'Administrador',
  DOCTOR: 'Médico',
  NURSE: 'Enfermeiro(a)',
  RECEPTIONIST: 'Recepcionista',
} as const;

export const TRIAGE_STATUS = {
  WAITING: 'Aguardando',
  IN_PROGRESS: 'Em Atendimento',
  COMPLETED: 'Finalizado',
} as const;
