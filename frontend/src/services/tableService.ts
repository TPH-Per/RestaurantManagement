import apiClient from './apiClient';

export interface TableDTO {
    id?: number | string;
    [key: string]: any;
}

export const tableService = {
    getAll: () => apiClient.get<TableDTO[]>('/RestaurantTable'),
    getById: (id: number | string) => apiClient.get<TableDTO>(`/RestaurantTable/${id}`),
    create: (data: TableDTO) => apiClient.post<TableDTO>('/RestaurantTable', data),
    update: (id: number | string, data: TableDTO) => apiClient.put<TableDTO>(`/RestaurantTable/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/RestaurantTable/${id}`)
};
