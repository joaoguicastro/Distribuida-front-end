import apiClient from './client';
import { DEV_AUTH_BYPASS } from '@/config/constants';
import type { LoginRequest, LoginResponse, User, ApiResponse } from '@/types';

const demoUser: User = {
  id: 'dev-admin',
  name: 'Administrador Local',
  email: 'admin@local.test',
  role: 'ADMIN',
  active: true,
};

export const authApi = {
  login: (data: LoginRequest) =>
    DEV_AUTH_BYPASS
      ? Promise.resolve({
          data: {
            token: 'dev-auth-token',
            user: {
              ...demoUser,
              email: data.email || demoUser.email,
            },
          },
          message: 'Login local liberado para desenvolvimento',
          status: 200,
        } satisfies ApiResponse<LoginResponse>)
      : apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data).then(r => r.data),
  logout: () =>
    DEV_AUTH_BYPASS
      ? Promise.resolve({ data: null, message: 'Logout local', status: 200 })
      : apiClient.post('/auth/logout'),
  getMe: () =>
    DEV_AUTH_BYPASS
      ? Promise.resolve({ data: demoUser, message: 'Usuário local', status: 200 })
      : apiClient.get<ApiResponse<User>>('/auth/me').then(r => r.data),
};
