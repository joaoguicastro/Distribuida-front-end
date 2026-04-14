import apiClient from './client';
import type { MedicalRecord, ApiResponse } from '@/types';

export const recordsApi = {
  listByPatient: (patientId: string) =>
    apiClient.get<ApiResponse<MedicalRecord[]>>(`/records/${patientId}`).then(r => r.data),
  getById: (id: string) =>
    apiClient.get<ApiResponse<MedicalRecord>>(`/records/${id}`).then(r => r.data),
  create: (data: Partial<MedicalRecord>) =>
    apiClient.post<ApiResponse<MedicalRecord>>('/records', data).then(r => r.data),
};
