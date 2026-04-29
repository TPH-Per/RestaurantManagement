import apiClient from './apiClient';

export interface AuthDTO {
    id?: number | string;
    [key: string]: any;
}

export const authService = {
    getAll: () => apiClient.get<AuthDTO[]>('/user'),
    getById: (id: number | string) => apiClient.get<AuthDTO>(`/user/${id}`),
    create: (data: AuthDTO) => apiClient.post<AuthDTO>('/user', data),
    update: (id: number | string, data: AuthDTO) => apiClient.put<AuthDTO>(`/user/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/user/${id}`)
};
