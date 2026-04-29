import apiClient from './apiClient';

export interface SupplierDTO {
    id?: number | string;
    [key: string]: any;
}

export const supplierService = {
    getAll: () => apiClient.get<SupplierDTO[]>('/supplier'),
    getById: (id: number | string) => apiClient.get<SupplierDTO>(`/supplier/${id}`),
    create: (data: SupplierDTO) => apiClient.post<SupplierDTO>('/supplier', data),
    update: (id: number | string, data: SupplierDTO) => apiClient.put<SupplierDTO>(`/supplier/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/supplier/${id}`)
};
