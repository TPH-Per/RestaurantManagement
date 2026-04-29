import apiClient from './apiClient';

export interface ShiftDTO {
    id?: number | string;
    [key: string]: any;
}

export const shiftService = {
    getAll: () => apiClient.get<ShiftDTO[]>('/shift'),
    getById: (id: number | string) => apiClient.get<ShiftDTO>(`/shift/${id}`),
    create: (data: ShiftDTO) => apiClient.post<ShiftDTO>('/shift', data),
    update: (id: number | string, data: ShiftDTO) => apiClient.put<ShiftDTO>(`/shift/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/shift/${id}`)
};
