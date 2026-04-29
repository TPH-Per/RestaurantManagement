import apiClient from './apiClient';

export interface CustomerDTO {
    id?: number | string;
    [key: string]: any;
}

export const customerService = {
    getAll: () => apiClient.get<CustomerDTO[]>('/customer'),
    getById: (id: number | string) => apiClient.get<CustomerDTO>(`/customer/${id}`),
    create: (data: CustomerDTO) => apiClient.post<CustomerDTO>('/customer', data),
    update: (id: number | string, data: CustomerDTO) => apiClient.put<CustomerDTO>(`/customer/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/customer/${id}`)
};
