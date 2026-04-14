import apiClient from './client';
import type { User, ApiResponse } from '@/types';

export const usersApi = {
  list: () =>
    apiClient.get<ApiResponse<User[]>>('/users').then(r => r.data),
  create: (data: Partial<User> & { password?: string }) =>
    apiClient.post<ApiResponse<User>>('/users', data).then(r => r.data),
  update: (id: string, data: Partial<User>) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}`, data).then(r => r.data),
  delete: (id: string) =>
    apiClient.delete(`/users/${id}`),
};
