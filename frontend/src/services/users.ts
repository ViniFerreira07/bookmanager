import api from './api';
import type { User, UserFormData } from '../types';
import type { PageResponse } from './books';

export interface UserSearchParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: string;
}

function toCreatePayload(data: UserFormData) {
  return {
    username: data.username.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    role: data.role,
  };
}

function toUpdatePayload(data: UserFormData) {
  return {
    username: data.username.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password.trim() ? data.password : null,
    role: data.role,
  };
}

export const userService = {
  async list(params: UserSearchParams = {}): Promise<PageResponse<User>> {
    const response = await api.get<PageResponse<User>>('/api/users', { params });
    return response.data;
  },

  async create(data: UserFormData): Promise<User> {
    const response = await api.post<User>('/api/users', toCreatePayload(data));
    return response.data;
  },

  async update(id: string, data: UserFormData): Promise<User> {
    const response = await api.put<User>(`/api/users/${id}`, toUpdatePayload(data));
    return response.data;
  },

  async updateStatus(id: string, active: boolean): Promise<User> {
    const response = await api.patch<User>(`/api/users/${id}/status`, { active });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/users/${id}`);
  },
};
