import apiClient from './apiClient';

export interface PurchaseOrderDTO {
    id?: number | string;
    [key: string]: any;
}

export const purchaseOrderService = {
    getAll: () => apiClient.get<PurchaseOrderDTO[]>('/purchaseorder'),
    getById: (id: number | string) => apiClient.get<PurchaseOrderDTO>(`/purchaseorder/${id}`),
    create: (data: PurchaseOrderDTO) => apiClient.post<PurchaseOrderDTO>('/purchaseorder', data),
    update: (id: number | string, data: PurchaseOrderDTO) => apiClient.put<PurchaseOrderDTO>(`/purchaseorder/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/purchaseorder/${id}`)
};
