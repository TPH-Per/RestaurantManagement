import apiClient from './apiClient';

export interface OrderItemDTO {
    id?: number | string;
    [key: string]: any;
}

export const orderItemService = {
    getAll: () => apiClient.get<OrderItemDTO[]>('/orderitem'),
    getById: (id: number | string) => apiClient.get<OrderItemDTO>(`/orderitem/${id}`),
    create: (data: OrderItemDTO) => apiClient.post<OrderItemDTO>('/orderitem', data),
    update: (id: number | string, data: OrderItemDTO) => apiClient.put<OrderItemDTO>(`/orderitem/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/orderitem/${id}`)
};
