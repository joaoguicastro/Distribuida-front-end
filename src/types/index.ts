export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  sex: 'M' | 'F';
  phone: string;
  allergies: string[];
  vaccines: Vaccine[];
}

export interface Vaccine {
  id: string;
  name: string;
  date: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName?: string;
  date: string;
  type: string;
  doctorName?: string;
  notes: string;
  exams: string[];
  medications: string[];
}

export interface Triage {
  id: string;
  patientId: string;
  patientName: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  symptoms: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST';
  active?: boolean;
}

export interface Notification {
  id?: string;
  type: string;
  message: string;
  patientId?: string;
  timestamp: string;
  read: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
