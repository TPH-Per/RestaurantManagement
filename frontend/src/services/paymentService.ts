import apiClient from './apiClient';

export interface PaymentDTO {
    id?: number | string;
    [key: string]: any;
}

export const paymentService = {
    getAll: () => apiClient.get<PaymentDTO[]>('/payment'),
    getById: (id: number | string) => apiClient.get<PaymentDTO>(`/payment/${id}`),
    create: (data: PaymentDTO) => apiClient.post<PaymentDTO>('/payment', data),
    update: (id: number | string, data: PaymentDTO) => apiClient.put<PaymentDTO>(`/payment/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/payment/${id}`)
};
