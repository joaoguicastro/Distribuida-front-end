import apiClient from './client';
import type { Triage, ApiResponse } from '@/types';

export const triageApi = {
  list: (params?: { status?: string; risk?: string }) =>
    apiClient.get<ApiResponse<Triage[]>>('/triages', { params }).then(r => r.data),
  create: (data: Partial<Triage>) =>
    apiClient.post<ApiResponse<Triage>>('/triages', data).then(r => r.data),
  updateStatus: (id: string, status: string) =>
    apiClient.put<ApiResponse<Triage>>(`/triages/${id}/status`, { status }).then(r => r.data),
  getQueue: () =>
    apiClient.get<ApiResponse<Triage[]>>('/triages/queue').then(r => r.data),
};
