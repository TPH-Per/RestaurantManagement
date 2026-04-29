import apiClient from './apiClient';

export interface InvoiceDTO {
    id?: number | string;
    [key: string]: any;
}

export const invoiceService = {
    getAll: () => apiClient.get<InvoiceDTO[]>('/invoice'),
    getById: (id: number | string) => apiClient.get<InvoiceDTO>(`/invoice/${id}`),
    create: (data: InvoiceDTO) => apiClient.post<InvoiceDTO>('/invoice', data),
    update: (id: number | string, data: InvoiceDTO) => apiClient.put<InvoiceDTO>(`/invoice/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/invoice/${id}`)
};
