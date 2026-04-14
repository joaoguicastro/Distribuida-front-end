import apiClient from './client';
import type { Patient, ApiResponse, PaginatedResponse } from '@/types';

export const patientsApi = {
  list: (params: { page?: number; size?: number; search?: string }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Patient>>>('/patients', { params }).then(r => r.data),
  getById: (id: string) =>
    apiClient.get<ApiResponse<Patient>>(`/patients/${id}`).then(r => r.data),
  create: (data: Partial<Patient>) =>
    apiClient.post<ApiResponse<Patient>>('/patients', data).then(r => r.data),
  update: (id: string, data: Partial<Patient>) =>
    apiClient.put<ApiResponse<Patient>>(`/patients/${id}`, data).then(r => r.data),
  getHistory: (id: string) =>
    apiClient.get<ApiResponse<any[]>>(`/patients/${id}/history`).then(r => r.data),
};
