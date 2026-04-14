import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(date: string): string {
  return format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR });
}

export function formatDateTime(date: string): string {
  return format(parseISO(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatRelative(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: ptBR });
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = parseISO(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function getRiskColor(risk: string): string {
  const map: Record<string, string> = {
    CRITICAL: 'risk-critical',
    HIGH: 'risk-high',
    MEDIUM: 'risk-medium',
    LOW: 'risk-low',
  };
  return map[risk] || '';
}

export function getRiskBgClass(risk: string): string {
  const map: Record<string, string> = {
    CRITICAL: 'bg-critical text-critical-foreground',
    HIGH: 'bg-high text-high-foreground',
    MEDIUM: 'bg-medium text-medium-foreground',
    LOW: 'bg-low text-low-foreground',
  };
  return map[risk] || 'bg-muted text-muted-foreground';
}

export function getStatusBgClass(status: string): string {
  const map: Record<string, string> = {
    WAITING: 'bg-warning text-warning-foreground',
    IN_PROGRESS: 'bg-accent text-accent-foreground',
    COMPLETED: 'bg-success text-success-foreground',
  };
  return map[status] || 'bg-muted text-muted-foreground';
}

export function getRoleBgClass(role: string): string {
  const map: Record<string, string> = {
    ADMIN: 'bg-primary text-primary-foreground',
    DOCTOR: 'bg-accent text-accent-foreground',
    NURSE: 'bg-success text-success-foreground',
    RECEPTIONIST: 'bg-secondary text-secondary-foreground',
  };
  return map[role] || 'bg-muted text-muted-foreground';
}
