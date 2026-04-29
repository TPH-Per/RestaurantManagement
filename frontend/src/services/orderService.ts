import apiClient from './apiClient';

export interface OrderDTO {
    id?: number | string;
    [key: string]: any;
}

export const orderService = {
    getAll: () => apiClient.get<OrderDTO[]>('/order'),
    getById: (id: number | string) => apiClient.get<OrderDTO>(`/order/${id}`),
    create: (data: OrderDTO) => apiClient.post<OrderDTO>('/order', data),
    update: (id: number | string, data: OrderDTO) => apiClient.put<OrderDTO>(`/order/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/order/${id}`)
};
